// Turkce renk isimleri (buyuk harf)
const COLORS = [
  'KIRMIZI', 'MAVI', 'YESIL', 'SARI', 'TURUNCU', 'MOR', 'PEMBE', 'GRI',
  'BEYAZ', 'SIYAH', 'KAHVE', 'LACIVERT', 'TURKUAZ', 'BORDO', 'BEJ'
]

// Turkce hayvan isimleri
const ANIMALS = [
  'ASLAN', 'KAPLAN', 'KARTAL', 'YUNUS', 'PANDA', 'KURT', 'TILKI',
  'TAVSAN', 'KELEBEK', 'ARICI', 'BAYKUS', 'PAPAGAN', 'GEYIK', 'SINCAP'
]

export type PasswordType = 'readable' | 'random' | 'numeric'

export function generateClassPassword(type: PasswordType = 'readable'): string {
  switch (type) {
    case 'readable': {
      // RENK + HAYVAN + 2 RAKAM: KIRMIZI-ASLAN-24
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
      const number = Math.floor(Math.random() * 90 + 10) // 10-99
      return `${color}${number}`
    }
    case 'random': {
      // 6 karakterlik alfanumerik: A3K9M2
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // I, O, 0, 1 cikartildi
      let password = ''
      for (let i = 0; i < 6; i++) {
        password += chars[Math.floor(Math.random() * chars.length)]
      }
      return password
    }
    case 'numeric': {
      // 6 haneli rakam: 123456
      return Math.floor(Math.random() * 900000 + 100000).toString()
    }
    default:
      return generateClassPassword('readable')
  }
}

export function generateSchoolPassword(): string {
  // SFR-XXXX formati
  const number = Math.floor(Math.random() * 9000 + 1000) // 1000-9999
  return `SFR-${number}`
}

export function generateMudurPassword(): string {
  // 8 karakterlik guclu sifre
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }
  return password
}
