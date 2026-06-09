import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const serviceLines = [
  {
    title: 'Air Cargo',
    description: 'Fast global shipment for time-sensitive and high-value goods with premium handling.',
  },
  {
    title: 'Sea Freight',
    description: 'Reliable ocean transport for containerized and oversized cargo across international ports.',
  },
  {
    title: 'Land Transport',
    description: 'Secure road and rail logistics for cross-border delivery and inland distribution.',
  },
  {
    title: 'Package Tracking',
    description: 'Real-time cargo tracking and milestone alerts from origin to delivery.',
  },
]

function Cargo() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [serviceType, setServiceType] = useState('Air Cargo')
  const [origin, setOrigin] = useState('Nairobi')
  const [destination, setDestination] = useState('Dubai')
  const [pickupDate, setPickupDate] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [cargoWeight, setCargoWeight] = useState('')
  const [mode, setMode] = useState('Air')
  const [contactName, setContactName] = useState(user?.full_name ?? '')
  const [contactEmail, setContactEmail] = useState(user?.email ?? '')
  const [contactPhone, setContactPhone] = useState('')
  const [trackingCode, setTrackingCode] = useState('')
  const [trackingStatus, setTrackingStatus] = useState<string | null>(null)
  const [requestStatus, setRequestStatus] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRequestStatus(null)

    if (!contactName || !contactEmail || !contactPhone || !pickupDate || !cargoWeight) {
      setRequestStatus('Please complete all required cargo request fields.')
      return
    }

    setSubmitting(true)
    const { data, error } = await supabase
      .from('cargo_orders')
      .insert({
        user_id: user?.id ?? null,
        service_type: serviceType,
        origin,
        destination,
        transport_mode: mode,
        pickup_date: pickupDate,
        delivery_date: deliveryDate || pickupDate,
        cargo_weight: parseFloat(cargoWeight) || 0,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        status: 'requested',
        notes: `Cargo quote request for ${serviceType}`,
      })
      .select()
      .single()

    setSubmitting(false)
    if (error || !data) {
      setRequestStatus('Unable to submit your cargo quote request. Please try again.')
      return
    }

    setRequestStatus('Cargo quote request submitted successfully. Our logistics team will contact you soon.')
    navigate('/bookings')
  }

  const handleTrack = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!trackingCode) {
      setTrackingStatus('Enter your tracking number to continue.')
      return
    }
    setTrackingStatus(`Tracking ${trackingCode}: In transit - expected delivery within 2 business days.`)
  }

  return (
    <div className="space-y-10">
      <section className="brand-shell p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Cargo solutions</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Air, sea and land freight for international trade.</h1>
            <p className="mt-5 max-w-2xl text-slate-600">End-to-end cargo services with tracking, customs support and tailored quotes for every shipment.</p>
          </div>
          <div className="rounded-[2rem] bg-slate-50 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Your cargo today</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">Manage shipments with premium clarity.</h2>
            <p className="mt-4 text-slate-600">Secure your logistics needs with trusted carriers and dedicated freight specialists.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        {serviceLines.map((service) => (
          <div key={service.title} className="brand-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{service.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="brand-shell p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Request a quote</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Custom cargo quote</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Fast response</span>
          </div>

          {requestStatus && <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{requestStatus}</div>}

          <form onSubmit={handleRequest} className="mt-8 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Service type</span>
                <select
                  value={serviceType}
                  onChange={(event) => setServiceType(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                >
                  <option>Air Cargo</option>
                  <option>Sea Freight</option>
                  <option>Land Transport</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Transport mode</span>
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                >
                  <option>Air</option>
                  <option>Sea</option>
                  <option>Road</option>
                  <option>Rail</option>
                </select>
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Origin city</span>
                <input
                  value={origin}
                  onChange={(event) => setOrigin(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Destination city</span>
                <input
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Pickup date</span>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(event) => setPickupDate(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Delivery date</span>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(event) => setDeliveryDate(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Cargo weight (kg)</span>
                <input
                  type="number"
                  min={0}
                  value={cargoWeight}
                  onChange={(event) => setCargoWeight(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Your name</span>
                <input
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Email address</span>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Phone number</span>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(event) => setContactPhone(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
            </div>

            <button type="submit" disabled={submitting} className="brand-button px-8 py-3 text-sm font-semibold">
              {submitting ? 'Submitting request…' : 'Request cargo quote'}
            </button>
          </form>
        </div>

        <aside className="space-y-6 brand-shell p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Track shipment</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">Track your cargo</h2>
            <p className="mt-3 text-slate-600">Enter your tracking reference for the latest shipment status and delivery ETA.</p>
          </div>
          <form onSubmit={handleTrack} className="space-y-4">
            <input
              value={trackingCode}
              onChange={(event) => setTrackingCode(event.target.value)}
              placeholder="Enter tracking number"
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/95 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
            />
            <button type="submit" className="brand-button-secondary w-full px-6 py-3 text-sm font-semibold">
              Track shipment
            </button>
          </form>
          {trackingStatus && <p className="rounded-3xl bg-slate-950/95 p-4 text-sm text-slate-200 shadow-sm">{trackingStatus}</p>}
        </aside>
      </section>
    </div>
  )
}

export default Cargo
