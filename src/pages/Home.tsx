import { useState } from 'react';
import { PlaneTakeoff, Truck, Bed, Globe2, Menu, X } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Flight');

  return (
    <div className="min-h-screen bg-white">
      {/* 1. NAVBAR */}
      <nav className="fixed w-full z-50 bg-[#0f172a] text-white py-4 px-6 flex items-center justify-between">
        <div className="font-bold text-xl">SAKHIR TRAVEL AGENCY</div>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          {['Home', 'Flights', 'Hotels', 'Tours', 'Cargo', 'Contact'].map(link => (
            <a key={link} href="#" className="hover:text-[#F59E0B] transition">{link}</a>
          ))}
        </div>
        <button className="bg-[#F59E0B] px-5 py-2 rounded-full font-bold text-sm">Create Account</button>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center pt-20">
        <img 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80" 
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          alt="Travel"
        />
        <div className="relative z-10 text-center px-4 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Your World, Connected</h1>
          <p className="text-lg opacity-90">Premier travel, cargo, and tourism services. Seamless, secure, and tailored to you.</p>
        </div>
      </section>

      {/* 3. BOOKING CENTER (Halkan ayaa lagu saxay Layout-ka) */}
      <div className="relative z-30 max-w-5xl mx-auto -mt-16 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-100">
          <div className="flex gap-6 mb-6 border-b border-slate-100 pb-2">
            {['Flight', 'Cargo', 'Hotel', 'Tour'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`pb-2 font-semibold transition ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-slate-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Origin" className="p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none" />
            <input type="text" placeholder="Destination" className="p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none" />
            <button className="bg-[#0f172a] text-white font-bold py-3 rounded-lg hover:bg-black transition">
              Search {activeTab}
            </button>
          </div>
        </div>
      </div>

      {/* 4. SERVICES GRID */}
      <section className="py-20 max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: PlaneTakeoff, label: 'Flights' },
          { icon: Truck, label: 'Cargo' },
          { icon: Bed, label: 'Hotels' },
          { icon: Globe2, label: 'Tours' }
        ].map(s => (
          <div key={s.label} className="p-6 border border-slate-100 rounded-2xl text-center hover:shadow-lg transition">
            <s.icon className="w-8 h-8 mx-auto text-[#F59E0B] mb-3" />
            <p className="font-semibold">{s.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
