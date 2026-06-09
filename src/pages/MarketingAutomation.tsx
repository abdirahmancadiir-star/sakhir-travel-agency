import { BellRing, Mail, Megaphone, PieChart, Target, TrendingUp } from 'lucide-react'

const campaignCards = [
  { title: 'Email campaigns', body: 'Launch promotions, newsletters and seasonal offers to customer segments.', icon: Mail },
  { title: 'Abandoned reminders', body: 'Recover unfinished bookings with follow-up emails and WhatsApp nudges.', icon: BellRing },
  { title: 'Customer segmentation', body: 'Target frequent flyers, visa seekers and cargo clients with tailored journeys.', icon: Target },
]

export default function MarketingAutomation() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#14532d_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-emerald-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Marketing automation system</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Automate offers, reminders and newsletters to drive bookings, loyalty and retention.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">Design campaigns, organize segments and trigger audience-specific messages for existing and prospective customers automatically.</p>
        </article>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Open rate', '64%'], ['Campaigns launched', '18'], ['Reminder recovery', '23%'], ['Repeat bookings', '31%'],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
              <p className="text-sm text-slate-300">{label}</p>
              <p className="mt-3 text-3xl font-black text-white">{value}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {campaignCards.map((card) => {
            const Icon = card.icon
            return (
              <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <Icon className="h-7 w-7 text-emerald-200" />
                <h2 className="mt-4 text-xl font-semibold text-white">{card.title}</h2>
                <p className="mt-3 text-sm text-slate-200">{card.body}</p>
              </article>
            )
          })}
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3 text-emerald-200">
              <Megaphone className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Automation blocks</h2>
            </div>
            <ul className="mt-4 space-y-3 text-slate-100">
              <li className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">Promotional offers for seasonal travel, visa windows and cargo peak periods.</li>
              <li className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">Abandoned booking reminders scheduled across email and WhatsApp.</li>
              <li className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">Customer segmentation based on travel behavior, loyalty status and region.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-emerald-50">
            <div className="flex items-center gap-3 text-emerald-100">
              <PieChart className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Impact overview</h3>
            </div>
            <p className="mt-4 text-sm text-emerald-50/90">Use audience analytics and booking trends to decide when to send email campaigns, rewards or reminders.</p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-100">
              <div className="flex items-center gap-2 text-amber-200"><TrendingUp className="h-4 w-4" /> Recommended next campaign: 20% flash sale for luxury hotel packages.</div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
