import { BadgeDollarSign, FileText, PieChart, ReceiptText, ShieldCheck, TrendingUp } from 'lucide-react'

const financeCards = [
  ['Revenue tracked', '$182,400'],
  ['Expenses tracked', '$48,100'],
  ['Profit & loss', '+$134,300'],
  ['Tax-ready reports', 'Monthly'],
]

export default function AccountingSystem() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#14532d_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-emerald-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Invoice & Accounting System</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Automate invoices, track revenue and generate financial reports with branded accounting workflows.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">This section provides invoice generation, PDF export, accounting summaries, profit and loss reporting, tax insights and financial oversight for admins.</p>
        </article>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"> 
          {financeCards.map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
              <p className="text-sm text-slate-300">{label}</p>
              <p className="mt-3 text-3xl font-black text-white">{value}</p>
            </article>
          ))}
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3 text-emerald-200"><ReceiptText className="h-6 w-6" /><h2 className="text-xl font-semibold">Invoice & reporting</h2></div>
            <ul className="mt-4 space-y-3 text-slate-100">
              <li className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm">Automatic invoice generation with company branding and PDF output.</li>
              <li className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm">Revenue, expense and profit-and-loss dashboards with audit-ready summaries.</li>
              <li className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm">Export-ready financial reports for Excel and PDF workflows.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-emerald-50">
            <div className="flex items-center gap-3 text-emerald-100"><BadgeDollarSign className="h-6 w-6" /><h3 className="text-lg font-semibold">Financial controls</h3></div>
            <p className="mt-4 text-sm text-emerald-50/90">Support tax reporting, account reconciliation and monthly financial review through a secure admin dashboard.</p>
          </div>
        </article>

        <article className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: FileText, title: 'PDF invoices', body: 'Generate branded invoices instantly for bookings and services.' },
            { icon: PieChart, title: 'P&L reports', body: 'Monitor gross profit, overhead and operating margins monthly.' },
            { icon: ShieldCheck, title: 'Tax reporting', body: 'Prepare tax-ready summaries and export financial statements.' },
          ].map((card) => {
            const Icon = card.icon
            return <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"><Icon className="h-7 w-7 text-emerald-200" /><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm text-slate-200">{card.body}</p></article>
          })}
        </article>
      </div>
    </section>
  )
}
