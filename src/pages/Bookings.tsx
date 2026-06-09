import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { generateBookingTicket } from '../lib/ticket'
import { sendBookingNotification } from '../lib/notifications'
import type { Booking } from '../lib/types'

type BookingItem = Booking & {
  tours?: { name: string } | null
  hotels?: { name: string } | null
}

function Bookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [emailStatus, setEmailStatus] = useState<string | null>(null)

  useEffect(() => {
    async function loadBookings() {
      if (!user) {
        setLoading(false)
        setBookings([])
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .from('bookings')
        .select('id,booking_type,start_date,end_date,guests,total_price,status,flight_route,flight_class,cargo_origin,cargo_destination,cargo_weight,cargo_description,booking_reference,provider,payment_status,cancellation_policy,notes,tour_id,hotel_id,tours(name),hotels(name)')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })

      if (error) {
        setError('Unable to load your bookings.')
      } else {
        setBookings(data ?? [])
      }
      setLoading(false)
    }

    loadBookings()
  }, [user])

  const handleDownloadTicket = (booking: BookingItem) => {
    generateBookingTicket(booking, user?.full_name ?? user?.email ?? 'Traveler')
  }

  const handleEmailTicket = async (booking: BookingItem) => {
    if (!user?.email) {
      setEmailStatus('Email notifications are available after login.')
      return
    }

    const success = await sendBookingNotification({
      bookingId: booking.id,
      bookingType: booking.booking_type,
      customerName: user.full_name ?? user.email,
      customerEmail: user.email,
      summary:
        booking.booking_type === 'flight'
          ? booking.flight_route ?? 'Travel booking'
          : booking.booking_type === 'cargo'
          ? booking.cargo_description ?? 'Cargo booking'
          : booking.booking_type === 'tour'
          ? booking.tours?.name ?? 'Tour booking'
          : booking.hotels?.name ?? 'Hotel booking',
      totalPrice: booking.total_price,
      dateRange: `${booking.start_date} → ${booking.end_date}`,
      status: booking.status,
    })

    setEmailStatus(success ? 'Ticket emailed successfully.' : 'Unable to send ticket email right now.')
  }

  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.12)]">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Your Journeys</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">My travel bookings</h1>
        <p className="mt-4 max-w-2xl text-slate-600">Review your booked tours, hotel stays, cargo shipments and travel arrangements in one premium dashboard.</p>
      </div>

      {error && <div className="rounded-3xl bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}
      {emailStatus && <div className="rounded-3xl bg-[#E8F5FF] p-4 text-sm text-[#0F4C81]">{emailStatus}</div>}
      {loading ? (
        <p className="text-slate-600">Loading your bookings…</p>
      ) : bookings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-[1.75rem] bg-slate-950/95 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.14)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-amber-500">{booking.booking_type === 'flight' ? 'Travel' : booking.booking_type}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    {booking.booking_type === 'tour'
                      ? booking.tours?.name ?? 'Tour booking'
                      : booking.booking_type === 'hotel'
                      ? booking.hotels?.name ?? 'Hotel booking'
                      : booking.booking_type === 'flight'
                      ? booking.flight_route
                      : booking.cargo_description}
                  </h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{booking.status}</span>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p>{booking.start_date} → {booking.end_date}</p>
                {booking.booking_type === 'flight' && (
                  <>
                    <p>Package: {booking.flight_class}</p>
                    <p>Route: {booking.flight_route}</p>
                  </>
                )}
                {booking.booking_type === 'cargo' && (
                  <>
                    <p>From: {booking.cargo_origin}</p>
                    <p>To: {booking.cargo_destination}</p>
                    <p>Weight: {booking.cargo_weight} kg</p>
                  </>
                )}
                <p>Guests: {booking.guests}</p>
                {booking.booking_reference && <p>Reference: {booking.booking_reference}</p>}
                {booking.provider && <p>Provider: {booking.provider}</p>}
                {booking.payment_status && <p>Payment: {booking.payment_status}</p>}
                <p className="text-lg font-semibold text-slate-900">${booking.total_price}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/payments" className="rounded-3xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">Pay now</a>
                <button onClick={() => handleDownloadTicket(booking)} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Download ticket
                </button>
                <button onClick={() => handleEmailTicket(booking)} className="rounded-3xl border border-slate-700 bg-slate-950/95 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
                  Email ticket
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-slate-600">You have no bookings yet.</p>
      )}
    </section>
  )
}

export default Bookings
