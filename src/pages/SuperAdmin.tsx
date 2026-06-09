import { useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getMembershipLevels, getRewardRules } from '../lib/loyalty'

export default function SuperAdmin() {
  const { user } = useAuth()
  const rewardRules = useMemo(() => getRewardRules(), [])
  const levels = useMemo(() => getMembershipLevels(), [])

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return <section className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 text-slate-200">Only super admins and admins can access this management area.</section>
  }

  return (
    <section className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Super admin</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Secure control center for staff, loyalty, and reports</h1>
        <p className="mt-4 max-w-3xl text-slate-300">This role layer supports Super Admin, Admin, Agent, and Customer access with clear permissions for booking, payment, loyalty, and reporting workflows.</p>
      </article>

      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Permissions</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Role matrix</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-200">{[
            ['Super Admin', 'Full control over users, bookings, payments, rewards, reports and coupons.'],
            ['Admin', 'Manage reward rules, membership levels, booking workflows and analytics.'],
            ['Agent', 'Handle bookings, payments and customer support tasks.'],
            ['Customer', 'View loyalty, referrals, coupons and booking history.'],
          ].map(([role, detail]) => <article key={role} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5"><p className="text-base font-semibold text-white">{role}</p><p className="mt-2 text-slate-300">{detail}</p></article>)} </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Loyalty analytics</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Current reward setup</h2>
          <div className="mt-6 space-y-4">
            <article className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5"><p className="text-xs uppercase tracking-[0.24em] text-slate-400">Reward rules</p><p className="mt-3 text-xl font-semibold text-white">{rewardRules.length} active reward offers</p></article>
            <article className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5"><p className="text-xs uppercase tracking-[0.24em] text-slate-400">Membership tiers</p><p className="mt-3 text-xl font-semibold text-white">{levels.length} loyalty levels</p></article>
            <article className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5"><p className="text-xs uppercase tracking-[0.24em] text-slate-400">Reports access</p><p className="mt-3 text-xl font-semibold text-white">Available for admin and super admin staff</p></article>
          </div>
        </article>
      </div>

      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Admin controls</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Manage loyalty operations</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">{rewardRules.map((rule) => <article key={rule.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5 text-sm text-slate-200"><p className="text-xl font-semibold text-white">{rule.name}</p><p className="mt-2 text-slate-300">{rule.discount}</p><p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-400">{rule.type} · {rule.pointsRequired} points</p></article>)} </div>
      </article>
    </section>
  )
}
