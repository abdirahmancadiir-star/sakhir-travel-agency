import { BugPlay, CheckCircle2, FlaskConical, ShieldCheck, TimerReset } from 'lucide-react'

const testAreas = [
  'Authentication testing for login, sign-up and role access',
  'Booking and payment flow testing',
  'API, form validation and error-handling checks',
  'Edge cases, performance testing and QA regression runs',
]

export default function TestingSystem() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-indigo-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-200">Testing System</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Validate authentication, bookings, payments, APIs and forms before launch.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">Use this testing framework to validate core journeys, edge cases, recovery behavior and performance before going live.</p>
        </article>

        <article className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-indigo-200"><FlaskConical className="h-6 w-6" /><h2 className="text-xl font-semibold">QA focus areas</h2></div>
            <ul className="mt-4 space-y-3 text-slate-100">
              {testAreas.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm">{item}</li>)}
            </ul>
          </div>
          <article className="rounded-3xl border border-indigo-400/20 bg-indigo-400/10 p-6 text-indigo-50 shadow-xl shadow-indigo-950/30">
            <div className="flex items-center gap-3 text-indigo-100"><CheckCircle2 className="h-6 w-6" /><h3 className="text-lg font-semibold">Release confidence</h3></div>
            <p className="mt-4 text-sm text-indigo-50/90">Running authentication, booking, payment, API and form validation tests helps catch issues before release and improves customer confidence.</p>
          </article>
        </article>

        <article className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: BugPlay, title: 'Error handling', body: 'Verify graceful failures, recovery flows and user-friendly validation messages.' },
            { icon: ShieldCheck, title: 'Edge cases', body: 'Cover expired sessions, invalid inputs, failed payments and partial booking states.' },
            { icon: TimerReset, title: 'Performance testing', body: 'Measure load time, responsiveness and API reliability under real traffic scenarios.' },
          ].map((card) => {
            const Icon = card.icon
            return <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"><Icon className="h-7 w-7 text-indigo-200" /><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm text-slate-200">{card.body}</p></article>
          })}
        </article>
      </div>
    </section>
  )
}
