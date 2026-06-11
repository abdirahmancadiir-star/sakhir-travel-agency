import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Flight');

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Navbar Section */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-10 py-6 text-white bg-black/20">
        <div className="font-bold text-xl tracking-wider">SAKHIR TRAVEL AGENCY</div>
        <div className="hidden lg:flex gap-6 text-sm font-medium">
          {['Home', 'Flights', 'Hotels', 'Tours', 'Visa Services', 'Cargo Services'].map((item) => (
            <a key={item} href="#" className="hover:text-[#F59E0B]">{item}</a>
          ))}
        </div>
        <button className="bg-[#F59E0B] px-6 py-2 rounded-full font-bold text-sm">Create Account</button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex flex-col items-center justify-center text-center text-white">
        <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80" className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" alt="Hero" />
        <div className="relative z-10 px-4">
          <h1 className="text-5xl font-bold mb-4">Your World, Connected</h1>
          <p className="text-lg opacity-90">Premier travel, cargo, and tourism services.</p>
        </div>
      </section>

      {/* Booking Center - Margin-ka waxaa loo dhigay mid sax ah si uusan u dul dhicin */}
      <div className="relative z-30 max-w-6xl mx-auto -mt-20 px-4 mb-20">
        <div className="bg-white rounded-xl shadow-2xl p-8">
           <div className="flex gap-8 border-b border-gray-100 mb-6 pb-2">
            {['Flight', 'Cargo', 'Hotel', 'Tour'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 font-bold ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-gray-400'}`}>{tab}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Origin" className="p-3 border rounded-lg" />
            <input placeholder="Destination" className="p-3 border rounded-lg" />
            <button className="bg-[#0f172a] text-white font-bold py-3 rounded-lg hover:bg-black">Search</button>
          </div>
        </div>

        {/* Popular Destinations - Waxaan ku daray margin-top si uu u kala fogaado */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">Popular Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Dubai', 'Istanbul', 'Mecca', 'Nairobi'].map(city => (
              <div key={city} className="h-64 rounded-2xl bg-gray-200 flex items-end p-6 font-bold text-white shadow-lg overflow-hidden relative">
                <img src={`https://source.unsplash.com/featured/?${city}`} className="absolute inset-0 w-full h-full object-cover"/>
                <span className="relative z-10">{city}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Luxury Packages Section - Waxaa loo qaabeeyey si nadiif ah */}
        <div className="mt-20 bg-[#F59E0B] rounded-2xl p-10 text-center text-[#0f172a]">
          <h2 className="text-3xl font-bold mb-4">Luxury Packages</h2>
          <p className="mb-6 opacity-90">Custom itineraries for your next escape with VIP support.</p>
          <button className="bg-[#0f172a] text-white px-8 py-3 rounded-full font-bold">View Packages</button>
        </div>
      </div>
    </main>
  );
}
