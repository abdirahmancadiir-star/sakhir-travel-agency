import { CloudCog, Globe2, ShieldCheck, Sparkles, TimerReset } from 'lucide-react'

const pillars = [
  'Production database, automated backups and monitoring',
  'Frontend, backend and domain/SSL deployment readiness',
  'Caching, image optimization and CDN integration',
  'Environment variables, rate limiting and DDoS protection',
]

export default function ProductionDeployment() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-amber-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-200">Production Deployment</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Prepare the platform for real customer traffic with deployment, security and performance readiness.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">This deployment module summarizes the infrastructure, domain, SSL, cache, CDN and environment requirements needed for a professional production environment.</p>
        </article>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-amber-200"><CloudCog className="h-6 w-6" /><h2 className="text-xl font-semibold">Infrastructure checklist</h2></div>
            <ul className="mt-4 space-y-3 text-slate-100">
              {pillars.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm">{item}</li>)}
            </ul>
          </article>
          <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3 text-emerald-200"><Globe2 className="h-6 w-6" /><h2 className="text-xl font-semibold">Deployment readiness</h2></div>
            <div className="mt-4 space-y-4 text-sm text-slate-100">
              {['Frontend deployment on Vercel/Netlify', 'Backend deployment on Supabase/Fly.io/Azure', 'Custom domain + SSL certificates', 'Monitoring and logging dashboards'].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">{item}</div>)}
            </div>
          </article>
        </div>

        <article className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Security hardening', body: 'Use secret management, rate limiting, WAF, and DDoS protection for public traffic.' },
            { icon: TimerReset, title: 'Performance optimization', body: 'Add CDN delivery, image compression and cache headers for lower latency.' },
            { icon: Sparkles, title: 'Operational monitoring', body: 'Track uptime, error rates and critical transaction flows in production.' },
          ].map((card) => {
            const Icon = card.icon
            return <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"><Icon className="h-7 w-7 text-amber-200" /><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm text-slate-200">{card.body}</p></article>
          })}
        </article>
      </div>
    </section>
  )
}
