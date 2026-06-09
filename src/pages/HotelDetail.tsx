import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getFavoriteHotels, getHotelById, toggleFavoriteHotel, type HotelSearchResult } from '../lib/hotelApi'
import { sendBookingNotification } from '../lib/notifications'
import { supabase } from '../lib/supabase'

function HotelDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [hotel, setHotel] = useState<HotelSearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [checkIn, setCheckIn] = useState(location.state?.checkIn || new Date().toISOString().slice(0, 10))
  const [checkOut, setCheckOut] = useState(location.state?.checkOut || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
  const [guests, setGuests] = useState(location.state?.guests || 2)
  const [selectedRoom, setSelectedRoom] = useState<HotelSearchResult['roomTypes'][number] | null>(null)

  useEffect(() => {
    async function loadHotel() {
      if (!id) return
      setLoading(true)
      const record = await getHotelById(id)
      setHotel(record)
      setSelectedRoom(record?.roomTypes?.[0] ?? null)
      setFavorites(getFavoriteHotels())
      setLoading(false)
    }

    void loadHotel()
  }, [id])

  const nights = useMemo(() => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
    return diff
  }, [checkIn, checkOut])

  const estimatedTotal = useMemo(() => {
    if (!hotel || !selectedRoom) return 0
    return Number(selectedRoom.rate || 0) * nights * Math.max(1, Number(guests || 1))
  }, [hotel, selectedRoom, nights, guests])

  const handleBooking = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!hotel || !selectedRoom) {
      setStatus('No hotel room is selected for booking.')
      return
    }

    const bookingReference = `HBR-${Date.now().toString(36).toUpperCase()}`
    const totalPrice = estimatedTotal.toFixed(2)

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        booking_type: 'hotel',
        hotel_id: hotel.id,
        start_date: checkIn,
        end_date: checkOut,
        guests,
        total_price: totalPrice,
        status: 'confirmed',
        notes: `Hotel booking via live API. Room: ${selectedRoom.name}. Reference: ${bookingReference}. Cancellation: ${selectedRoom.cancellationPolicy}`,
        booking_reference: bookingReference,
        provider: hotel.provider,
        payment_status: 'completed',
        cancellation_policy: selectedRoom.cancellationPolicy,
      })
      .select()
      .single()

    if (error || !data) {
      setStatus('Unable to confirm this hotel reservation. Please try again.')
      return
    }

    await supabase.from('payments').insert({
      user_id: user.id,
      booking_id: data.id,
      amount: totalPrice,
      currency: 'USD',
      payment_method: 'Hotel Gateway',
      status: 'completed',
      transaction_reference: bookingReference,
      payment_type: 'hotel',
      gateway: 'Hotel API',
      customer_name: user.full_name || user.email,
      customer_email: user.email || '',
      booking_reference: bookingReference,
      notes: `Hotel booking payment for ${hotel.name}`,
    })

    setStatus(`Hotel reservation confirmed. Reference ${bookingReference}. You can review it in your bookings page.`)

    if (user.email) {
      await sendBookingNotification({
        bookingId: data.id,
        bookingType: 'hotel',
        customerName: user.full_name ?? user.email,
        customerEmail: user.email,
        summary: `${hotel.name} · ${selectedRoom.name}`,
        totalPrice,
        dateRange: `${checkIn} → ${checkOut}`,
        status: data.status,
      })
    }

    navigate('/bookings')
  }

  const downloadConfirmation = () => {
    if (!hotel || !selectedRoom) return
    const text = [
      'Sakhir Travel & Cargo Hotel Confirmation',
      '======================================',
      `Hotel: ${hotel.name}`,
      `Location: ${hotel.location}`,
      `Room: ${selectedRoom.name}`,
      `Dates: ${checkIn} → ${checkOut}`,
      `Guests: ${guests}`,
      `Nights: ${nights}`,
      `Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(estimatedTotal)}`,
      `Cancellation: ${selectedRoom.cancellationPolicy}`,
    ].join('\n')

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `hotel-confirmation-${hotel.id}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p className="text-slate-300">Loading live hotel details…</p>
  if (!hotel) return <p className="text-slate-300">Hotel not found.</p>

  return (
    <section className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Hotel details</p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">{hotel.name}</h1>
            <p className="mt-4 max-w-3xl text-slate-300">{hotel.description}</p>
            <p className="mt-3 text-sm uppercase tracking-[0.28em] text-slate-400">{hotel.provider}</p>
          </div>
          <button type="button" onClick={() => setFavorites(toggleFavoriteHotel(hotel.id))} className={`rounded-full border px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] ${favorites.includes(hotel.id) ? 'border-amber-400 bg-amber-400/10 text-amber-100' : 'border-white/10 bg-slate-900/90 text-slate-100 hover:border-amber-400'}`}>
            {favorites.includes(hotel.id) ? 'Favorite saved' : 'Save favorite hotel'}
          </button>
        </div>
      </article>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6 text-slate-200">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Location</p>
              <p className="mt-3 text-xl font-semibold text-white">{hotel.location}</p>
              <p className="mt-2 text-sm text-slate-300">{hotel.country || 'Global destination'}</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6 text-slate-200">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Star rating</p>
              <p className="mt-3 text-xl font-semibold text-white">{hotel.starRating || hotel.rating}★</p>
              <p className="mt-2 text-sm text-slate-300">Real hotel rating and guest review score.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(hotel.images || [hotel.image_url]).map((image) => (
              <img key={image} src={image} alt={hotel.name} className="h-56 w-full rounded-[1.75rem] border border-white/10 object-cover bg-slate-900/90" />
            ))}
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6 text-slate-200">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Amenities</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(hotel.amenities || []).map((item) => <span key={item} className="rounded-full border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-slate-100">{item}</span>)}
            </div>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6 text-slate-200">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Room options</p>
            <div className="mt-4 grid gap-4">
              {hotel.roomTypes?.map((room) => (
                <button key={room.name} type="button" onClick={() => setSelectedRoom(room)} className={`rounded-[1.5rem] border p-4 text-left transition ${selectedRoom?.name === room.name ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 bg-slate-950/90 hover:border-amber-400/40'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{room.name}</p>
                      <p className="mt-2 text-sm text-slate-300">{room.description}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.28em] text-slate-400">{room.cancellationPolicy}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-amber-100">Custom pricing available</p>
                      <p className="text-xs text-slate-400">Contact our team for current rates</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </article>

        <aside className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Request summary</p>
          <p className="mt-3 text-3xl font-semibold text-white">Personalized pricing available</p>
          <p className="mt-2 text-sm text-slate-300">Share your travel dates and guests with our team for a tailored quote and availability confirmation.</p>

          <div className="mt-6 grid gap-4">
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
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            <p className="font-semibold">Quote on request</p>
            <p className="mt-1">Our team will confirm availability and provide a personalized rate recommendation for your stay.</p>
          </div>

          <button type="button" onClick={() => navigate('/contact')} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">Request Availability</button>
          <button type="button" onClick={downloadConfirmation} className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-slate-100 hover:border-amber-400">Download confirmation</button>
          {status && <p className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">{status}</p>}
        </aside>
      </div>
    </section>
  )
}

export default HotelDetail
