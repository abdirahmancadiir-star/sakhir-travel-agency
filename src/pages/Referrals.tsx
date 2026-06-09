import { useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createReferralCode, generateReferralLink, getLoyaltyProfile, getReferrals, saveReferrals, type ReferralRecord } from '../lib/loyalty'

export default function Referrals() {
  const { user } = useAuth()
  const [referralCode, setReferralCode] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [message, setMessage] = useState('')

  const currentProfile = useMemo(() => {
    if (!user) return null
    return getLoyaltyProfile(user.id, user.email || 'customer@example.com')
  }, [user])

  const referrals = useMemo(() => getReferrals(), [])

  const generateCode = () => {
    if (!user) return
    const code = createReferralCode(user.email || 'customer@example.com')
    const profile = getLoyaltyProfile(user.id, user.email || 'customer@example.com')
    profile.referralCode = code
    setReferralCode(code)
    setMessage(`Your referral code is ready: ${code}`)
  }

  const addReferral = () => {
    if (!user || !inviteEmail.trim()) return
    const next: ReferralRecord = {
      id: `${Date.now()}`,
      referrerId: user.id,
      referrerEmail: user.email || '',
      referralCode: referralCode || currentProfile?.referralCode || 'REF-000',
      invitedEmail: inviteEmail,
      status: 'pending',
      reward: '100 bonus points + 10% coupon',
      createdAt: new Date().toISOString(),
    }
    const updated = [next, ...getReferrals()]
    saveReferrals(updated)
    setMessage(`Referral tracked for ${inviteEmail}. Bonus points will be credited after the invite completes.`)
    setInviteEmail('')
  }

  if (!user) return <section className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 text-slate-200">Sign in to create and track referrals.</section>

  return (
    <section className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Referral system</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Turn every recommendation into bonus rewards</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Each customer gets a unique referral code, a shareable link, and a reward flow for successful referrals. Track how many invites convert into bookings and credits.</p>
      </article>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Referral code</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Generate & share your link</h2>
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5 text-slate-200">
            <p className="text-sm text-slate-300">Your personal code</p>
            <p className="mt-2 text-2xl font-semibold text-amber-100">{currentProfile?.referralCode || referralCode || 'Generate a code to begin'}</p>
          </div>
          <button type="button" onClick={generateCode} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300">Generate referral code</button>
          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Share link</p>
            <p className="mt-3 break-all text-slate-100">{generateReferralLink(currentProfile?.referralCode || referralCode || 'REF-000')}</p>
          </div>
          {message && <p className="mt-4 rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">{message}</p>}
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Track invites</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Reward structure</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-200">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">100 bonus points for every successful referral.</div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">10% discount coupon for eligible flights, hotels, tours, and cargo.</div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">Cash credits are added to the customer wallet once the invited guest completes their first booking.</div>
          </div>
          <label className="mt-6 block space-y-2 text-sm text-slate-200">
            <span>Invite email</span>
            <input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="friend@example.com" />
          </label>
          <button type="button" onClick={addReferral} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300">Log referral</button>
        </article>
      </div>

      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Performance</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Referral analytics</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            { label: 'Referrals tracked', value: referrals.length },
            { label: 'Completed', value: referrals.filter((entry) => entry.status === 'completed').length },
            { label: 'Pending', value: referrals.filter((entry) => entry.status === 'pending').length },
          ].map((item) => (
            <article key={item.label} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
              <p className="mt-4 text-3xl font-semibold text-amber-100">{item.value}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 space-y-4">{referrals.map((entry) => (
          <article key={entry.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5 text-sm text-slate-200">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{entry.invitedEmail}</p>
                <p className="text-xs text-slate-400">Code: {entry.referralCode}</p>
              </div>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-amber-100">{entry.status}</span>
            </div>
            <p className="mt-3 text-slate-300">Reward: {entry.reward}</p>
          </article>
        ))}</div>
      </article>
    </section>
  )
}
