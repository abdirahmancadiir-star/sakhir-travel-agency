import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { sendBookingNotification } from '../lib/notifications'

function FlightBooking() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [packageType, setPackageType] = useState('Premium')
  const [passengers, setPassengers] = useState(1)
  const [totalPrice, setTotalPrice] = useState('0')
  const [billingName, setBillingName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (!billingName || !cardNumber || !expiry || !cvc) {
      setStatus('Please complete the payment details to continue.')
      return
    }
    setSubmitting(true)
    setStatus('Processing payment...')

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        booking_type: 'flight',
        flight_route: `${origin} → ${destination}`,
        flight_class: packageType,
        start_date: departureDate,
        end_date: returnDate || departureDate,
        guests: passengers,
        total_price: parseFloat(totalPrice) || 0,
        status: 'confirmed',
        notes: `Travel package from ${origin} to ${destination}`,
      })
      .select()
      .single()

    setSubmitting(false)
    if (error || !data) {
      setStatus('Unable to book your travel package. Please try again.')
      return
    }

    setStatus('Payment confirmed and travel booking completed!')

    if (user.email) {
      await sendBookingNotification({
        bookingId: data.id,
        bookingType: 'flight',
        customerName: user.full_name ?? user.email,
        customerEmail: user.email,
        summary: `${origin} → ${destination} | ${packageType}`,
        totalPrice: `${parseFloat(totalPrice) || 0}`,
        dateRange: `${departureDate} → ${returnDate || departureDate}`,
        status: data.status,
      })
    }

    navigate('/bookings')
  }

  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] bg-slate-950/95 px-6 py-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.08)] sm:px-8 lg:px-10">
        <div className="mx-auto container-max lg:grid lg:grid-cols-[1.6fr_1fr] lg:items-center gap-8">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-brand-primary">Travel concierge</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Book your luxury travel itinerary</h1>
            <p className="mt-5 max-w-2xl text-slate-600">Select your route, travel class and schedule with a refined booking experience designed for premium journeys.</p>
          </div>
          <div className="rounded-[2rem] bg-slate-50 p-6 ring-1 ring-slate-100">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Flight care</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">Tailored packages</p>
            <p className="mt-3 text-slate-600">Flexible dates, passenger options, and executive support for every trip.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-slate-950/95 p-10 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Travel booking</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Reserve your next flight</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Concierge pricing</div>
          </div>

          {status && <div className="mt-8 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{status}</div>}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Departure city</span>
                <input
                  value={origin}
                  onChange={(event) => setOrigin(event.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                  placeholder="Nairobi"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Destination</span>
                <input
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                  placeholder="Dubai, Turkey, Kenya"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Departure date</span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(event) => setDepartureDate(event.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Return date</span>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(event) => setReturnDate(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Package preference</span>
                <select
                  value={packageType}
                  onChange={(event) => setPackageType(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                >
                  <option>Premium</option>
                  <option>Executive</option>
                  <option>Group</option>
                  <option>Family</option>
                </select>
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Travelers</span>
                <input
                  type="number"
                  min={1}
                  value={passengers}
                  onChange={(event) => setPassengers(Number(event.target.value))}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Estimated total</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalPrice}
                  onChange={(event) => setTotalPrice(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </label>
              <div className="rounded-[1.75rem] bg-amber-50 p-5 text-sm leading-6 text-slate-700">
                <p className="font-semibold text-slate-900">Flexible booking</p>
                <p className="mt-2">Reserve now and modify your itinerary later with luxury support.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Billing name</span>
                <input
                  value={billingName}
                  onChange={(event) => setBillingName(event.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                  placeholder="Cardholder name"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Card number</span>
                <input
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                  placeholder="0000 0000 0000 0000"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Expiry / CVC</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={expiry}
                    onChange={(event) => setExpiry(event.target.value)}
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    placeholder="MM/YY"
                  />
                  <input
                    value={cvc}
                    onChange={(event) => setCvc(event.target.value)}
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    placeholder="CVC"
                  />
                </div>
              </label>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Booking travel…' : 'Book travel'}
            </button>
          </form>
        </div>

        <aside className="flex flex-col gap-6 rounded-[2rem] bg-slate-950 p-10 text-white shadow-sm">
          <div className="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Premium flight care</p>
            <h3 className="mt-4 text-3xl font-semibold">White-glove travel planning</h3>
            <p className="mt-3 text-slate-300">Enjoy priority seats, lounge access guidance, and expert itinerary support.</p>
          </div>

          <div className="grid gap-4 rounded-[1.75rem] bg-slate-900/85 p-6 ring-1 ring-white/10">
            {[
              'Luxury class packages',
              'Flexible date options',
              'Concierge itinerary support',
            ].map((item) => (
              <p key={item} className="text-sm text-slate-200">{item}</p>
            ))}
          </div>

          <div className="rounded-[1.75rem] bg-amber-50 p-6 text-slate-900">
            <p className="text-sm uppercase tracking-[0.28em] text-amber-700">Travel assurance</p>
            <p className="mt-3 text-sm leading-7">Our team monitors each booking and keeps you updated with every itinerary change.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default FlightBooking
