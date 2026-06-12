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
  Phone,
  Mail,
  MessageCircle,
  Star,
  Briefcase,
} from 'lucide-react'

const bookingServices = [
  {
    id: 'flight',
    label: 'Flight Booking',
    button: 'Search Flight',
    fields: [
      { name: 'from', label: 'From', type: 'text', placeholder: 'Origin city' },
      { name: 'to', label: 'To', type: 'text', placeholder: 'Destination city' },
      { name: 'departure', label: 'Departure Date', type: 'date', placeholder: '' },
      { name: 'return', label: 'Return Date', type: 'date', placeholder: '' },
      { name: 'passengers', label: 'Passengers', type: 'number', placeholder: '1' },
    ],
  },
  {
    id: 'cargo',
    label: 'Cargo Booking',
    button: 'Request Quote',
    fields: [
      { name: 'origin', label: 'Origin', type: 'text', placeholder: 'Origin city' },
      { name: 'destination', label: 'Destination', type: 'text', placeholder: 'Destination city' },
      { name: 'cargoType', label: 'Cargo Type', type: 'text', placeholder: 'Air freight, parcel' },
      { name: 'weight', label: 'Weight', type: 'text', placeholder: 'Kilograms' },
      { name: 'contact', label: 'Contact Number', type: 'tel', placeholder: '+254 7XX XXX XXX' },
    ],
  },
  {
    id: 'hotel',
    label: 'Hotel Booking',
    button: 'Search Hotels',
    fields: [
      { name: 'destination', label: 'Destination', type: 'text', placeholder: 'City or resort' },
      { name: 'checkin', label: 'Check-in', type: 'date', placeholder: '' },
      { name: 'checkout', label: 'Check-out', type: 'date', placeholder: '' },
      { name: 'guests', label: 'Guests', type: 'number', placeholder: '2' },
    ],
  },
  {
    id: 'tour',
    label: 'Tour Booking',
    button: 'Explore Tours',
    fields: [
      { name: 'destination', label: 'Destination', type: 'text', placeholder: 'City or region' },
      { name: 'travelDate', label: 'Travel Date', type: 'date', placeholder: '' },
      { name: 'travelers', label: 'Number of Travelers', type: 'number', placeholder: '2' },
      { name: 'budget', label: 'Budget', type: 'text', placeholder: 'Preferred budget range (optional)' },
    ],
  },
]

const featuredServices = [
  {
    icon: PlaneTakeoff,
    title: 'Flight Services',
    description: 'International and domestic flights with flexible booking and premium support.',
    link: '/flights',
  },
  {
    icon: Truck,
    title: 'Cargo Services',
    description: 'Fast and secure cargo shipping tailored for high-value freight.',
    link: '/cargo',
  },
  {
    icon: Bed,
    title: 'Hotel Reservations',
    description: 'Premium hotels worldwide with exclusive benefits and privileges.',
    link: '/hotels',
  },
  {
    icon: Globe2,
    title: 'Tourism Packages',
    description: 'Curated travel experiences for luxury-minded explorers.',
    link: '/tours',
  },
]

const banners = [
  {
    title: 'Dubai Luxury Experience',
    category: 'City Escape',
    description: 'Stay in iconic hotels, dine in fine restaurants and discover world-class attractions.',
    cta: 'Book Dubai',
    link: '/tours',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Istanbul Cultural Journey',
    category: 'Heritage Travel',
    description: 'Explore historic landmarks, Bosphorus views and timeless luxury experiences.',
    cta: 'Discover Istanbul',
    link: '/tours',
    image:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Umrah & Hajj Packages',
    category: 'Spiritual Travel',
    description: 'Thoughtfully planned pilgrimages with VIP support and seamless logistics.',
    cta: 'View Packages',
    link: '/tours',
    image:
      'https://images.unsplash.com/photo-1546412414-8035b9a7a3b9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Global Cargo Solutions',
    category: 'Logistics',
    description: 'Reliable cargo transport, expert customs clearance and real-time shipment tracking.',
    cta: 'Request Quote',
    link: '/cargo',
    image:
      'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1200&q=80',
  },
]

