import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFavoriteHotels, searchHotels, toggleFavoriteHotel } from '../lib/hotelApi'
import type { HotelSearchResult } from '../lib/hotelApi'

function Hotels() {
  const [hotels, setHotels] = useState<HotelSearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [destination, setDestination] = useState('Dubai')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    void loadHotels()
    setFavorites(getFavoriteHotels())
  }, [])

  async function loadHotels() {
    setLoading(true)
    const results = await searchHotels({ destination, checkIn, checkOut, guests })
    setHotels(results)
    setLoading(false)
  }

  const favoriteCount = useMemo(() => favorites.length, [favorites])

  return (
    <section className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Hotel API Integration</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Search, compare and book real hotel inventory</h1>
        <p className="mt-5 max-w-3xl text-slate-300">Browse live hotel inventory, room types, amenities and availability details, then contact our team for custom pricing and bookings.</p>
      </article>

      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr_0.6fr_0.6fr_auto]">
          <label className="space-y-2 text-sm text-slate-200">
            <span>Destination</span>
            <input value={destination} onChange={(event) => setDestination(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="City, country or hotel" />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Check-in</span>
            <input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Check-out</span>
            <input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Guests</span>
            <input type="number" min="1" value={guests} onChange={(event) => setGuests(Number(event.target.value || 1))} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" />
          </label>
          <button type="button" onClick={() => void loadHotels()} className="brand-button self-end px-6 py-3 text-sm font-semibold">Search hotels</button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1">Favorites: {favoriteCount}</span>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1">Real availability</span>
          <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1">Room types & ratings</span>
        </div>
      </article>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="text-slate-300">Loading real hotel inventory…</p>
        ) : hotels.length > 0 ? (
          hotels.map((hotel) => (
            <article key={hotel.id} className="group overflow-hidden brand-shell shadow-[0_30px_90px_-55px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:border-[var(--brand-gold)]/30">
              <div className="relative h-72 overflow-hidden bg-slate-900">
                <img src={hotel.image_url || hotel.images?.[0]} alt={hotel.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <button type="button" onClick={() => setFavorites(toggleFavoriteHotel(hotel.id))} className={`absolute right-4 top-4 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${favorites.includes(hotel.id) ? 'border-amber-400 bg-amber-400/10 text-amber-100' : 'border-white/10 bg-slate-950/90 text-slate-100 hover:border-amber-400'}`}>
                  {favorites.includes(hotel.id) ? 'Saved' : 'Save'}
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-4 text-slate-300">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{hotel.location}</p>
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-100">{hotel.rating.toFixed(1)}★</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-white">{hotel.name}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{hotel.description}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.28em] text-slate-400">{hotel.provider}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {hotel.amenities?.slice(0, 4).map((item) => <span key={item} className="rounded-full border border-white/10 bg-slate-900/90 px-3 py-1 text-xs text-slate-200">{item}</span>)}
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-slate-200">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Pricing</p>
                    <p className="mt-1 text-xl font-semibold text-white">Personalized pricing available</p>
                  </div>
                  <Link to={`/hotel/${hotel.id}`} state={{ checkIn, checkOut, guests }} className="brand-button px-5 py-3 text-sm font-semibold">Request Availability</Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="text-slate-300">No live hotel inventory is available for that search yet.</p>
        )}
      </div>
    </section>
  )
}

export default Hotels
