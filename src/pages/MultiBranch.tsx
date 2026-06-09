import { Building2, MapPin, ReceiptText, ShieldCheck, TrendingUp, Users } from 'lucide-react'

const branches = ['Nairobi', 'Istanbul', 'Mogadishu', 'Future branch']

export default function MultiBranch() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Multi-Branch Management</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Support Nairobi, Istanbul, Mogadishu and future branches from one unified global operations hub.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">This system gives each branch its own staff, revenue reporting and booking controls while keeping headquarters oversight centralized.</p>
        </article>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Branches', '4 active'],
            ['Branch staff', '26'],
            ['Branch revenue', '$68,240'],
            ['Bookings managed', '412'],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
              <p className="text-sm text-slate-300">{label}</p>
              <p className="mt-3 text-3xl font-black text-white">{value}</p>
            </article>
          ))}
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3 text-cyan-200"><Building2 className="h-6 w-6" /><h2 className="text-xl font-semibold">Branch setup</h2></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2"> 
              {branches.map((branch) => <div key={branch} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-100">{branch}</div>)}
            </div>
          </div>
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-cyan-50">
            <div className="flex items-center gap-3 text-cyan-100"><MapPin className="h-6 w-6" /><h3 className="text-lg font-semibold">Branch performance</h3></div>
            <p className="mt-4 text-sm text-cyan-50/90">Track branch-specific revenue, bookings, staffing and performance to support expansion and local market operations.</p>
          </div>
        </article>

        <article className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: Users, title: 'Branch staff', body: 'Assign staff by office and manage role-based branch access.' },
            { icon: TrendingUp, title: 'Branch revenue reports', body: 'See profit, bookings and target performance by location.' },
            { icon: ReceiptText, title: 'Branch booking management', body: 'Monitor client activity and reservations across each office.' },
          ].map((card) => {
            const Icon = card.icon
            return <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"><Icon className="h-7 w-7 text-cyan-200" /><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm text-slate-200">{card.body}</p></article>
          })}
        </article>
      </div>
    </section>
  )
}
