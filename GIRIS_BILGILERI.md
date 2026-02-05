# Okul Tedarik Sistemi - Giris Bilgileri

## Admin Paneli
**URL:** http://localhost:3000/admin

| Rol | Email | Sifre |
|-----|-------|-------|
| Sistem Yoneticisi | admin@okultedarik.com | admin123 |

---

## Mudur Paneli
**URL:** http://localhost:3000/mudur

| Okul | Email | Sifre |
|------|-------|-------|
| Ataturk Ilkokulu | mudur@ataturk.k12.tr | mudur123 |
| Fatih Ilkokulu | mudur@fatih.k12.tr | mudur456 |
| Cumhuriyet Ilkokulu | mudur@cumhuriyet.k12.tr | mudur789 |

---

## Veli Girisi - Sinif Sifreleri
**URL:** http://localhost:3000/siparis

Veli sadece **sinif sifresi** ile giris yapar ve dogrudan o sinifin paketini gorur.

### Ataturk Ilkokulu (Okula Teslim)
| Sinif | Sifre | Paket |
|-------|-------|-------|
| 1-A | KIRMIZI24 | A1 - Starter Pack (450 TL) |
| 1-B | MAVI35 | A1 - Starter Pack (450 TL) |
| 2-A | YESIL42 | A2 - Elementary Pack (520 TL) |
| 2-B | SARI18 | A2 - Elementary Pack (520 TL) |
| 3-A | MOR67 | B1 - Intermediate Pack (580 TL) |

### Fatih Ilkokulu (Kargo Teslim)
| Sinif | Sifre | Paket |
|-------|-------|-------|
| 1-A | PEMBE11 | A1 - Starter Pack (450 TL) |
| 1-B | GRI22 | A1 - Starter Pack (450 TL) |
| 2-A | BEYAZ33 | A2 - Elementary Pack (520 TL) |
| 3-A | SIYAH44 | B1 - Intermediate Pack (580 TL) |
| 3-B | TURUNCU55 | B1 - Intermediate Pack (580 TL) |

### Cumhuriyet Ilkokulu (Okula Teslim)
| Sinif | Sifre | Paket |
|-------|-------|-------|
| 1-A | KAHVE55 | A1 - Starter Pack (450 TL) |
| 2-A | LACIVERT66 | A2 - Elementary Pack (520 TL) |
| 2-B | BORDO77 | A2 - Elementary Pack (520 TL) |
| 3-A | TURKUAZ88 | B1 - Intermediate Pack (580 TL) |

---

## Paket Bilgileri

| Paket | Fiyat | Icerik |
|-------|-------|--------|
| A1 - Starter Pack | 450 TL | Student Book, Workbook, Activity Book, Sticker Set |
| A2 - Elementary Pack | 520 TL | Student Book, Workbook, Grammar Book, Audio CD |
| B1 - Intermediate Pack | 580 TL | Student Book, Workbook, Online Access Code, Practice Tests |

---

## Teslim Turleri

| Okul | Teslim Turu | Aciklama |
|------|-------------|----------|
| Ataturk Ilkokulu | Okula Teslim | Siparisler okula toplu teslim edilir |
| Fatih Ilkokulu | Kargo | Siparisler velinin adresine kargo ile gonderilir |
| Cumhuriyet Ilkokulu | Okula Teslim | Siparisler okula toplu teslim edilir |

---

## Okul Referans Kodlari (Sadece Admin Icin)

Bu kodlar veliler tarafindan kullanilmaz, sadece admin panelinde referans amaclidir.

| Okul | Referans Kodu |
|------|---------------|
| Ataturk Ilkokulu | ATA-2024-REF01 |
| Fatih Ilkokulu | FAT-2024-REF02 |
| Cumhuriyet Ilkokulu | CUM-2024-REF03 |

---

## Ornek Siparisler (15 Adet)

Sistem 15 ornek siparis ile baslatilir:
- 5 siparis: Ataturk Ilkokulu (cesitli durumlar)
- 5 siparis: Fatih Ilkokulu (kargo teslimatli)
- 5 siparis: Cumhuriyet Ilkokulu (cesitli durumlar)

Siparis durumlari: NEW, PAYMENT_PENDING, PAYMENT_RECEIVED, CONFIRMED, INVOICED, CARGO_SHIPPED, DELIVERED_TO_SCHOOL, DELIVERED_BY_CARGO, COMPLETED

---

## Hizli Erisim Linkleri

- Ana Sayfa: http://localhost:3000
- Siparis Ver: http://localhost:3000/siparis
- Siparis Takip: http://localhost:3000/siparis-takip
- Admin Paneli: http://localhost:3000/admin
- Mudur Paneli: http://localhost:3000/mudur
- Prisma Studio: `npm run db:studio`

---

## Veritabani Komutlari

```bash
# Veritabanini sifirla ve seed yukle
npm run db:reset

# Sadece seed calistir
npm run db:seed

# Prisma Studio (veritabani goruntuleyici)
npm run db:studio
```
