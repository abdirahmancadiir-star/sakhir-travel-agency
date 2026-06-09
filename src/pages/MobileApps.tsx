import { BellRing, CreditCard, Globe, Smartphone, Sparkles, Ticket } from 'lucide-react'

const appFeatures = [
  'Flight booking, hotel booking, tour booking and cargo services from one app.',
  'Visa application support, quote generation and payment integration.',
  'Push notifications for booking updates, offers and loyalty rewards.',
  'Customer dashboard for trips, invoices, loyalty points and support.',
]

export default function MobileApps() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f766e_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-teal-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-teal-200">Mobile application platform</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Deliver a complete Android and iOS travel experience with bookings, payments and push notifications.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">The app-ready backend and feature plan cover flight, hotel, tour, cargo and visa services for customers on the move.</p>
        </article>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-teal-200">
              <Smartphone className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Mobile experience</h2>
            </div>
            <div className="mt-5 space-y-4 text-sm text-slate-100">
              {appFeatures.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">{item}</div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3 text-amber-200">
              <CreditCard className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Core services</h2>
            </div>
            <div className="mt-5 space-y-4 text-sm text-slate-100">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Flight booking, hotel booking and tour booking built into a unified mobile flow.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Visa assistance, cargo request handling and secure payment support.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Push notifications for confirmations, reminders and loyalty updates.</div>
            </div>
          </article>
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Ticket, label: 'Flight & hotel booking', value: 'Fast checkout' },
            { icon: Globe, label: 'Multi-market support', value: 'EN / SO / AR / TR' },
            { icon: BellRing, label: 'Push notifications', value: 'Real-time updates' },
            { icon: Sparkles, label: 'Customer dashboard', value: 'Bookings, payments, loyalty' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <Icon className="h-7 w-7 text-teal-200" />
                <p className="mt-4 text-sm text-slate-400">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
              </div>
            )
          })}
        </article>
      </div>
    </section>
  )
}
