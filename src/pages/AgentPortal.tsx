import {
  BadgeCheck,
  Briefcase,
  Building2,
  Calculator,
  Globe,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

const agentBenefits = [
  'Register travel agents and onboard teams quickly',
  'Search flights, hotels, tours and cargo in one workspace',
  'Create client bookings and generate branded quotations',
  'Track commissions, payouts and monthly earnings dashboards',
]

const workflowCards = [
  {
    title: 'Agent Registration',
    body: 'Create verified B2B accounts with role-based access, approvals and white-label reporting.',
    icon: ShieldCheck,
  },
  {
    title: 'Commission Engine',
    body: 'Earn commission per booking and monitor monthly reports, top performers and payout status.',
    icon: TrendingUp,
  },
  {
    title: 'Quotations & CRM',
    body: 'Generate instant quotations for clients, attach notes and convert them into bookings.',
    icon: Calculator,
  },
]

export default function AgentPortal() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#172554_0%,_#0F172A_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:px-10">
        <div className="rounded-3xl border border-amber-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">B2B travel agency portal</p>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white lg:text-6xl">Launch a full travel-agent ecosystem with approvals, commissions and client booking workflows.</h1>
              <p className="max-w-2xl text-lg text-slate-300">This portal gives partner agents a dedicated workspace to manage reservations, earnings and reports while giving admins everything needed to supervise performance.</p>
            </div>
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-emerald-100 shadow-lg shadow-emerald-950/30">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Monthly growth</p>
              <p className="mt-2 text-4xl font-black">+28%</p>
              <p className="text-sm text-emerald-100/90">Agent-driven bookings and commission uplift</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-amber-200">
              <Briefcase className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Agent account suite</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {agentBenefits.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-slate-100">
                  <BadgeCheck className="mb-3 h-5 w-5 text-emerald-300" />
                  <p className="text-sm leading-6 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Partner dashboard</p>
            <div className="mt-6 space-y-4 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Active agents</p>
                <p className="text-3xl font-black text-white">124</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Monthly commissions</p>
                <p className="text-3xl font-black text-white">$18,640</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Approved bookings</p>
                <p className="text-3xl font-black text-white">346</p>
              </div>
            </div>
          </article>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {workflowCards.map((card) => {
            const Icon = card.icon
            return (
              <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <Icon className="h-8 w-8 text-amber-300" />
                <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200">{card.body}</p>
              </article>
            )
          })}
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Agent features</p>
            <ul className="mt-4 space-y-3 text-slate-100">
              <li className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">Search flights, hotels and tours from a unified booking panel.</li>
              <li className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">Create client bookings, attach passenger details and issue quotations.</li>
              <li className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">View commissions, monthly payouts and earning summaries per agent.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-amber-50">
            <div className="flex items-center gap-3 text-amber-100">
              <Globe className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Admin controls</h3>
            </div>
            <p className="mt-4 text-sm text-amber-50/90">Approve or reject agent applications, set commission rules, generate performance reports and manage payouts in one place.</p>
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-100">
              <Sparkles className="h-5 w-5 text-amber-300" />
              Ready for white-label partner expansion and multi-market onboarding.
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
