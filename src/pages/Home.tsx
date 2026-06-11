import { useState } from 'react'
import { PlaneTakeoff, Truck, Bed, Globe2, ShieldCheck, Star } from 'lucide-react'

// --- Qaybta Hero ---
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

// --- Qaybta Booking ---
function BookingCenter() {
  const [activeTab, setActiveTab] = useState('Flight')
  return (
    <div className="max-w-4xl mx-auto -mt-20 relative z-20 bg-white p-6 rounded-3xl shadow-2xl">
      <div className="flex gap-2 mb-6 border-b pb-4">
        {['Flight', 'Cargo', 'Hotel', 'Tour'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full ${activeTab === tab ? 'bg-[#F59E0B] text-white' : 'text-slate-500'}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Origin" className="p-3 border rounded-xl" />
        <input type="text" placeholder="Destination" className="p-3 border rounded-xl" />
        <button className="bg-slate-900 text-white rounded-xl font-bold">Search</button>
      </div>
    </div>
  )
}

// --- Qaybta Services & Stats (Isururiyey) ---
function InfoSection() {
  return (
    <section className="py-20 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
      <div>
        <h2 className="text-3xl font-bold mb-6">Why Sakhir Travel?</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4"><ShieldCheck className="text-[#F59E0B]" /> Secure Payments</div>
          <div className="flex items-center gap-4"><Star className="text-[#F59E0B]" /> 24/7 Concierge Support</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[{t: '120+', l: 'Destinations'}, {t: '45+', l: 'Cargo Routes'}].map(s => (
          <div key={s.t} className="p-6 bg-slate-50 rounded-2xl">
            <p className="text-2xl font-bold">{s.t}</p>
            <p className="text-sm text-slate-500">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// --- Home Main ---
export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <BookingCenter />
      <InfoSection />
    </main>
  )
}
