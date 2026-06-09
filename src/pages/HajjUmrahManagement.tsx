import { Building2, Globe2, HeartHandshake, ShieldCheck, Users } from 'lucide-react'

const hajjItems = [
  'Package management for Hajj and Umrah travel bundles',
  'Pilgrim registration, hotel allocation and flight allocation',
  'Payment plans, group management and traveler communications',
]

export default function HajjUmrahManagement() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#14532d_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-emerald-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Hajj & Umrah Management</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Manage Hajj and Umrah customers with package, lodging, flight and group coordination tools.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">This module supports package planning, pilgrim registration, hotel and flight allocation, payment options and group management for religious travel operations.</p>
        </article>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Pilgrims registered', '186'],
            ['Active packages', '12'],
            ['Hotel allocations', '43'],
            ['Flight groups', '9'],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
              <p className="text-sm text-slate-300">{label}</p>
              <p className="mt-3 text-3xl font-black text-white">{value}</p>
            </article>
          ))}
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3 text-emerald-200"><HeartHandshake className="h-6 w-6" /><h2 className="text-xl font-semibold">Pilgrim operations</h2></div>
            <ul className="mt-4 space-y-3 text-slate-100">{hajjItems.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm">{item}</li>)}</ul>
          </div>
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-emerald-50"><div className="flex items-center gap-3 text-emerald-100"><ShieldCheck className="h-6 w-6" /><h3 className="text-lg font-semibold">Secure group coordination</h3></div><p className="mt-4 text-sm text-emerald-50/90">Support group leads, payment schedules, traveler details and accommodation assignments for large religious travel groups.</p></div>
        </article>

        <article className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: Building2, title: 'Hotel allocation', body: 'Assign rooms and lodging by group, preference and capacity.' },
            { icon: Globe2, title: 'Flight allocation', body: 'Coordinate flights, seat blocks and schedules for pilgrim groups.' },
            { icon: Users, title: 'Group management', body: 'Track leaders, payments, travelers and communication history by group.' },
          ].map((card) => { const Icon = card.icon; return <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"><Icon className="h-7 w-7 text-emerald-200" /><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm text-slate-200">{card.body}</p></article>})}
        </article>
      </div>
    </section>
  )
}
