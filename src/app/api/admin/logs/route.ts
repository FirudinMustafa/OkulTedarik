import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erisim' }, { status: 401 })
    }

    const logs = await prisma.systemLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500 // Son 500 log
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Loglar listelenemedi:', error)
    return NextResponse.json(
      { error: 'Loglar yuklenemedi' },
      { status: 500 }
    )
  }
}
