/**
 * Prisma Seed - Test Verileri
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seed baslatiyor...')

  // Admin kullanicisi olustur
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@okultedarik.com' },
    update: {},
    create: {
      name: 'Sistem Yoneticisi',
      email: 'admin@okultedarik.com',
      password: adminPassword
    }
  })
  console.log('Admin olusturuldu:', admin.email)

  // Paketler olustur
  const paket1 = await prisma.package.create({
    data: {
      name: '1. Sinif Kitap Paketi',
      description: '1. sinif ogrencileri icin hazirlanmis tam kitap seti',
      note: 'Tum kitaplar MEB mufredatina uygundur',
      price: 450.00,
      items: {
        create: [
          { name: 'Turkce Ders Kitabi', quantity: 1, price: 85.00 },
          { name: 'Matematik Ders Kitabi', quantity: 1, price: 85.00 },
          { name: 'Hayat Bilgisi Ders Kitabi', quantity: 1, price: 75.00 },
          { name: 'Turkce Calisma Kitabi', quantity: 1, price: 65.00 },
          { name: 'Matematik Calisma Kitabi', quantity: 1, price: 65.00 },
          { name: 'Boyama Kitabi', quantity: 1, price: 35.00 },
          { name: 'Defter Seti (5 adet)', quantity: 1, price: 40.00 }
        ]
      }
    }
  })
  console.log('Paket 1 olusturuldu:', paket1.name)

  const paket2 = await prisma.package.create({
    data: {
      name: '2. Sinif Kitap Paketi',
      description: '2. sinif ogrencileri icin hazirlanmis tam kitap seti',
      note: 'Tum kitaplar MEB mufredatina uygundur',
      price: 520.00,
      items: {
        create: [
          { name: 'Turkce Ders Kitabi', quantity: 1, price: 90.00 },
          { name: 'Matematik Ders Kitabi', quantity: 1, price: 90.00 },
          { name: 'Hayat Bilgisi Ders Kitabi', quantity: 1, price: 80.00 },
          { name: 'Turkce Calisma Kitabi', quantity: 1, price: 70.00 },
          { name: 'Matematik Calisma Kitabi', quantity: 1, price: 70.00 },
          { name: 'Ingilizce Ders Kitabi', quantity: 1, price: 75.00 },
          { name: 'Defter Seti (5 adet)', quantity: 1, price: 45.00 }
        ]
      }
    }
  })
  console.log('Paket 2 olusturuldu:', paket2.name)

  const paket3 = await prisma.package.create({
    data: {
      name: '3. Sinif Kitap Paketi',
      description: '3. sinif ogrencileri icin hazirlanmis tam kitap seti',
      note: 'Fen Bilimleri dersi eklendi',
      price: 580.00,
      items: {
        create: [
          { name: 'Turkce Ders Kitabi', quantity: 1, price: 95.00 },
          { name: 'Matematik Ders Kitabi', quantity: 1, price: 95.00 },
          { name: 'Fen Bilimleri Ders Kitabi', quantity: 1, price: 85.00 },
          { name: 'Hayat Bilgisi Ders Kitabi', quantity: 1, price: 80.00 },
          { name: 'Ingilizce Ders Kitabi', quantity: 1, price: 80.00 },
          { name: 'Calisma Kitabi Seti', quantity: 1, price: 100.00 },
          { name: 'Defter Seti (5 adet)', quantity: 1, price: 45.00 }
        ]
      }
    }
  })
  console.log('Paket 3 olusturuldu:', paket3.name)

  // Okul 1 olustur
  const mudur1Password = await bcrypt.hash('mudur123', 12)
  const okul1 = await prisma.school.create({
    data: {
      name: 'Ataturk Ilkokulu',
      address: 'Cumhuriyet Mah. Okul Cad. No:15, Cankaya/Ankara',
      phone: '0312 123 45 67',
      email: 'info@ataturkilkokulu.k12.tr',
      deliveryType: 'SCHOOL_DELIVERY',
      directorName: 'Ahmet Yilmaz',
      directorEmail: 'mudur@ataturkilkokulu.k12.tr',
      directorPassword: mudur1Password,
      classes: {
        create: [
          { name: '1-A', password: 'KIRMIZI24', commissionAmount: 25.00, packageId: paket1.id },
          { name: '1-B', password: 'MAVI35', commissionAmount: 25.00, packageId: paket1.id },
          { name: '2-A', password: 'YESIL42', commissionAmount: 30.00, packageId: paket2.id },
          { name: '2-B', password: 'SARI18', commissionAmount: 30.00, packageId: paket2.id },
          { name: '3-A', password: 'MOR67', commissionAmount: 35.00, packageId: paket3.id },
          { name: '3-B', password: 'TURUNCU89', commissionAmount: 35.00, packageId: paket3.id }
        ]
      }
    }
  })
  console.log('Okul 1 olusturuldu:', okul1.name)

  // Okul 2 olustur
  const mudur2Password = await bcrypt.hash('mudur456', 12)
  const okul2 = await prisma.school.create({
    data: {
      name: 'Fatih Sultan Mehmet Ilkokulu',
      address: 'Zafer Mah. Egitim Sok. No:8, Kecioren/Ankara',
      phone: '0312 987 65 43',
      email: 'info@fsmilkokulu.k12.tr',
      deliveryType: 'CARGO',
      directorName: 'Fatma Demir',
      directorEmail: 'mudur@fsmilkokulu.k12.tr',
      directorPassword: mudur2Password,
      classes: {
        create: [
          { name: '1-A', password: 'PEMBE11', commissionAmount: 20.00, packageId: paket1.id },
          { name: '1-B', password: 'GRI22', commissionAmount: 20.00, packageId: paket1.id },
          { name: '2-A', password: 'BEYAZ33', commissionAmount: 25.00, packageId: paket2.id },
          { name: '3-A', password: 'SIYAH44', commissionAmount: 30.00, packageId: paket3.id }
        ]
      }
    }
  })
  console.log('Okul 2 olusturuldu:', okul2.name)

  // Okul 3 olustur
  const mudur3Password = await bcrypt.hash('mudur789', 12)
  const okul3 = await prisma.school.create({
    data: {
      name: 'Cumhuriyet Ilkokulu',
      address: 'Yeni Mah. Bagimsizlik Cad. No:25, Mamak/Ankara',
      phone: '0312 555 44 33',
      email: 'info@cumhuriyetilkokulu.k12.tr',
      deliveryType: 'SCHOOL_DELIVERY',
      directorName: 'Mehmet Ozturk',
      directorEmail: 'mudur@cumhuriyetilkokulu.k12.tr',
      directorPassword: mudur3Password,
      classes: {
        create: [
          { name: '1-A', password: 'KAHVE55', commissionAmount: 22.00, packageId: paket1.id },
          { name: '2-A', password: 'LACIVERT66', commissionAmount: 27.00, packageId: paket2.id },
          { name: '2-B', password: 'BORDO77', commissionAmount: 27.00, packageId: paket2.id },
          { name: '3-A', password: 'TURKUAZ88', commissionAmount: 32.00, packageId: paket3.id }
        ]
      }
    }
  })
  console.log('Okul 3 olusturuldu:', okul3.name)

  // Ornek siparisler olustur
  const siniflar = await prisma.class.findMany({
    include: { school: true, package: true }
  })

  // Ilk sinif icin ornek siparis
  const sinif1 = siniflar[0]
  if (sinif1 && sinif1.package) {
    const siparis1 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-20250114-TEST1',
        parentName: 'Ali Kaya',
        studentName: 'Ayse Kaya',
        phone: '05551234567',
        email: 'ali.kaya@email.com',
        address: 'Ornek Mah. Test Sok. No:1 Ankara',
        totalAmount: sinif1.package.price,
        status: 'COMPLETED',
        paymentMethod: 'CREDIT_CARD',
        paymentId: 'mock_payment_1',
        paidAt: new Date(),
        invoiceNo: 'INV-20250114-000001',
        invoiceDate: new Date(),
        deliveredAt: new Date(),
        classId: sinif1.id,
        packageId: sinif1.package.id
      }
    })
    console.log('Ornek siparis 1 olusturuldu:', siparis1.orderNumber)
  }

  // Ikinci sinif icin ornek siparis (odeme bekliyor)
  const sinif2 = siniflar[1]
  if (sinif2 && sinif2.package) {
    const siparis2 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-20250114-TEST2',
        parentName: 'Veli Yilmaz',
        studentName: 'Efe Yilmaz',
        phone: '05559876543',
        email: 'veli.yilmaz@email.com',
        totalAmount: sinif2.package.price,
        status: 'PAYMENT_PENDING',
        classId: sinif2.id,
        packageId: sinif2.package.id
      }
    })
    console.log('Ornek siparis 2 olusturuldu:', siparis2.orderNumber)
  }

  // Ucuncu sinif icin ornek siparis (kargoda)
  const sinif3 = siniflar.find(s => s.school.deliveryType === 'CARGO')
  if (sinif3 && sinif3.package) {
    const siparis3 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-20250114-TEST3',
        parentName: 'Zeynep Aksoy',
        studentName: 'Can Aksoy',
        phone: '05557778899',
        email: 'zeynep.aksoy@email.com',
        address: 'Kargo Teslim Mah. Gonderim Sok. No:5 Ankara',
        totalAmount: sinif3.package.price,
        status: 'CARGO_SHIPPED',
        paymentMethod: 'CREDIT_CARD',
        paymentId: 'mock_payment_3',
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 gun once
        invoiceNo: 'INV-20250112-000003',
        invoiceDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        trackingNo: 'ARAS1234567890',
        shippedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 gun once
        classId: sinif3.id,
        packageId: sinif3.package.id
      }
    })
    console.log('Ornek siparis 3 olusturuldu:', siparis3.orderNumber)
  }

  console.log('')
  console.log('==========================================')
  console.log('Seed tamamlandi!')
  console.log('==========================================')
  console.log('')
  console.log('Giris Bilgileri:')
  console.log('----------------')
  console.log('Admin: admin@okultedarik.com / admin123')
  console.log('Mudur 1: mudur@ataturkilkokulu.k12.tr / mudur123')
  console.log('Mudur 2: mudur@fsmilkokulu.k12.tr / mudur456')
  console.log('Mudur 3: mudur@cumhuriyetilkokulu.k12.tr / mudur789')
  console.log('')
  console.log('Ornek Sinif Sifreleri:')
  console.log('----------------------')
  console.log('Ataturk Ilkokulu 1-A: KIRMIZI24')
  console.log('Ataturk Ilkokulu 1-B: MAVI35')
  console.log('Ataturk Ilkokulu 2-A: YESIL42')
  console.log('FSM Ilkokulu 1-A: PEMBE11')
  console.log('Cumhuriyet Ilkokulu 1-A: KAHVE55')
  console.log('')
}

main()
  .catch((e) => {
    console.error('Seed hatasi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
