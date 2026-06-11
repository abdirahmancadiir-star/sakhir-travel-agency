import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import TravelAssistant from '../components/TravelAssistant'
import { openWhatsApp, getWhatsAppSettings } from '../lib/whatsapp'
import {
  PlaneTakeoff,
  Truck,
  Bed,
  Globe2,
  ShieldCheck,
  Clock3,
  Sparkles,
  MapPin,
  Mail,
  Star,
  Briefcase,
} from 'lucide-react'

const bookingServices = [
  {
    id: 'flight',
    label: 'Flight',
    button: 'Search',
    fields: [
      { name: 'from', label: 'From', type: 'text' },
      { name: 'to', label: 'To', type: 'text' },
      { name: 'departure', label: 'Date', type: 'date' },
      { name: 'passengers', label: 'Passengers', type: 'number' },
    ],
  },
  {
    id: 'cargo',
    label: 'Cargo',
    button: 'Quote',
    fields: [
      { name: 'origin', label: 'Origin', type: 'text' },
      { name: 'destination', label: 'Destination', type: 'text' },
      { name: 'weight', label: 'Weight', type: 'text' },
    ],
  },
  {
    id: 'hotel',
    label: 'Hotel',
    button: 'Search',
    fields: [
      { name: 'destination', label: 'Destination', type: 'text' },
      { name: 'checkin', label: 'Check-in', type: 'date' },
      { name: 'checkout', label: 'Check-out', type: 'date' },
    ],
  },
]

const featuredServices = [
  { icon: PlaneTakeoff, title: 'Flights', link: '/flights' },
  { icon: Truck, title: 'Cargo', link: '/cargo' },
  { icon: Bed, title: 'Hotels', link: '/hotels' },
  { icon: Globe2, title: 'Tours', link: '/tours' },
]

const stats = [
  { label: 'Destinations', value: '120+' },
  { label: 'Clients', value: '5K+' },
  { label: 'Support', value: '24/7' },
  { label: 'Rating', value: '4.9' },
]

const testimonials = [
  { name: 'Amina', quote: 'Very smooth service.' },
  { name: 'Musa', quote: 'Fast booking and support.' },
  { name: 'Leila', quote: 'Reliable and professional.' },
]

function Home() {
  const [activeTab, setActiveTab] = useState('flight')
  const [email, setEmail] = useState('')
  const [activeReview, setActiveReview] = useState(0)
  const whatsappConfig = getWhatsAppSettings()

  const activeService =
    bookingServices.find((s) => s.id === activeTab) || bookingServices[0]

  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <main className="bg-[#0F172A] text-white">

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-4xl font-bold">Travel & Cargo</h1>
          <p className="mt-4 text-slate-300">Book flights, hotels, cargo</p>

          <div className="mt-6 flex gap-4 justify-center">
            <Link className="brand-button" to="/contact">
              Contact
            </Link>
            <button
              className="brand-button-secondary"
              onClick={() => openWhatsApp(whatsappConfig.templates.flight)}
            >
              WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-10">
        {stats.map((s) => (
          <div key={s.label} className="brand-card text-center">
            <h2 className="text-2xl font-bold">{s.value}</h2>
            <p className="text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      <section className="px-6 py-10">
        <div className="grid md:grid-cols-4 gap-4">
          {featuredServices.map((s) => (
            <Link key={s.title} to={s.link} className="brand-card text-center">
              <s.icon className="mx-auto mb-2" />
              {s.title}
            </Link>
          ))}
        </div>
      </section>

      {/* BOOKING */}
      <section className="px-6 py-10">
        <div className="flex gap-3 mb-6">
          {bookingServices.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className="brand-button-secondary"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {activeService.fields.map((f) => (
            <input
              key={f.name}
              placeholder={f.label}
              type={f.type}
              className="p-3 rounded bg-slate-800 border border-white/10"
            />
          ))}
        </div>

        <button className="brand-button mt-4">
          {activeService.button}
        </button>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-10 text-center">
        <h2 className="text-xl mb-6">Reviews</h2>

        <div className="brand-card max-w-md mx-auto">
          <p>{testimonials[activeReview].quote}</p>
          <p className="mt-2 text-slate-400">
            - {testimonials[activeReview].name}
          </p>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveReview(i)}
              className="w-3 h-3 rounded-full bg-slate-500"
            />
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-6 py-10 text-center">
        <h2>Contact</h2>

        <form onSubmit={handleNewsletterSubmit} className="mt-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-2 rounded bg-slate-800"
          />
          <button className="brand-button ml-2">Send</button>
        </form>
      </section>

      <TravelAssistant />
    </main>
  )
}

export default Home
