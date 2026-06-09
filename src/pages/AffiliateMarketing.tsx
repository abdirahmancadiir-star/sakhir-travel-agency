import {
  BadgeDollarSign,
  ChartColumn,
  Coins,
  Link2,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

const links = [
  { label: 'Flights campaign', code: 'AFF-FLT-2048', clicks: 248, earnings: '$1,240' },
  { label: 'Hotel bundle', code: 'AFF-HOT-1182', clicks: 184, earnings: '$890' },
  { label: 'Visa promo', code: 'AFF-VIS-7701', clicks: 96, earnings: '$540' },
]

export default function AffiliateMarketing() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <div className="rounded-3xl border border-emerald-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Affiliate marketing system</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Track every referral, payout and conversion from one affiliate hub.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">Give marketers and influencers unique links, performance analytics and automated payout visibility to expand revenue through partner campaigns.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Active affiliates', '42'], ['Referral clicks', '2,184'], ['Conversion rate', '8.9%'], ['Payouts ready', '$7,400'],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
              <p className="text-sm text-slate-300">{label}</p>
              <p className="mt-3 text-3xl font-black text-white">{value}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-emerald-200">
              <Link2 className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Unique affiliate links</h2>
            </div>
            <div className="mt-6 space-y-4">
              {links.map((item) => (
                <div key={item.code} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-slate-200">{item.label}</p>
                      <p className="font-mono text-emerald-200">{item.code}</p>
                    </div>
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-100">Live</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="rounded-xl bg-white/5 px-3 py-2">Clicks: {item.clicks}</span>
                    <span className="rounded-xl bg-white/5 px-3 py-2">Earnings: {item.earnings}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3 text-amber-200">
              <Coins className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Commission tracking</h2>
            </div>
            <div className="mt-4 space-y-4">
              {[
                ['Commission per booking', '6% flat / 8% VIP tier'],
                ['Payout cadence', 'Weekly, via bank or wallet'],
                ['Referral score', 'AI ranking for top creators'],
              ].map(([label, text]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100">
                  <p className="text-slate-400">{label}</p>
                  <p className="mt-2 text-slate-100">{text}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-3">
          {[
            { icon: Users, title: 'Referral tracking', body: 'Monitor which affiliates bring customers and what bookings they convert.' },
            { icon: ChartColumn, title: 'Performance dashboard', body: 'See clicks, conversions, reward tiers and ROI in one place.' },
            { icon: ShieldCheck, title: 'Payout management', body: 'Approve, hold or release payments for each affiliate partner.' },
          ].map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <Icon className="h-7 w-7 text-emerald-200" />
                <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm text-slate-200">{card.body}</p>
              </div>
            )
          })}
        </article>

        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-emerald-50 shadow-xl shadow-emerald-950/30">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Affiliate growth playbook</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm text-emerald-50/90">Use campaign codes, influencer tiers, and commission alerts to increase partner retention and reward high-volume marketers automatically.</p>
        </article>
      </div>
    </section>
  )
}
