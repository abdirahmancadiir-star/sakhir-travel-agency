import { Building2, Globe2, PieChart, ShieldCheck, Store, TrendingUp } from 'lucide-react'

const franchiseFeatures = [
  'Branch management and franchise dashboards',
  'Revenue sharing and centralized reporting',
  'City and country expansion support',
]

export default function FranchiseManagement() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-violet-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-violet-200">Franchise Management</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Expand into multiple cities and countries with centralized oversight and partner revenue tools.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">This module supports branch and franchise management, dashboards, revenue sharing and unified reporting for group expansion.</p>
        </article>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Franchise partners', '18'],
            ['Cities covered', '11'],
            ['Revenue shared', '$42,300'],
            ['Central reports', 'Monthly'],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
              <p className="text-sm text-slate-300">{label}</p>
              <p className="mt-3 text-3xl font-black text-white">{value}</p>
            </article>
          ))}
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3 text-violet-200"><Store className="h-6 w-6" /><h2 className="text-xl font-semibold">Franchise operations</h2></div>
            <ul className="mt-4 space-y-3 text-slate-100">{franchiseFeatures.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm">{item}</li>)}</ul>
          </div>
          <div className="rounded-3xl border border-violet-400/20 bg-violet-400/10 p-5 text-violet-50"><div className="flex items-center gap-3 text-violet-100"><ShieldCheck className="h-6 w-6" /><h3 className="text-lg font-semibold">Centralized control</h3></div><p className="mt-4 text-sm text-violet-50/90">Keep a single source of truth for branch performance, franchise trust, revenue sharing and growth planning across all territories.</p></div>
        </article>

        <article className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: Building2, title: 'Branch management', body: 'Create and govern regional operations and partner branches.' },
            { icon: PieChart, title: 'Revenue sharing', body: 'Track partner payouts, commission flows and profit splits.' },
            { icon: Globe2, title: 'Central reporting', body: 'Review combined results for all cities, countries and franchise units.' },
          ].map((card) => { const Icon = card.icon; return <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"><Icon className="h-7 w-7 text-violet-200" /><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm text-slate-200">{card.body}</p></article>})}
        </article>
      </div>
    </section>
  )
}
