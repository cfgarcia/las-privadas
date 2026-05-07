export type ReservationArtist = {
  id: string
  name: string
  description: string
  imageUrl: string | null
  bookingImageUrl: string | null
  genre?: string | null
  city?: string | null
  songs?: ReservationSong[]
}

export type ReservationSong = {
  id: string
  title: string
  mp3Url: string | null
}

export type Booking = {
  artist: ReservationArtist
  date: Date
  time: string                       // 'dia' | 'tarde' | 'noche' | 'madrugada'
  duration: number                   // minutes — 60 / 120 / 180 / 240 / 300
  country: string                    // 'MX' | 'US' | 'OTHER'
  state: string
  city: string
  eventType: 'personal' | 'negocio'
  requests: string
  name: string
  contact: string
}
