import { useState } from 'react';
import { PlaneTakeoff, Truck, Bed, Globe2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Flight');

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar Section */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-10 py-6 text-white">
        <div className="text-xl font-bold tracking-wider">SAKHIR TRAVEL AGENCY</div>
        <div className="hidden lg:flex gap-8 text-sm font-medium">
          {['Home', 'Flights', 'Hotels', 'Tours', 'Visa Services', 'Cargo Services', 'Contact Us'].map((item) => (
            <a key={item} href="#" className="hover:text-[#F59E0B] transition">{item}</a>
          ))}
        </div>
        <button className="bg-[#F59E0B] px-6 py-2 rounded-full font-bold text-sm hover:bg-amber-500 transition">
          Create Account
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex flex-col items-center justify-center text-white text-center px-4">
        <img 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
          alt="Hero background"
        />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Your World, Connected</h1>
          <p className="text-lg opacity-90">Premier travel, cargo, and tourism services. Seamless, secure, and tailored to you.</p>
        </div>
      </section>

      {/* Booking Center (Halkan ayaa ah meesha ugu muhiimsan ee naqshaddaada) */}
      <div className="relative z-30 max-w-6xl mx-auto -mt-24 px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Tabs */}
          <div className="flex gap-8 mb-6 border-b border-slate-100 pb-2">
            {['Flight', 'Cargo', 'Hotel', 'Tour'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-semibold transition-all ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <input type="text" placeholder="Origin" className="w-full p-3 border border-slate-200 rounded-lg outline-none" />
            <input type="text" placeholder="Destination" className="w-full p-3 border border-slate-200 rounded-lg outline-none" />
            <div className="md:col-span-2">
               <button className="w-full bg-[#0f172a] text-white font-bold py-3 rounded-lg hover:bg-black transition">
                Search {activeTab}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
