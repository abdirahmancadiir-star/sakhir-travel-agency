import { useState } from 'react';
import { PlaneTakeoff, Truck, Bed, Globe2 } from 'lucide-react';

function Home() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-white p-6">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Qaybta Sare: Services oo leh Sawiro */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-amber-500">Our Premium Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Flight Services", icon: PlaneTakeoff, img: "https://images.unsplash.com/photo-1436491869332-7a87353f86d1?w=500" },
              { title: "Cargo Services", icon: Truck, img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500" },
              { title: "Hotel Reservations", icon: Bed, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500" },
              { title: "Tourism Packages", icon: Globe2, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500" }
            ].map((service) => (
              <div key={service.title} className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900 group">
                <img src={service.img} alt={service.title} className="h-40 w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="p-5">
                  <service.icon className="text-amber-500 mb-3" size={28} />
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Qaybta dhexe: FAQ iyo Newsletter (Laba dhinac) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* FAQ */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-4">
                <h3 className="font-medium text-amber-500">Can you help with visa applications?</h3>
                <p className="text-slate-400 text-sm mt-1">Yes, we provide full guidance for your travel documents.</p>
              </div>
              <div className="border-b border-white/5 pb-4">
                <h3 className="font-medium text-amber-500">Do you handle cargo quotations?</h3>
                <p className="text-slate-400 text-sm mt-1">We provide professional estimates for all your shipping needs.</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-amber-500/10 p-8 rounded-2xl border border-amber-500/20 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
            <p className="text-slate-300 mb-6">Get the latest travel and cargo offers delivered to your inbox.</p>
            <input type="email" placeholder="you@example.com" className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white mb-4" />
            <button className="w-full bg-amber-500 text-black font-bold py-4 rounded-xl hover:bg-amber-400 transition">Subscribe</button>
          </div>
        </section>

        {/* WhatsApp Booking */}
        <section className="bg-green-600/10 p-8 rounded-2xl border border-green-500/20 text-center">
          <h2 className="text-2xl font-bold mb-2">WhatsApp Booking</h2>
          <p className="text-slate-300 mb-6">Start flights, hotels, cargo, and visa requests instantly.</p>
          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-500 transition">
            Open WhatsApp
          </button>
        </section>

      </div>
    </main>
  );
}

export default Home;
