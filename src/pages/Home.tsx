import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import TravelAssistant from '../components/TravelAssistant'
import { openWhatsApp, getWhatsAppSettings } from '../lib/whatsapp'
import {
  PlaneTakeoff,
  Truck,
  Bed,
  Globe2,
  MapPin,
  Mail,
  Star,
  Briefcase,
  ChevronRight
} from 'lucide-react'

// ... (bookingServices, banners, destinationCards, packageCards, whyChooseUs - halkan ka dhig sidii hore)

function Home() {
  const [activeTab, setActiveTab] = useState('flight')
  const [email, setEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const activeService = bookingServices.find((service) => service.id === activeTab) ?? bookingServices[0]
  const whatsappConfig = getWhatsAppSettings()

  // Newsletter Logic
  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNewsletterMessage(`Thank you, ${email}!`)
    setEmail('')
  }

  return (
    <main className="bg-[#0F172A] text-white">
      {/* 1. Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80" className="h-full w-full object-cover" alt="Hero" />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 py-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Travel & Cargo Solutions</h1>
          <p className="mt-6 text-xl text-slate-300 max-w-2xl">One trusted platform for all your premium travel and logistics needs.</p>
        </div>
      </section>

      {/* 2. Unified Booking Center */}
      <section className="mx-auto max-w-[1400px] px-6 -mt-20 relative z-10">
        <div className="bg-[#1e293b] p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex gap-4 mb-8 overflow-x-auto">
            {bookingServices.map((s) => (
              <button key={s.id} onClick={() => setActiveTab(s.id)} className={`px-6 py-2 rounded-full ${activeTab === s.id ? 'bg-amber-500 text-black' : 'bg-slate-800'}`}>
                {s.label}
              </button>
            ))}
          </div>
          {/* Booking fields (Sidii hore ayaad ka dhigi kartaa) */}
        </div>
      </section>

      {/* 3. WhatsApp Booking (Muuqaalka ugu muhiimsan - kor ayaan u soo qaaday) */}
      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="bg-emerald-900/30 border border-emerald-500/30 p-8 rounded-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Start requests instantly on WhatsApp</h2>
          <button onClick={() => openWhatsApp('Hello')} className="bg-emerald-500 px-8 py-4 rounded-full font-bold hover:bg-emerald-600">Open WhatsApp</button>
        </div>
      </section>

      {/* 4. Flight/Cargo/Hotel Services */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredServices.map((s) => (
          <div key={s.title} className="bg-slate-900 p-8 rounded-3xl border border-white/5 hover:border-amber-500/50 transition">
            <s.icon className="text-amber-500 w-10 h-10 mb-6" />
            <h3 className="text-xl font-bold mb-3">{s.title}</h3>
            <p className="text-slate-400 text-sm mb-4">{s.description}</p>
            <Link to={s.link} className="text-amber-500 font-semibold flex items-center">Learn More <ChevronRight size={16} /></Link>
          </div>
        ))}
      </section>

      {/* 5. FAQ & Newsletter */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 grid lg:grid-cols-2 gap-12">
        <div className="bg-slate-900 p-10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          {faqItems.map((item) => (
            <div key={item.question} className="mb-6 border-b border-white/5 pb-4">
              <h4 className="font-bold text-amber-500 mb-2">{item.question}</h4>
              <p className="text-slate-400 text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-500/5 p-10 rounded-3xl border border-amber-500/10">
          <h2 className="text-3xl font-bold mb-4">Newsletter</h2>
          <p className="text-slate-400 mb-6">Get the latest travel updates.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <input className="flex-1 bg-black/20 p-4 rounded-xl border border-white/10" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="bg-amber-500 text-black px-6 rounded-xl font-bold">Subscribe</button>
          </form>
        </div>
      </section>

      {/* 6. Popular Destinations & Packages (Hoos u dhig sidaad u kala hormarisay) */}
      {/* ... (Koodka kale ee destinationCards iyo packageCards ku dar halkan) */}

      <TravelAssistant />
    </main>
  )
}

export default Home
