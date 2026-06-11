// Home.tsx - Nidaamsan oo casri ah
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import TravelAssistant from '../components/TravelAssistant'
import { openWhatsApp, getWhatsAppSettings } from '../lib/whatsapp'
import {
  PlaneTakeoff, Truck, Bed, Globe2, ShieldCheck, Clock3, Sparkles,
  MapPin, Star, Briefcase,
} from 'lucide-react'

// ... (Halkan ku hay data-daaga bookingServices, featuredServices, iwm. sidii hore)

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
    setNewsletterMessage(`Thank you, ${email}! Your travel briefing request has been queued.`)
    setEmail('')
  }

  return (
    <main className="bg-[#0F172A] text-slate-200 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80" 
             className="absolute inset-0 w-full h-full object-cover" alt="Luxury Travel" />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="relative z-10 max-w-5xl px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">Travel, Cargo & Tourism — All in One</h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Book flights, hotels, tours, visas, and cargo services through one trusted platform.</p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="bg-[#F59E0B] text-[#0F172A] px-8 py-4 rounded-full font-bold hover:bg-amber-500 transition">Request Quote</Link>
            <button onClick={() => openWhatsApp(whatsappConfig.templates.flight)} className="bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition backdrop-blur-sm">WhatsApp Booking</button>
          </div>
        </div>
      </section>

      {/* Unified Booking Center - Layout-ka nadiif ah */}
      <section className="relative -mt-20 z-20 max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-slate-900">
          <div className="flex flex-wrap gap-4 border-b border-slate-100 mb-8 pb-4">
            {bookingServices.map((service) => (
              <button key={service.id} onClick={() => setActiveTab(service.id)} 
                      className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === service.id ? 'bg-[#F59E0B] text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
                {service.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {activeService.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-bold mb-2">{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#F59E0B] outline-none" />
              </div>
            ))}
            <button className="bg-[#0F172A] text-white font-bold py-4 rounded-xl hover:bg-black transition col-span-full md:col-span-1">{activeService.button}</button>
          </div>
        </div>
      </section>

      {/* Halkan sii wad inta kale ee Content-kaaga oo dhan ... */}
      <TravelAssistant />
      
      {/* Ugu dambayn: Hubi in padding-ga section kasta uu yahay mid isku mid ah (py-20) */}
    </main>
  )
}
