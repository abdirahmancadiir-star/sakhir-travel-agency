import { Building2, Briefcase, CircleDollarSign, FileText, ShieldCheck, Users } from 'lucide-react'

const corpFeatures = [
  'Company accounts and business travel booking workflows',
  'Monthly invoicing, corporate discounts and employee travel management',
  'Corporate reporting, approvals and organization-wide analytics',
]

export default function CorporateClientManagement() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-sky-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-200">Corporate Client Management</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Serve companies, NGOs, universities and organizations with a dedicated corporate travel workspace.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">This module supports company accounts, business travel bookings, monthly invoicing, discounts, employee travel oversight and corporate reporting.</p>
        </article>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Active companies', '28'],
            ['Monthly invoices', '$64,200'],
            ['Employee travelers', '312'],
            ['Discount plans', '6'],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
              <p className="text-sm text-slate-300">{label}</p>
              <p className="mt-3 text-3xl font-black text-white">{value}</p>
            </article>
          ))}
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3 text-sky-200"><Building2 className="h-6 w-6" /><h2 className="text-xl font-semibold">Corporate capabilities</h2></div>
            <ul className="mt-4 space-y-3 text-slate-100">{corpFeatures.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm">{item}</li>)}</ul>
          </div>
          <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-5 text-sky-50"><div className="flex items-center gap-3 text-sky-100"><Briefcase className="h-6 w-6" /><h3 className="text-lg font-semibold">Organization support</h3></div><p className="mt-4 text-sm text-sky-50/90">Manage corporate travel for teams, confirm policy compliance and monitor usage, costs and reporting across multiple departments.</p></div>
        </article>

        <article className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: Users, title: 'Employee travel', body: 'Manage travelers, approvals, trip records and policy rules.' },
            { icon: CircleDollarSign, title: 'Corporate discounts', body: 'Apply negotiated pricing and group rate structures to bookings.' },
            { icon: FileText, title: 'Corporate reporting', body: 'See spend summaries, bookings and cost trend analysis by organization.' },
          ].map((card) => { const Icon = card.icon; return <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"><Icon className="h-7 w-7 text-sky-200" /><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm text-slate-200">{card.body}</p></article>})}
        </article>
      </div>
    </section>
  )
}
