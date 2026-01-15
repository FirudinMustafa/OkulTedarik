import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Sifre gerekli' },
        { status: 400 }
      )
    }

    // IP adresini al (rate limiting icin)
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Rate limit kontrolu
    const rateLimitResult = await checkRateLimit(ip, 5, 5) // 5 deneme, 5 dakika blok
    if (!rateLimitResult.allowed) {
      const waitMinutes = rateLimitResult.blockedUntil
        ? Math.ceil((rateLimitResult.blockedUntil.getTime() - Date.now()) / 60000)
        : 5
      return NextResponse.json(
        { error: `Cok fazla basarisiz deneme. ${waitMinutes} dakika bekleyin.` },
        { status: 429 }
      )
    }

    // Okul sifresini kontrol et
    const school = await prisma.school.findFirst({
      where: {
        password: password.toUpperCase(),
        isActive: true
      },
      include: {
        classes: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            package: {
              select: {
                id: true,
                name: true,
                price: true,
                isActive: true
              }
            }
          },
          orderBy: { name: 'asc' }
        }
      }
    })

    if (!school) {
      // Basarisiz deneme kaydet
      await recordFailedAttempt(ip)
      return NextResponse.json(
        { error: 'Gecersiz sifre. Lutfen okulunuzdan aldiginiz sifreyi kontrol edin.' },
        { status: 401 }
      )
    }

    // Aktif sinif var mi kontrol et
    if (school.classes.length === 0) {
      return NextResponse.json(
        { error: 'Bu okul icin henuz aktif sinif tanimlanmamis.' },
        { status: 404 }
      )
    }

    // Basarili giris - rate limit sifirla
    await resetRateLimit(ip)

    // Siniflari filtrele - paketi olan siniflari dondur
    const classesWithPackage = school.classes.filter(
      cls => cls.package && cls.package.isActive
    ).map(cls => ({
      id: cls.id,
      name: cls.name,
      packageId: cls.package!.id,
      packageName: cls.package!.name,
      packagePrice: cls.package!.price
    }))

    return NextResponse.json({
      success: true,
      schoolId: school.id,
      schoolName: school.name,
      deliveryType: school.deliveryType,
      classes: classesWithPackage
    })

  } catch (error) {
    console.error('Sifre dogrulama hatasi:', error)
    return NextResponse.json(
      { error: 'Bir hata olustu. Lutfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}
