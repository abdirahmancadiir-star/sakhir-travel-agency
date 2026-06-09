import { Briefcase, LockKeyhole, ShieldCheck, UserCog, Users } from 'lucide-react'

const roles = ['Manager', 'Sales Agent', 'Visa Officer', 'Cargo Officer', 'Accountant']

export default function StaffManagement() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <article className="rounded-3xl border border-violet-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-violet-200">Staff Management System</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Manage staff accounts, permissions, workflows and team performance securely.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">This module supports role-based access for managers, sales agents, visa officers, cargo officers and accountants with activity tracking and performance visibility.</p>
        </article>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Active staff', '26'],
            ['Roles enabled', '5'],
            ['Permission sets', '12'],
            ['Performance reviews', '4 pending'],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
              <p className="text-sm text-slate-300">{label}</p>
              <p className="mt-3 text-3xl font-black text-white">{value}</p>
            </article>
          ))}
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3 text-violet-200"><Users className="h-6 w-6" /><h2 className="text-xl font-semibold">Role setup</h2></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2"> 
              {roles.map((role) => <div key={role} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-100">{role}</div>)}
            </div>
          </div>
          <div className="rounded-3xl border border-violet-400/20 bg-violet-400/10 p-5 text-violet-50">
            <div className="flex items-center gap-3 text-violet-100"><ShieldCheck className="h-6 w-6" /><h3 className="text-lg font-semibold">Permissions & logs</h3></div>
            <p className="mt-4 text-sm text-violet-50/90">Support secure access, activity logs, audit trails and performance dashboards for every department in the organization.</p>
          </div>
        </article>

        <article className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: UserCog, title: 'Staff accounts', body: 'Create and manage team accounts with role-based access.' },
            { icon: LockKeyhole, title: 'Permission management', body: 'Control who can view bookings, payments, invoices and reports.' },
            { icon: Briefcase, title: 'Performance tracking', body: 'Monitor team activity, workload and productivity in one place.' },
          ].map((card) => {
            const Icon = card.icon
            return <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"><Icon className="h-7 w-7 text-violet-200" /><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm text-slate-200">{card.body}</p></article>
          })}
        </article>
      </div>
    </section>
  )
}