const destinationCards = [
  {
    name: 'Dubai',
    description: 'Skyline views, luxury hotels and premium leisure experiences.',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Istanbul',
    description: 'Historic architecture, Bosphorus cruises and refined boutique stays.',
    image:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Mecca',
    description: 'Spiritual journeys with premium pilgrimage support and hospitality.',
    image:
      'https://images.unsplash.com/photo-1546412414-8035b9a7a3b9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Medina',
    description: 'Sacred stays and seamless logistics for spiritual travelers.',
    image:
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Nairobi',
    description: 'Safari gateways, luxury lodges and East Africa adventures.',
    image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Kuala Lumpur',
    description: 'Modern city escapes with iconic towers and premium shopping.',
    image:
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
  },
]

const packageCards = [
  {
    name: 'Dubai Premium Tour',
    duration: '7 days',
    price: 'From $3,500',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Mecca Pilgrimage Package',
    duration: '10 days',
    price: 'From $4,900',
    image:
      'https://images.unsplash.com/photo-1546412414-8035b9a7a3b9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Istanbul VIP Experience',
    duration: '5 days',
    price: 'From $2,750',
    image:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Turkey Black Sea Tour',
    duration: '6 days',
    price: 'From $2,100',
    image:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'East Africa Safari',
    duration: '8 days',
    price: 'From $4,200',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Umrah & Hajj Premium Package',
    duration: '14 days',
    price: 'From $5,600',
    image:
      'https://images.unsplash.com/photo-1546412414-8035b9a7a3b9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cappadocia Balloon Adventure',
    duration: '4 days',
    price: 'From $1,980',
    image:
      'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80',
  },
]

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Bank-grade payment processing and secure booking confirmations.',
  },
  {
    icon: Clock3,
    title: '24/7 Support',
    description: 'Dedicated concierge service available around the clock.',
  },
  {
    icon: Briefcase,
    title: 'Trusted Experts',
    description: 'Local specialists with premium travel and logistics knowledge.',
  },
  {
    icon: Sparkles,
    title: 'Premium Experiences',
    description: 'Exclusive upgrades and refined itineraries for every trip.',
  },
  {
    icon: MapPin,
    title: 'Best Hotel Deals',
    description: 'Negotiated rates at top hotels and resorts worldwide.',
  },
  {
    icon: Globe2,
    title: 'Visa Assistance',
    description: 'Guidance for visa applications and document processing.',
  },
]

const stats = [
  { label: 'Premium destinations', value: '120+' },
  { label: 'Cargo routes covered', value: '45+' },
  { label: '24/7 concierge replies', value: '98%' },
  { label: 'Client satisfaction', value: '4.9/5' },
]

const partnerAirlines = ['Emirates', 'Qatar Airways', 'Turkish Airlines', 'Kenya Airways', 'Ethiopian Airlines']

const faqItems = [
  {
    question: 'Can you help with visa applications?',
    answer: 'Yes. We guide customers through document checklists, submission timing, and follow-up support for the destination country.',
  },
  {
    question: 'Do you handle cargo quotations?',
    answer: 'We provide air and road freight estimates, pickup coordination, and shipment tracking guidance for priority consignments.',
  },
  {
    question: 'Is the booking process secure?',
    answer: 'All booking requests and payments are handled with secure channels, verified contact support, and clear confirmations.',
  },
]

const testimonials = [
  {
    name: 'Amina Yusuf',
    role: 'Executive Traveler',
    quote: 'Every moment felt effortless. They handled the details so we could enjoy the journey.',
  },
  {
    name: 'Musa Al-Karim',
    role: 'Family Planner',
    quote: 'The itinerary blended luxury, adventure and comfort perfectly for our family.',
  },
  {
    name: 'Leila Njoroge',
    role: 'Cargo Director',
    quote: 'Cargo delivery was seamless, precise and on schedule. Their logistics team is world-class.',
  },
]

