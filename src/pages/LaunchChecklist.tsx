import { CheckCircle2, Globe2, ShieldCheck, Sparkles, TicketCheck } from 'lucide-react'

const launchItems = [
  'Contact information verified and support channels live',
  'Terms, privacy policy and refund policies published',
  'Flight APIs, hotel APIs, payments and email notifications confirmed',
  'Google Analytics, Search Console and social media pages connected',
]

export default function LaunchChecklist() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#14532d_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-emerald-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Launch Checklist</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Use this checklist to launch the platform professionally and confidently.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">This page organizes business, technical and marketing launch tasks so the final release is complete, verified and customer-ready.</p>
        </article>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_0.95fr]">
          <div>
            <div className="flex items-center gap-3 text-emerald-200"><CheckCircle2 className="h-6 w-6" /><h2 className="text-xl font-semibold">Launch activities</h2></div>
            <ul className="mt-4 space-y-3 text-slate-100">
              {launchItems.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm">{item}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-emerald-50">
            <div className="flex items-center gap-3 text-emerald-100"><Sparkles className="h-6 w-6" /><h3 className="text-lg font-semibold">Launch readiness</h3></div>
            <p className="mt-4 text-sm text-emerald-50/90">This checklist combines business compliance, technical integrations, security and marketing setup so the platform can be released in a polished, production-ready state.</p>
          </div>
        </article>

        <article className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: Globe2, title: 'Business & compliance', body: 'Verify contact details, terms, privacy, and refund policies before launch.' },
            { icon: ShieldCheck, title: 'Technical integrations', body: 'Confirm flight APIs, hotel APIs, payments and email notifications are working.' },
            { icon: TicketCheck, title: 'Marketing setup', body: 'Connect analytics, Search Console and social media assets for launch visibility.' },
          ].map((card) => {
            const Icon = card.icon
            return <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"><Icon className="h-7 w-7 text-emerald-200" /><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm text-slate-200">{card.body}</p></article>
          })}
        </article>
      </div>
    </section>
  )
}
