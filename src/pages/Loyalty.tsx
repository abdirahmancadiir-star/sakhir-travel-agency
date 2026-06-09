import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getLoyaltyProfile, getMemberLevel, getMembershipLevels, getRewardRules, type RewardRule, updateLoyaltyProfile } from '../lib/loyalty'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function Loyalty() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(() => user ? getLoyaltyProfile(user.id, user.email || 'customer@example.com') : null)
  const [rules, setRules] = useState(getRewardRules())
  const [levels] = useState(getMembershipLevels())

  useEffect(() => {
    if (!user) return
    const nextProfile = getLoyaltyProfile(user.id, user.email || 'customer@example.com')
    setProfile(nextProfile)
    setRules(getRewardRules())
  }, [user])

  const currentLevel = useMemo(() => getMemberLevel(profile?.points || 0), [profile])

  const redeemReward = (rule: RewardRule) => {
    if (!profile || profile.points < rule.pointsRequired) return

    const nextProfile = {
      ...profile,
      points: profile.points - rule.pointsRequired,
      level: getMemberLevel(profile.points - rule.pointsRequired),
      rewardsHistory: [
        { id: `${Date.now()}`, label: `${rule.name} redeemed`, points: -rule.pointsRequired, status: 'Redeemed', createdAt: new Date().toISOString() },
        ...(profile.rewardsHistory || []),
      ],
    }

    updateLoyaltyProfile(nextProfile)
    setProfile(nextProfile)
  }

  if (!user) {
    return <section className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 text-slate-200">Sign in to access loyalty points and rewards.</section>
  }

  return (
    <section className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Loyalty & rewards</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Earn points, unlock discounts, and redeem rewards</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Every booking, payment, and successful referral contributes to your loyalty status. Use the dashboard to redeem your points for discounts on flights, hotels, tours and cargo.</p>
      </article>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Points balance</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Current status</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Available points</p>
              <p className="mt-4 text-4xl font-semibold text-amber-100">{profile?.points ?? 0}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Membership level</p>
              <p className="mt-4 text-4xl font-semibold text-emerald-100">{currentLevel}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Next tier</p>
              <p className="mt-4 text-xl font-semibold text-white">{levels.find((level) => level.name === currentLevel)?.benefits[0] ?? 'You are at the top tier.'}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Estimated value</p>
              <p className="mt-4 text-xl font-semibold text-white">{formatCurrency((profile?.points ?? 0) * 0.2)}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Rewards history</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Recent points activity</h2>
          <div className="mt-6 space-y-4">
            {(profile?.rewardsHistory ?? []).length === 0 ? <p className="rounded-[1.25rem] border border-dashed border-white/10 bg-slate-900/90 p-6 text-slate-300">No rewards have been redeemed yet. Claim a reward when you are ready.</p> : profile?.rewardsHistory.map((entry) => (
              <article key={entry.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{entry.label}</p>
                    <p className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${entry.points < 0 ? 'border-amber-400/30 bg-amber-400/10 text-amber-100' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'}`}>{entry.points > 0 ? '+' : ''}{entry.points} pts</span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-400">{entry.status}</p>
              </article>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Redeem rewards</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Available loyalty rewards</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {rules.map((rule) => (
            <article key={rule.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{rule.type}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{rule.name}</h3>
              <p className="mt-3 text-sm text-slate-300">{rule.description}</p>
              <p className="mt-4 text-sm text-amber-100">{rule.pointsRequired} points · {rule.discount}</p>
              <button type="button" onClick={() => redeemReward(rule)} disabled={(profile?.points ?? 0) < rule.pointsRequired} className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60">Redeem reward</button>
            </article>
          ))}
        </div>
      </article>

      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Membership tiers</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">How your loyalty status grows</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{levels.map((level) => (
          <article key={level.name} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{level.name}</p>
            <p className="mt-3 text-sm text-white">Requires {level.minPoints} points</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">{level.benefits.map((benefit) => <li key={benefit}>• {benefit}</li>)}</ul>
          </article>
        ))}</div>
      </article>
    </section>
  )
}