function Home() {
  const [activeTab, setActiveTab] = useState('flight')
  const [activeReview, setActiveReview] = useState(0)
  const [email, setEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const activeService = bookingServices.find((service) => service.id === activeTab) ?? bookingServices[0]
  const whatsappConfig = getWhatsAppSettings()

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!isValidEmail) {
      setNewsletterMessage('Please enter a valid email address to receive travel updates.')
      return
    }

    setNewsletterMessage(`Thank you, ${email}! Your travel briefing request has been queued for our team.`)
    setEmail('')
  }

  const quickActions = [
    { key: 'flight', label: 'Book Flight via WhatsApp', message: whatsappConfig.templates.flight },
    { key: 'hotel', label: 'Book Hotel via WhatsApp', message: whatsappConfig.templates.hotel },
    { key: 'tour', label: 'Tour Info via WhatsApp', message: whatsappConfig.templates.tour },
    { key: 'cargo', label: 'Cargo Quote via WhatsApp', message: whatsappConfig.templates.cargo },
    { key: 'visa', label: 'Visa Help via WhatsApp', message: whatsappConfig.templates.visa },
  ]

  return (
    <main className="bg-[var(--brand-deep)] text-[var(--brand-sand)]">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80"
            alt="Luxury travel and cargo services"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-slate-950/85" />
        </div>
        <div className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 py-20 lg:px-12">
          <div className="max-w-3xl space-y-8">
            <span className="brand-chip">
              Luxury Travel & Cargo
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--brand-sand)] sm:text-6xl">
              Travel, Cargo, Hotels & Tourism — All in One Place
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--brand-soft)] sm:text-xl">
              Book flights, hotels, tours, visas, and cargo services through one trusted platform.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="brand-button w-full sm:w-auto"
              >
                Request Quote
              </Link>
              <button
                type="button"
                onClick={() => openWhatsApp(whatsappConfig.templates.flight)}
                className="brand-button-secondary w-full sm:w-auto"
              >
                WhatsApp Booking
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {['International flights', 'Secure cargo', 'Premium stays'].map((item) => (
                <div key={item} className="brand-card p-5 text-sm text-[var(--brand-soft)] backdrop-blur-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-24 px-4 pb-16 sm:px-6 lg:px-8 bg-[var(--brand-deep)]/90">
        <div className="mx-auto mb-6 grid max-w-[1400px] gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <article key={item.label} className="brand-card p-5 shadow-[0_25px_80px_-55px_rgba(0,0,0,0.45)]">
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--brand-gold)]">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--brand-sand)]">{item.value}</p>
            </article>
          ))}
        </div>
        <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] border border-white/10 bg-[var(--brand-panel)]/95 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="bg-[var(--brand-deep)]/95 px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-[var(--brand-gold)]">Unified Booking Center</p>
                <h2 className="mt-3 text-3xl font-semibold text-[var(--brand-sand)] sm:text-4xl">Find flights, cargo, hotels and tours in one powerful search.</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {bookingServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setActiveTab(service.id)}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                      activeTab === service.id
                        ? 'bg-[var(--brand-gold)] text-[var(--brand-deep)]'
                        : 'border border-white/10 bg-white/5 text-[var(--brand-soft)] hover:bg-white/10'
                    }`}
                  >
                    {service.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {activeService.fields.map((field) => (
                <label key={field.name} className="block">
                  <span className="text-sm font-medium text-[var(--brand-soft)]">{field.label}</span>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="mt-3 w-full rounded-[1.75rem] border border-white/10 bg-[var(--brand-panel)]/90 px-5 py-4 text-[var(--brand-sand)] outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                  />
                </label>
              ))}
              <button className="brand-button col-span-full">
                {activeService.button}
              </button>
            </div>
          </div>
        </div>
      </section>

      <TravelAssistant />

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-8 bg-[#0F172A]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#F59E0B]">Trusted by premium travelers</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Partner airlines, cargo networks, and hospitality providers</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {partnerAirlines.map((partner) => (
                <span key={partner} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100">{partner}</span>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {['Verified bookings', 'Fast quote responses', 'Secure payments', 'Global support'].map((badge) => (
              <div key={badge} className="rounded-[1.5rem] border border-[#F59E0B]/15 bg-[#F59E0B]/10 p-4 text-sm font-semibold text-[#F59E0B]">{badge}</div>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-8 bg-[#111827]">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_35px_90px_-55px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.32em] text-[#F59E0B]">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {faqItems.map((item) => (
                <details key={item.question} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-slate-100" open={item.question === 'Can you help with visa applications?'}>
                  <summary className="cursor-pointer list-none text-base font-semibold">{item.question}</summary>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.answer}</p>
                </details>
              ))}
            </div>
          </article>
          <article className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_35px_90px_-55px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.32em] text-[#F59E0B]">Newsletter</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Get the latest travel and cargo updates.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">Receive promotions, visa reminders, cargo insights, and destination ideas delivered to your inbox.</p>
            <form onSubmit={handleNewsletterSubmit} className="mt-6 space-y-4">
              <label className="block text-sm text-slate-200">
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-3 w-full rounded-[1.25rem] border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
                  aria-label="Email address for travel updates"
                />
              </label>
              <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-[#F59E0B] px-6 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#d48706]">Subscribe</button>
              {newsletterMessage ? <p className="text-sm text-emerald-100">{newsletterMessage}</p> : null}
            </form>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-8 bg-[#0F172A]">
        <div className="mb-6 rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-6 shadow-[0_30px_80px_-55px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-emerald-100">WhatsApp Booking</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Start flights, hotels, cargo and visa requests instantly on WhatsApp.</h2>
            </div>
            <button
              type="button"
              onClick={() => openWhatsApp('Hello, I would like to speak with Sakhir Travel & Cargo.')}
              className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#1eb95d]"
            >
              Open WhatsApp
            </button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {quickActions.map((action) => (
              <button
                key={action.key}
                type="button"
                onClick={() => openWhatsApp(action.message)}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-4 text-left text-sm text-slate-100 transition hover:border-emerald-400/40 hover:bg-slate-900"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-emerald-100">{action.key}</p>
                <p className="mt-3 font-semibold text-white">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-4 py-10">
          {featuredServices.map((service) => (
            <article key={service.title} className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 text-slate-100 shadow-[0_30px_80px_-55px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:shadow-[0_40px_100px_-55px_rgba(0,0,0,0.42)]">
              <service.icon className="h-12 w-12 rounded-3xl border border-[#F59E0B]/20 bg-[#F59E0B]/10 p-3 text-[#0F172A]" />
              <h3 className="mt-6 text-2xl font-semibold text-white">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{service.description}</p>
              <Link to={service.link} className="mt-6 inline-flex items-center text-sm font-semibold text-[#F59E0B]">
                Learn More
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-8 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.08),transparent_24%),#0F172A]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#F59E0B]">Promotions</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Beautiful offers for your next luxury escape</h2>
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-4">
          {banners.map((banner) => (
            <article key={banner.title} className="group relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-black/20">
              <img src={banner.image} alt={banner.title} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-amber-300">{banner.category}</p>
                <h3 className="mt-3 text-2xl font-semibold">{banner.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200">{banner.description}</p>
                <Link
                  to={banner.link}
                  className="mt-6 inline-flex items-center rounded-full bg-[#F59E0B] px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#d48706]"
                >
                  {banner.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-8 bg-[#111827]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#F59E0B]">Popular destinations</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Explore our favorite luxury destinations</h2>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {destinationCards.map((destination) => (
            <article key={destination.name} className="overflow-hidden rounded-[2rem] bg-slate-950/90 text-white shadow-[0_35px_90px_-55px_rgba(0,0,0,0.4)] transition hover:-translate-y-1 hover:shadow-[0_40px_100px_-55px_rgba(0,0,0,0.48)]">
              <div className="relative h-80 overflow-hidden">
                <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-white">{destination.name}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{destination.description}</p>
                <Link to="/tours" className="mt-6 inline-flex items-center text-sm font-semibold text-[#F59E0B]">
                  Explore
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-8 bg-[#0F172A]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#F59E0B]">Special tour packages</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Luxury packages built for memorable escapes</h2>
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-5">
          {packageCards.map((packageItem) => (
            <article key={packageItem.name} className="overflow-hidden rounded-[2rem] bg-slate-950/90 text-white shadow-[0_35px_90px_-55px_rgba(0,0,0,0.4)] transition hover:-translate-y-1 hover:shadow-[0_40px_100px_-55px_rgba(0,0,0,0.48)]">
              <div className="relative h-80 overflow-hidden">
                <img src={packageItem.image} alt={packageItem.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-white">{packageItem.name}</h3>
                <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  <span>Duration: {packageItem.duration}</span>
                  <span>Destination: {packageItem.name.includes('Dubai') ? 'Dubai' : packageItem.name.includes('Istanbul') ? 'Istanbul' : 'Custom itinerary'}</span>
                </div>
                <p className="mt-4 text-sm text-slate-300">Highlights: Luxury planning, premium support, and tailored travel guidance.</p>
                <p className="mt-3 text-sm text-slate-300">Services Included: Hotel access, transfers, visa support, and concierge assistance.</p>
                <p className="mt-4 text-xs uppercase tracking-[0.28em] text-[#F59E0B]">Contact us for pricing</p>
                <Link to="/contact" className="mt-6 inline-flex items-center rounded-full bg-[#F59E0B] px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#d48706]">
                  Request Quote
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-8 bg-[#111827]">
        <div className="grid gap-6 lg:grid-cols-3">
          {whyChooseUs.map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 text-white shadow-[0_30px_80px_-55px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:shadow-[0_40px_100px_-55px_rgba(0,0,0,0.45)]">
              <item.icon className="h-12 w-12 rounded-3xl border border-[#F59E0B]/20 bg-[#F59E0B]/10 p-3 text-[#0F172A]" />
              <h3 className="mt-6 text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-8 bg-[#0F172A]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#F59E0B]">Testimonials</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Real reviews from discerning guests</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveReview(index)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeReview === index
                    ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-[#F59E0B]'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className={`rounded-[2rem] p-8 shadow-[0_30px_80px_-55px_rgba(0,0,0,0.35)] ${
                index === activeReview ? 'border border-[#F59E0B]/30 bg-[#111827]/80 text-white' : 'border border-white/10 bg-slate-950/90 text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.role}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-1 text-[#F59E0B]">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-300">“{item.quote}”</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-20 lg:px-8 bg-[#0F172A]/95">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 text-white shadow-[0_30px_80px_-55px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.32em] text-[#F59E0B]">Contact</p>
            <h2 className="mt-4 text-3xl font-semibold">Let us design your next premium journey</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">Speak with our experts about luxury itineraries, cargo logistics, visa support and exceptional hotel bookings.</p>
            <div className="mt-8 grid gap-6">
              <div className="rounded-[2rem] bg-[#0F172A] p-8 shadow-[0_35px_100px_-55px_rgba(0,0,0,0.36)] ring-1 ring-white/10">
                <p className="text-sm uppercase tracking-[0.32em] text-[#F59E0B]">Contact</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Let us design your next premium journey</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">Speak with our experts about luxury itineraries, cargo logistics, visa support, and exceptional hotel bookings.</p>
                <div className="mt-8 grid gap-4">
                  <div className="rounded-[1.75rem] bg-slate-950/95 p-6 ring-1 ring-white/10 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B] shadow-sm">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Office</p>
                        <p className="mt-3 text-xl font-semibold text-white">Nairobi, Kenya</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-950/95 p-6 ring-1 ring-white/10 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B] shadow-sm">
                        <Mail size={24} />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Email</p>
                        <a href="mailto:sakhirtravel10@gmail.com" className="mt-3 block text-xl font-semibold text-white transition hover:text-[#F59E0B]">
                          sakhirtravel10@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-[0_30px_80px_-55px_rgba(0,0,0,0.35)]">
            <iframe
              title="Office location"
              src="https://maps.google.com/maps?q=Dubai%20skyline&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-full min-h-[420px] w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0F172A] text-slate-300">
        <div className="mx-auto grid gap-10 px-6 py-14 lg:max-w-[1400px] lg:grid-cols-4 lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#F59E0B]">Sakhir Travel & Cargo</p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">A premium travel agency delivering world-class journeys, cargo logistics and visa support for discerning travelers.</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Quick Links</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {['Home', 'Flights', 'Cargo', 'Hotels', 'Tours', 'Visa', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="transition hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Services</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {['Flight Booking', 'Cargo Shipping', 'Hotel Reservation', 'Tour Packages'].map((item) => (
                <li key={item} className="transition hover:text-white">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Social Media</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {['Facebook', 'Instagram', 'TikTok', 'LinkedIn'].map((item) => (
                <li key={item} className="transition hover:text-white">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default Home
