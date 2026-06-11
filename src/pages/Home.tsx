import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Flight');

  return (
    <main className="min-h-screen bg-white">
      {/* 1. NAVBAR - Waxaan u dhigay inuu korka saarnaado (z-50) */}
      <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 text-white bg-transparent">
        <div className="flex items-center gap-2">
          <div className="font-bold text-lg tracking-wider">SAKHIR TRAVEL AGENCY</div>
        </div>
        <div className="hidden lg:flex gap-6 text-sm font-medium">
          {['Home', 'Flights', 'Hotels', 'Tours', 'Visa Services', 'Cargo Services', 'Contact Us'].map((item) => (
            <a key={item} href="#" className="hover:text-[#F59E0B] transition">{item}</a>
          ))}
        </div>
        <button className="bg-[#F59E0B] px-6 py-2 rounded-full font-bold text-sm">Create Account</button>
      </nav>

      {/* 2. HERO SECTION - Sawirka iyo qoraalka */}
      <section className="relative h-[75vh] flex items-center justify-center text-center text-white">
        <img 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
          alt="Hero background"
        />
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Your World, Connected</h1>
          <p className="text-lg opacity-90">Premier travel, cargo, and tourism services. Seamless, secure, and tailored to you.</p>
        </div>
      </section>

      {/* 3. BOOKING CENTER - Waxaa lagu hagaajiyey margin-ka si uu u dul fadhiisto sawirka */}
      <div className="relative z-40 max-w-5xl mx-auto -mt-20 px-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex gap-6 mb-6 border-b border-gray-100 pb-2">
            {['Flight', 'Cargo', 'Hotel', 'Tour'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-semibold ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-gray-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Origin" className="p-3 border border-gray-200 rounded outline-none" />
            <input type="text" placeholder="Destination" className="p-3 border border-gray-200 rounded outline-none" />
            <button className="bg-[#0f172a] text-white font-bold py-3 rounded hover:bg-black transition">
              Search {activeTab}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
