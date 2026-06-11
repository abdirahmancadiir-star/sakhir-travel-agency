import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PlaneTakeoff, Truck, Bed, Globe2 } from 'lucide-react'
import { openWhatsApp, getWhatsAppSettings } from '../lib/whatsapp'

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

function Home() {
  const [activeTab, setActiveTab] = useState('flight')
  const whatsappConfig = getWhatsAppSettings()
  const activeService = bookingServices.find((s) => s.id === activeTab) || bookingServices[0]

  return (
    <main className="bg-[#0F172A] text-white min-h-screen">
      {/* HERO */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl font-bold">Sakhir Travel Agency</h1>
        <p className="mt-4 text-slate-300">Book flights, hotels, cargo, and tours in one place.</p>
        <div className="mt-6 flex gap-4 justify-center">
          <Link className="bg-[#F59E0B] px-8 py-3 rounded-full font-bold" to="/contact">Contact Us</Link>
          <button className="border border-slate-700 px-8 py-3 rounded-full" onClick={() => openWhatsApp(whatsappConfig.templates.flight)}>WhatsApp</button>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredServices.map((s) => (
            <Link key={s.title} to={s.link} className="bg-slate-900 p-6 rounded-2xl text-center hover:bg-slate-800 transition">
              <s.icon className="mx-auto mb-3 text-[#F59E0B]" />
              {s.title}
            </Link>
          ))}
        </div>
      </section>

      {/* BOOKING CENTER */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="bg-slate-950 p-8 rounded-3xl border border-white/10">
          <div className="flex gap-4 mb-6">
            {bookingServices.map((s) => (
              <button key={s.id} onClick={() => setActiveTab(s.id)} className={`px-4 py-1 rounded ${activeTab === s.id ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-slate-400'}`}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {activeService.fields.map((f) => (
              <input key={f.name} placeholder={f.label} type={f.type} className="p-3 rounded bg-slate-900 border border-white/10" />
            ))}
            <button className="bg-[#F59E0B] text-black font-bold rounded">{activeService.button}</button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
