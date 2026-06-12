import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import TravelAssistant from '../components/TravelAssistant'
import { openWhatsApp, getWhatsAppSettings } from '../lib/whatsapp'
import { PlaneTakeoff, Truck, Bed, Globe2, MapPin, Mail, ChevronRight, Star } from 'lucide-react'

// (Xaqiiji in bookingServices, featuredServices, banners, destinationCards, packageCards, faqItems ay ka mid yihiin qaybta koodkaaga ee kor ku qoran)

function Home() {
  const [activeTab, setActiveTab] = useState('flight')
  const [email, setEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const whatsappConfig = getWhatsAppSettings()
  
  const activeService = bookingServices.find((service) => service.id === activeTab) ?? bookingServices[0]

  return (
    <main className="bg-[#0F172A] text-white">
      
      {/* 1. WhatsApp Booking (Ugu kor mar mari sidaad rabtay) */}
      <section className="mx-auto max-w-[1400px] px-6 pt-10">
        <div className="bg-emerald-600/10 border border-emerald-500/20 p-8 rounded-[2rem] text-center">
          <h2 className="text-2xl font-bold mb-2">WhatsApp Booking</h2>
          <p className="text-slate-300 mb-6">Start flights, hotels, cargo and visa requests instantly on WhatsApp.</p>
          <button onClick={() => openWhatsApp(whatsappConfig.templates.flight)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-semibold transition">
            Open WhatsApp
          </button>
        </div>
      </section>

      {/* 2. Featured Services (Sidaad rabtay hoos geeyay) */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {featuredServices.map((service) => (
          <article key={service.title} className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <service.icon className="h-10 w-10 text-amber-500 mb-6" />
            <h3 className="text-xl font-semibold">{service.title}</h3>
            <p className="mt-3 text-sm text-slate-400">{service.description}</p>
            <Link to={service.link} className="mt-4 inline-block text-amber-500 font-semibold">Learn More</Link>
          </article>
        ))}
      </section>

      {/* 3. Booking Center */}
      <section className="mx-auto max-w-[1400px] px-6 pb-16">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/10">
          <div className="flex gap-4 mb-8 overflow-x-auto">
            {bookingServices.map((s) => (
              <button key={s.id} onClick={() => setActiveTab(s.id)} className={`px-5 py-2 rounded-full ${activeTab === s.id ? 'bg-amber-500 text-black' : 'bg-slate-800'}`}>
                {s.label}
              </button>
            ))}
          </div>
          {/* Input fields halkan geli */}
        </div>
      </section>

      <TravelAssistant />

      {/* 4. Destinations & Packages */}
      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <h2 className="text-3xl font-bold mb-10">Explore our favorite luxury destinations</h2>
        {/* Destination Cards map halkan geli */}
      </section>

      {/* 5. FAQ & Newsletter */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 grid lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-[2rem]">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          {/* FAQ map halkan geli */}
        </div>
        <div className="bg-amber-500/10 p-8 rounded-[2rem] border border-amber-500/20">
          <h2 className="text-2xl font-bold mb-2">Newsletter</h2>
          <input className="w-full p-4 rounded-xl bg-black/20 mb-4" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="w-full bg-amber-500 py-4 rounded-xl font-bold text-black">Subscribe</button>
        </div>
      </section>

    </main>
  )
}

export default Home
