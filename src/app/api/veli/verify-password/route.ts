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
    const rateLimitResult = await checkRateLimit(ip, 10, 3) // 10 deneme, 3 dakika blok
    if (!rateLimitResult.allowed) {
      const waitMinutes = rateLimitResult.blockedUntil
        ? Math.ceil((rateLimitResult.blockedUntil.getTime() - Date.now()) / 60000)
        : 5
      return NextResponse.json(
        { error: `Cok fazla basarisiz deneme. ${waitMinutes} dakika bekleyin.` },
        { status: 429 }
      )
    }

    // OKUL sifresini kontrol et (okul bazli giris)
    const school = await prisma.school.findFirst({
      where: {
        password: password.toUpperCase(),
        isActive: true
      },
      select: {
        id: true,
        name: true,
        deliveryType: true,
        classes: {
          where: {
            isActive: true,
            package: {
              isActive: true
            }
          },
          select: {
            id: true,
            name: true,
            package: {
              select: {
                id: true,
                name: true,
                description: true,
                note: true,
                price: true,
                items: {
                  select: {
                    id: true,
                    name: true,
                    quantity: true
                    // Fiyat veliye gosterilmez
                  },
                  orderBy: { name: 'asc' }
                }
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

    // Aktif sinif/paket var mi kontrol et
    const classesWithPackages = school.classes.filter(c => c.package !== null)

    if (classesWithPackages.length === 0) {
      return NextResponse.json(
        { error: 'Bu okul icin henuz aktif bir paket tanimlanmamis.' },
        { status: 404 }
      )
    }

    // Basarili giris - rate limit sifirla
    await resetRateLimit(ip)

    // Okul ve tum sinif/paket bilgilerini dondur
    return NextResponse.json({
      success: true,
      schoolId: school.id,
      schoolName: school.name,
      deliveryType: school.deliveryType,
      classes: classesWithPackages.map(cls => ({
        id: cls.id,
        name: cls.name,
        package: cls.package ? {
          id: cls.package.id,
          name: cls.package.name,
          description: cls.package.description,
          note: cls.package.note,
          price: cls.package.price,
          items: cls.package.items
        } : null
      }))
    })

  } catch (error) {
    console.error('Sifre dogrulama hatasi:', error)
    return NextResponse.json(
      { error: 'Bir hata olustu. Lutfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}
