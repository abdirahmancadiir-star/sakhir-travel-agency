import { AlertTriangle, Fingerprint, LockKeyhole, ShieldCheck, TimerReset, Users } from 'lucide-react'

const securityItems = [
  'Track user logins, admin actions, booking changes and payment changes.',
  'Support two-factor authentication, login alerts and session management.',
  'Maintain accountability with security event histories and audit trails.',
]

export default function SecurityAudit() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#7c2d12_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-amber-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-200">Security & Audit Log System</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Protect the platform with login monitoring, audit logs, two-factor security and session controls.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">This module helps you maintain accountability for user access, booking modifications and payment updates while strengthening security posture.</p>
        </article>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Login events', '146'],
            ['Admin actions', '32'],
            ['Security alerts', '6'],
            ['Active sessions', '14'],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
              <p className="text-sm text-slate-300">{label}</p>
              <p className="mt-3 text-3xl font-black text-white">{value}</p>
            </article>
          ))}
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3 text-amber-200"><ShieldCheck className="h-6 w-6" /><h2 className="text-xl font-semibold">Security controls</h2></div>
            <ul className="mt-4 space-y-3 text-slate-100">
              {securityItems.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm">{item}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-amber-50">
            <div className="flex items-center gap-3 text-amber-100"><AlertTriangle className="h-6 w-6" /><h3 className="text-lg font-semibold">Audit readiness</h3></div>
            <p className="mt-4 text-sm text-amber-50/90">Maintain an immutable event trail for suspicious access, critical configuration changes and customer data updates.</p>
          </div>
        </article>

        <article className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: Fingerprint, title: 'Two-factor auth', body: 'Protect administrator and agent logins with stronger verification.' },
            { icon: LockKeyhole, title: 'Login alerts', body: 'Receive notifications for suspicious sign-ins and new device access.' },
            { icon: TimerReset, title: 'Session management', body: 'Review and terminate active sessions to keep accounts secure.' },
          ].map((card) => {
            const Icon = card.icon
            return <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"><Icon className="h-7 w-7 text-amber-200" /><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm text-slate-200">{card.body}</p></article>
          })}
        </article>
      </div>
    </section>
  )
}
