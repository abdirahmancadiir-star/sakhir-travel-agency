import { useEffect, useState } from 'react'
import { getCoupons, saveCoupons, type Coupon } from '../lib/loyalty'

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(() => getCoupons())
  const [form, setForm] = useState({ code: '', type: 'percentage' as 'fixed' | 'percentage', value: 10, service: 'All' as Coupon['service'], expiryDate: '2026-12-31', usageLimit: 10 })

  useEffect(() => {
    setCoupons(getCoupons())
  }, [])

  const saveCoupon = () => {
    const nextCoupon: Coupon = {
      id: `coupon-${Date.now()}`,
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: Number(form.value),
      service: form.service,
      expiryDate: form.expiryDate,
      usageLimit: Number(form.usageLimit),
      usedCount: 0,
      active: true,
    }

    const updated = [nextCoupon, ...coupons]
    setCoupons(updated)
    saveCoupons(updated)
    setForm({ code: '', type: 'percentage', value: 10, service: 'All', expiryDate: '2026-12-31', usageLimit: 10 })
  }

  return (
    <section className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Coupon management</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Create, manage, and apply discount promotions</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Fixed amount and percentage discounts can be used for flights, hotels, tours, and cargo. Use this page to create new offers and set expiry dates and usage limits.</p>
      </article>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Create coupon</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Admin coupon builder</h2>
          <div className="mt-6 space-y-5 text-sm text-slate-200">
            <label className="block space-y-2"><span>Coupon code</span><input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="SAVE10" /></label>
            <label className="block space-y-2"><span>Type</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as 'fixed' | 'percentage' })} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"><option value="fixed">Fixed amount</option><option value="percentage">Percentage discount</option></select></label>
            <label className="block space-y-2"><span>Value</span><input type="number" value={form.value} onChange={(event) => setForm({ ...form, value: Number(event.target.value) })} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" /></label>
            <label className="block space-y-2"><span>Applicable service</span><select value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value as Coupon['service'] })} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"><option value="All">All services</option><option value="Flights">Flights</option><option value="Hotels">Hotels</option><option value="Tours">Tours</option><option value="Cargo">Cargo</option></select></label>
            <label className="block space-y-2"><span>Expiry date</span><input type="date" value={form.expiryDate} onChange={(event) => setForm({ ...form, expiryDate: event.target.value })} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" /></label>
            <label className="block space-y-2"><span>Usage limit</span><input type="number" value={form.usageLimit} onChange={(event) => setForm({ ...form, usageLimit: Number(event.target.value) })} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" /></label>
            <button type="button" onClick={saveCoupon} className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300">Create coupon</button>
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Available coupons</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Promotions ready for checkout</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">{coupons.map((coupon) => (
            <article key={coupon.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5 text-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-semibold text-white">{coupon.code}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{coupon.service}</p>
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-100">{coupon.active ? 'Active' : 'Paused'}</span>
              </div>
              <p className="mt-4 text-sm text-slate-300">{coupon.type === 'fixed' ? '$' + coupon.value : coupon.value + '%'} off · Expires {coupon.expiryDate}</p>
              <p className="mt-2 text-xs text-slate-400">Used {coupon.usedCount} of {coupon.usageLimit} times</p>
            </article>
          ))}</div>
        </article>
      </div>
    </section>
  )
}
