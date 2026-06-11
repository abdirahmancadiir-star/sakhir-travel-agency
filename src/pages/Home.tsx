import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import TravelAssistant from '../components/TravelAssistant'
import { openWhatsApp, getWhatsAppSettings } from '../lib/whatsapp'
import {
  PlaneTakeoff,
  Truck,
  Bed,
  Globe2,
} from 'lucide-react'

// (Data-daada wax ka beddel kuma samayn)
const bookingServices = [
  { id: 'flight', label: 'Flight', button: 'Search', fields: [{ name: 'from', label: 'From', type: 'text' }, { name: 'to', label: 'To', type: 'text' }, { name: 'departure', label: 'Date', type: 'date' }, { name: 'passengers', label: 'Passengers', type: 'number' }] },
  { id: 'cargo', label: 'Cargo', button: 'Quote', fields: [{ name: 'origin', label: 'Origin', type: 'text' }, { name: 'destination', label: 'Destination', type: 'text' }, { name: 'weight', label: 'Weight', type: 'text' }] },
  { id: 'hotel', label: 'Hotel', button: 'Search', fields: [{ name: 'destination', label: 'Destination', type: 'text' }, { name: 'checkin', label: 'Check-in', type: 'date' }, { name: 'checkout', label: 'Check-out', type: 'date' }] },
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

function Home() {
  const [activeTab, setActiveTab] = useState('flight')
  const whatsappConfig = getWhatsAppSettings()
  const activeService = bookingServices.find((s) => s.id === activeTab) || bookingServices[0]

  return (
    <main className="bg-[#0F172A] text-white min-h-screen">
      {/* HERO SECTION - Xarunta dhexe */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Sakhir Travel Agency</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">Book flights, hotels, cargo, and tourism services through one trusted platform.</p>
        <div className="flex gap-4 justify-center">
          <Link className="bg-[#F59E0B] text-[#0F172A] px-8 py-3 rounded-full font-bold" to="/contact">Contact Us</Link>
          <button className="border border-slate-600 px-8 py-3 rounded-full" onClick={() => openWhatsApp(whatsappConfig.templates.flight)}>WhatsApp</button>
        </div>
      </section>

      {/* STATS GRID - Isku dheelitiran */}
      <section className="container mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
            <h2 className="text-3xl font-bold text-[#F59E0B]">{s.value}</h2>
            <p className="text-sm text-slate-400 mt-2">{s.label}</p>
          </div>
        ))}
      </section>

      {/* SERVICES GRID - 4 Column Layout */}
      <section className="container mx-auto px-6 py-10">
        <div className="grid md:grid-cols-4 gap-6">
          {featuredServices.map((s) => (
            <Link key={s.title} to={s.link} className="bg-slate-900 p-8 rounded-2xl flex flex-col items-center hover:bg-slate-800 transition">
              <s.icon className="w-10 h-10 mb-4 text-[#F59E0B]" />
              <span className="font-semibold">{s.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* BOOKING FORM - Nidaamsan */}
      <section className="container mx-auto px-6 py-10">
        <div className="bg-slate-950 p-8 rounded-3xl border border-white/10">
          <div className="flex gap-4 mb-8">
            {bookingServices.map((s) => (
              <button key={s.id} onClick={() => setActiveTab(s.id)} 
                className={`px-6 py-2 rounded-full ${activeTab === s.id ? 'bg-[#F59E0B] text-[#0F172A]' : 'bg-slate-800'}`}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {activeService.fields.map((f) => (
              <input key={f.name} placeholder={f.label} type={f.type} className="p-4 rounded-xl bg-slate-800 border border-white/10 outline-none focus:border-[#F59E0B]" />
            ))}
            <button className="bg-[#F59E0B] text-[#0F172A] font-bold rounded-xl">{activeService.button}</button>
          </div>
        </div>
      </section>

      <TravelAssistant />
    </main>
  )
}

export default Home
