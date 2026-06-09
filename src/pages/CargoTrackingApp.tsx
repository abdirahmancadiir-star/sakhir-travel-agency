import { BellRing, PackageCheck, Smartphone, Truck, Users } from 'lucide-react'

const cargoFeatures = [
  'Live shipment tracking with delivery updates',
  'Push notifications for status changes and pickups',
  'Customer dashboard for cargo history and support',
]

export default function CargoTrackingApp() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f766e_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-teal-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-teal-200">Cargo Tracking Mobile App</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Give customers fast mobile cargo tracking with delivery updates and push alerts.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">This app-ready experience focuses on shipment tracking, current status visibility, mobile notifications and a customer dashboard for cargo services.</p>
        </article>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-teal-200"><Truck className="h-6 w-6" /><h2 className="text-xl font-semibold">Tracking features</h2></div>
            <ul className="mt-4 space-y-3 text-slate-100">{cargoFeatures.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm">{item}</li>)}</ul>
          </article>
          <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3 text-amber-200"><Smartphone className="h-6 w-6" /><h2 className="text-xl font-semibold">Mobile experience</h2></div>
            <div className="mt-5 space-y-4 text-sm text-slate-100">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Shipment status timeline and delivery progress indicators.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Push notifications for pickups, delays and successful deliveries.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Customer dashboard with service history and support contact.</div>
            </div>
          </article>
        </div>

        <article className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: PackageCheck, title: 'Shipment tracking', body: 'Monitor cargo status from dispatch to delivery.' },
            { icon: BellRing, title: 'Push notifications', body: 'Alert customers when shipments move or require action.' },
            { icon: Users, title: 'Customer dashboard', body: 'Review shipment history, updates and support contacts easily.' },
          ].map((card) => { const Icon = card.icon; return <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"><Icon className="h-7 w-7 text-teal-200" /><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm text-slate-200">{card.body}</p></article>})}
        </article>
      </div>
    </section>
  )
}
