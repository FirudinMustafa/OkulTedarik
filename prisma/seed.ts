/**
 * Prisma Seed - Test Verileri
 * Her çalıştırıldığında tüm verileri siler ve yeniden oluşturur.
 *
 * 3 Okul, 14 Sınıf, 3 Paket, 15 Sipariş
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seed başlatılıyor...')
  console.log('Mevcut veriler temizleniyor...')

  // Tüm verileri sil (sıra önemli - foreign key)
  await prisma.cancelRequest.deleteMany()
  await prisma.deliveryDocument.deleteMany()
  await prisma.schoolPayment.deleteMany()
  await prisma.order.deleteMany()
  await prisma.systemLog.deleteMany()
  await prisma.rateLimitLog.deleteMany()
  await prisma.discount.deleteMany()
  await prisma.class.deleteMany()
  await prisma.packageItem.deleteMany()
  await prisma.package.deleteMany()
  await prisma.school.deleteMany()
  await prisma.admin.deleteMany()

  console.log('Veriler temizlendi.')

  // ==========================================
  // ADMİN
  // ==========================================
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.admin.create({
    data: {
      name: 'Sistem Yöneticisi',
      email: 'admin@okultedarik.com',
      password: adminPassword
    }
  })
  console.log('Admin oluşturuldu:', admin.email)

  // ==========================================
  // PAKETLER (3 Paket)
  // ==========================================

  const paketA1 = await prisma.package.create({
    data: {
      name: 'A1 - Starter Pack',
      description: '1. sınıf öğrencileri için başlangıç seti',
      note: 'Tüm kitaplar MEB müfredatına uygundur',
      price: 450.00,
      items: {
        create: [
          { name: 'Student Book A1', quantity: 1, price: 150.00 },
          { name: 'Workbook A1', quantity: 1, price: 120.00 },
          { name: 'Activity Book A1', quantity: 1, price: 100.00 },
          { name: 'Sticker Set', quantity: 1, price: 80.00 }
        ]
      }
    }
  })
  console.log('Paket oluşturuldu:', paketA1.name)

  const paketA2 = await prisma.package.create({
    data: {
      name: 'A2 - Elementary Pack',
      description: '2. sınıf öğrencileri için temel set',
      note: 'Dinleme CD\'si dahildir',
      price: 520.00,
      items: {
        create: [
          { name: 'Student Book A2', quantity: 1, price: 160.00 },
          { name: 'Workbook A2', quantity: 1, price: 130.00 },
          { name: 'Grammar Book A2', quantity: 1, price: 110.00 },
          { name: 'Audio CD', quantity: 1, price: 120.00 }
        ]
      }
    }
  })
  console.log('Paket oluşturuldu:', paketA2.name)

  const paketB1 = await prisma.package.create({
    data: {
      name: 'B1 - Intermediate Pack',
      description: '3. sınıf öğrencileri için orta seviye set',
      note: 'Online erişim kodu dahildir',
      price: 580.00,
      items: {
        create: [
          { name: 'Student Book B1', quantity: 1, price: 180.00 },
          { name: 'Workbook B1', quantity: 1, price: 140.00 },
          { name: 'Online Access Code', quantity: 1, price: 150.00 },
          { name: 'Practice Tests', quantity: 1, price: 110.00 }
        ]
      }
    }
  })
  console.log('Paket oluşturuldu:', paketB1.name)

  // ==========================================
  // OKUL 1 - Atatürk İlkokulu (5 Sınıf, Okula Teslim)
  // ==========================================
  const mudur1Password = await bcrypt.hash('mudur123', 12)
  const okul1 = await prisma.school.create({
    data: {
      name: 'Atatürk İlkokulu',
      address: 'Cumhuriyet Mah. Eğitim Cad. No:15, Çankaya/Ankara',
      phone: '0312 123 45 67',
      email: 'info@ataturk.k12.tr',
      password: 'ATATURK2024',
      deliveryType: 'SCHOOL_DELIVERY',
      directorName: 'Ahmet Yılmaz',
      directorEmail: 'mudur@ataturk.k12.tr',
      directorPassword: mudur1Password,
      classes: {
        create: [
          { name: '1-A', commissionAmount: 25.00, packageId: paketA1.id },
          { name: '1-B', commissionAmount: 25.00, packageId: paketA1.id },
          { name: '2-A', commissionAmount: 30.00, packageId: paketA2.id },
          { name: '2-B', commissionAmount: 30.00, packageId: paketA2.id },
          { name: '3-A', commissionAmount: 35.00, packageId: paketB1.id }
        ]
      }
    }
  })
  console.log('Okul oluşturuldu:', okul1.name, '(5 sınıf)')

  // ==========================================
  // OKUL 2 - Fatih İlkokulu (5 Sınıf, Kargo Teslim)
  // ==========================================
  const mudur2Password = await bcrypt.hash('mudur456', 12)
  const okul2 = await prisma.school.create({
    data: {
      name: 'Fatih İlkokulu',
      address: 'Zafer Mah. Okul Sok. No:8, Keçiören/Ankara',
      phone: '0312 987 65 43',
      email: 'info@fatih.k12.tr',
      password: 'FATIH2024',
      deliveryType: 'CARGO',
      directorName: 'Fatma Demir',
      directorEmail: 'mudur@fatih.k12.tr',
      directorPassword: mudur2Password,
      classes: {
        create: [
          { name: '1-A', commissionAmount: 20.00, packageId: paketA1.id },
          { name: '1-B', commissionAmount: 20.00, packageId: paketA1.id },
          { name: '2-A', commissionAmount: 25.00, packageId: paketA2.id },
          { name: '3-A', commissionAmount: 30.00, packageId: paketB1.id },
          { name: '3-B', commissionAmount: 30.00, packageId: paketB1.id }
        ]
      }
    }
  })
  console.log('Okul oluşturuldu:', okul2.name, '(5 sınıf)')

  // ==========================================
  // OKUL 3 - Cumhuriyet İlkokulu (4 Sınıf, Okula Teslim)
  // ==========================================
  const mudur3Password = await bcrypt.hash('mudur789', 12)
  const okul3 = await prisma.school.create({
    data: {
      name: 'Cumhuriyet İlkokulu',
      address: 'Yeni Mah. Bağımsızlık Cad. No:25, Mamak/Ankara',
      phone: '0312 555 44 33',
      email: 'info@cumhuriyet.k12.tr',
      password: 'CUMHURIYET2024',
      deliveryType: 'SCHOOL_DELIVERY',
      directorName: 'Mehmet Öztürk',
      directorEmail: 'mudur@cumhuriyet.k12.tr',
      directorPassword: mudur3Password,
      classes: {
        create: [
          { name: '1-A', commissionAmount: 22.00, packageId: paketA1.id },
          { name: '2-A', commissionAmount: 27.00, packageId: paketA2.id },
          { name: '2-B', commissionAmount: 27.00, packageId: paketA2.id },
          { name: '3-A', commissionAmount: 32.00, packageId: paketB1.id }
        ]
      }
    }
  })
  console.log('Okul oluşturuldu:', okul3.name, '(4 sınıf)')

  // ==========================================
  // SİPARİŞLER (15 Sipariş - yeni 6 durum ile)
  // ==========================================
  const siniflar = await prisma.class.findMany({
    include: { school: true, package: true }
  })

  const now = new Date()
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)

  const siparisler: Array<{
    okulAdi: string
    sinifAdi: string
    veli: string
    ogrenci: string
    phone: string
    status: 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED'
    paid: boolean
    address?: string
    createdDaysAgo: number
  }> = [
    // Okul 1 - Atatürk İlkokulu (Okula Teslim - 5 sipariş)
    { okulAdi: 'Atatürk İlkokulu', sinifAdi: '1-A', veli: 'Ali Kaya', ogrenci: 'Elif Kaya', phone: '05301234567', status: 'COMPLETED', paid: true, createdDaysAgo: 20 },
    { okulAdi: 'Atatürk İlkokulu', sinifAdi: '1-A', veli: 'Mehmet Yıldız', ogrenci: 'Can Yıldız', phone: '05302345678', status: 'PAID', paid: true, createdDaysAgo: 2 },
    { okulAdi: 'Atatürk İlkokulu', sinifAdi: '1-B', veli: 'Ayşe Demir', ogrenci: 'Zeynep Demir', phone: '05303456789', status: 'PREPARING', paid: true, createdDaysAgo: 5 },
    { okulAdi: 'Atatürk İlkokulu', sinifAdi: '2-A', veli: 'Fatma Çelik', ogrenci: 'Burak Çelik', phone: '05304567890', status: 'DELIVERED', paid: true, createdDaysAgo: 10 },
    { okulAdi: 'Atatürk İlkokulu', sinifAdi: '3-A', veli: 'Hasan Arslan', ogrenci: 'Selin Arslan', phone: '05305678901', status: 'PAID', paid: true, createdDaysAgo: 1 },

    // Okul 2 - Fatih İlkokulu (Kargo Teslim - 5 sipariş)
    { okulAdi: 'Fatih İlkokulu', sinifAdi: '1-A', veli: 'Veli Şahin', ogrenci: 'Efe Şahin', phone: '05306789012', status: 'SHIPPED', paid: true, address: 'Bahçelievler Mah. No:12 Keçiören/Ankara', createdDaysAgo: 8 },
    { okulAdi: 'Fatih İlkokulu', sinifAdi: '1-B', veli: 'Zehra Koç', ogrenci: 'Ada Koç', phone: '05307890123', status: 'DELIVERED', paid: true, address: 'Yenimahalle Cad. No:45 Ankara', createdDaysAgo: 12 },
    { okulAdi: 'Fatih İlkokulu', sinifAdi: '2-A', veli: 'Mustafa Özdemir', ogrenci: 'Yusuf Özdemir', phone: '05308901234', status: 'PAID', paid: true, createdDaysAgo: 3 },
    { okulAdi: 'Fatih İlkokulu', sinifAdi: '3-A', veli: 'Emine Aydın', ogrenci: 'Defne Aydın', phone: '05309012345', status: 'PREPARING', paid: true, address: 'Etlik Mah. No:78 Ankara', createdDaysAgo: 6 },
    { okulAdi: 'Fatih İlkokulu', sinifAdi: '3-B', veli: 'İbrahim Yılmaz', ogrenci: 'Mert Yılmaz', phone: '05300123456', status: 'CANCELLED', paid: false, createdDaysAgo: 15 },

    // Okul 3 - Cumhuriyet İlkokulu (Okula Teslim - 5 sipariş)
    { okulAdi: 'Cumhuriyet İlkokulu', sinifAdi: '1-A', veli: 'Kemal Aksoy', ogrenci: 'Beren Aksoy', phone: '05321234567', status: 'COMPLETED', paid: true, createdDaysAgo: 25 },
    { okulAdi: 'Cumhuriyet İlkokulu', sinifAdi: '2-A', veli: 'Nurcan Tekin', ogrenci: 'Arda Tekin', phone: '05322345678', status: 'PREPARING', paid: true, createdDaysAgo: 4 },
    { okulAdi: 'Cumhuriyet İlkokulu', sinifAdi: '2-B', veli: 'Serkan Doğan', ogrenci: 'Nil Doğan', phone: '05323456789', status: 'PAID', paid: true, createdDaysAgo: 1 },
    { okulAdi: 'Cumhuriyet İlkokulu', sinifAdi: '3-A', veli: 'Gülşen Kurt', ogrenci: 'Atlas Kurt', phone: '05324567890', status: 'DELIVERED', paid: true, createdDaysAgo: 14 },
    { okulAdi: 'Cumhuriyet İlkokulu', sinifAdi: '1-A', veli: 'Ömer Polat', ogrenci: 'Lina Polat', phone: '05325678901', status: 'PAID', paid: true, createdDaysAgo: 2 }
  ]

  let orderCount = 1
  for (const sip of siparisler) {
    const sinif = siniflar.find(s => s.school.name === sip.okulAdi && s.name === sip.sinifAdi)
    if (sinif && sinif.package) {
      const createdAt = daysAgo(sip.createdDaysAgo)
      const orderNumber = `ORD-${createdAt.getFullYear()}${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(orderCount).padStart(4, '0')}`

      // Tarihleri duruma göre ayarla
      const paidAt = sip.paid ? new Date(createdAt.getTime() + 10 * 60 * 1000) : null // ödeme 10dk sonra
      const invoiceDate = ['PREPARING', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(sip.status)
        ? new Date(createdAt.getTime() + 1 * 24 * 60 * 60 * 1000) // 1 gün sonra
        : null
      const shippedAt = ['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(sip.status)
        ? new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 gün sonra
        : null
      const deliveredAt = ['DELIVERED', 'COMPLETED'].includes(sip.status)
        ? new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 gün sonra
        : null

      await prisma.order.create({
        data: {
          orderNumber,
          parentName: sip.veli,
          studentName: sip.ogrenci,
          phone: sip.phone,
          email: `${sip.veli.toLowerCase().replace(/\s/g, '.').replace(/[şŞ]/g, 's').replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[öÖ]/g, 'o').replace(/[ıİ]/g, 'i')}@email.com`,
          address: sip.address || null,
          totalAmount: sinif.package.price,
          status: sip.status,
          paymentMethod: sip.paid ? 'CREDIT_CARD' : null,
          paymentId: sip.paid ? `mock_payment_${orderCount}` : null,
          paidAt,
          invoiceNo: invoiceDate
            ? `INV-${createdAt.getFullYear()}-${String(orderCount).padStart(5, '0')}`
            : null,
          invoiceDate,
          trackingNo: shippedAt
            ? `ARAS${String(Math.random()).slice(2, 12)}`
            : null,
          shippedAt,
          deliveredAt,
          createdAt,
          classId: sinif.id,
          packageId: sinif.package.id
        }
      })
      console.log(`Sipariş ${orderCount} oluşturuldu:`, orderNumber, `(${sip.status})`)
      orderCount++
    }
  }

  // ==========================================
  // ÖZET
  // ==========================================
  console.log('')
  console.log('==========================================')
  console.log('SEED TAMAMLANDI!')
  console.log('==========================================')
  console.log('')
  console.log('GİRİŞ BİLGİLERİ')
  console.log('==========================================')
  console.log('')
  console.log('ADMİN PANELİ (http://localhost:3000/admin)')
  console.log('  Email: admin@okultedarik.com')
  console.log('  Şifre: admin123')
  console.log('')
  console.log('MÜDÜR PANELİ (http://localhost:3000/mudur)')
  console.log('  Atatürk İlkokulu:')
  console.log('    Email: mudur@ataturk.k12.tr')
  console.log('    Şifre: mudur123')
  console.log('')
  console.log('  Fatih İlkokulu:')
  console.log('    Email: mudur@fatih.k12.tr')
  console.log('    Şifre: mudur456')
  console.log('')
  console.log('  Cumhuriyet İlkokulu:')
  console.log('    Email: mudur@cumhuriyet.k12.tr')
  console.log('    Şifre: mudur789')
  console.log('')
  console.log('VELİ GİRİŞİ - OKUL ŞİFRELERİ')
  console.log('==========================================')
  console.log('')
  console.log('Atatürk İlkokulu (Okula Teslim):')
  console.log('  Şifre: ATATURK2024')
  console.log('  Sınıflar: 1-A, 1-B, 2-A, 2-B, 3-A')
  console.log('')
  console.log('Fatih İlkokulu (Kargo Teslim):')
  console.log('  Şifre: FATIH2024')
  console.log('  Sınıflar: 1-A, 1-B, 2-A, 3-A, 3-B')
  console.log('')
  console.log('Cumhuriyet İlkokulu (Okula Teslim):')
  console.log('  Şifre: CUMHURIYET2024')
  console.log('  Sınıflar: 1-A, 2-A, 2-B, 3-A')
  console.log('')
}

main()
  .catch((e) => {
    console.error('Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
