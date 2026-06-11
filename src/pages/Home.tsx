import { useState } from 'react'
import { PlaneTakeoff, Truck, Bed, Globe2, ShieldCheck, Star } from 'lucide-react'

// 1. HERO SECTION
function Hero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-slate-950">
      <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Travel" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Your World, <span className="text-[#F59E0B]">Connected</span></h1>
        <p className="text-lg text-slate-200 mb-8 max-w-xl mx-auto">Premier travel, cargo, and tourism services. Seamless, secure, and tailored to you.</p>
      </div>
    </section>
  )
}

// 2. BOOKING CENTER (Tabs)
function BookingCenter() {
  const [activeTab, setActiveTab] = useState('Flight')
  return (
    <div className="max-w-4xl mx-auto -mt-20 relative z-20 bg-white p-6 rounded-3xl shadow-2xl">
      <div className="flex gap-2 mb-6 border-b pb-4 overflow-x-auto">
        {['Flight', 'Cargo', 'Hotel', 'Tour'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-full font-medium ${activeTab === tab ? 'bg-[#F59E0B] text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Origin" className="p-4 border rounded-xl" />
        <input type="text" placeholder="Destination" className="p-4 border rounded-xl" />
        <button className="bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">Search {activeTab}</button>
      </div>
    </div>
  )
}

// 3. SERVICES GRID
function Services() {
  const services = [{ icon: PlaneTakeoff, title: 'Flights' }, { icon: Truck, title: 'Cargo' }, { icon: Bed, title: 'Hotels' }, { icon: Globe2, title: 'Tours' }]
  return (
    <section className="py-20 max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
      {services.map((s) => (
        <div key={s.title} className="p-8 border border-slate-100 rounded-3xl hover:shadow-xl transition text-center bg-white">
          <s.icon className="w-10 h-10 mx-auto text-[#F59E0B] mb-4" />
          <h3 className="font-bold text-slate-900">{s.title}</h3>
        </div>
      ))}
    </section>
  )
}

// 4. DESTINATIONS
function Destinations() {
  const list = ['Dubai', 'Istanbul', 'Mecca', 'Nairobi'];
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Popular Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {list.map(d => (
            <div key={d} className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
              <img src={`https://source.unsplash.com/featured/?${d}`} className="w-full h-full object-cover group-hover:scale-105 transition" alt={d} />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4 text-white font-bold text-xl">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 5. PROMOTIONS
function Promotions() {
  return (
    <section className="py-20 bg-[#F59E0B] text-slate-900 text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Luxury Packages</h2>
      <p className="mb-8 opacity-90 max-w-md mx-auto">Custom itineraries for your next escape with VIP support.</p>
      <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-black transition">View Packages</button>
    </section>
  )
}

// MAIN EXPORT
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <BookingCenter />
      <Services />
      <Destinations />
      <Promotions />
    </main>
  )
}
