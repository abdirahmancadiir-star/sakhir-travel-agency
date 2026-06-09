import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getCoupons, saveCoupons } from '../lib/loyalty'
import { supabase } from '../lib/supabase'
import { sendPaymentConfirmation } from '../lib/notifications'

const paymentMethods = [
  { key: 'Stripe', label: 'Stripe', accent: 'bg-emerald-400/10 text-emerald-100 border-emerald-400/30' },
  { key: 'PayPal', label: 'PayPal', accent: 'bg-sky-400/10 text-sky-100 border-sky-400/30' },
  { key: 'M-Pesa', label: 'M-Pesa', accent: 'bg-amber-400/10 text-amber-100 border-amber-400/30' },
  { key: 'Visa Card', label: 'Visa Card', accent: 'bg-violet-400/10 text-violet-100 border-violet-400/30' },
  { key: 'Mastercard', label: 'Mastercard', accent: 'bg-rose-400/10 text-rose-100 border-rose-400/30' },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function Payments() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [bookingId, setBookingId] = useState('')
  const [bookingType, setBookingType] = useState('flight')
  const [amount, setAmount] = useState('0')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState('Stripe')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setLoading(false)
        return
      }

      const [bookingResponse, paymentResponse] = await Promise.all([
        supabase
          .from('bookings')
          .select('id,booking_type,total_price,status,start_date,end_date,flight_route,cargo_description,tours(name),hotels(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ])

      if (bookingResponse.error) {
        setError('Unable to load your bookings for payment processing.')
      } else {
        setBookings(bookingResponse.data ?? [])
      }

      if (paymentResponse.error) {
        setError('Unable to load your payment history.')
      } else {
        setPayments(paymentResponse.data ?? [])
      }

      setLoading(false)
    }

    void loadData()
  }, [user])

  const summary = useMemo(() => {
    const completed = payments.filter((entry) => entry.status === 'completed').reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
    const pending = payments.filter((entry) => entry.status === 'pending').reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
    const failed = payments.filter((entry) => entry.status === 'failed').reduce((sum, entry) => sum + Number(entry.amount || 0), 0)

    return { completed, pending, failed, count: payments.length }
  }, [payments])

  const applyCoupon = () => {
    const total = Number(amount)
    if (!Number.isFinite(total) || total <= 0) {
      setError('Enter a valid amount before applying a coupon.')
      return
    }

    const coupons = getCoupons()
    const coupon = coupons.find((entry) => entry.code.toUpperCase() === couponCode.trim().toUpperCase() && entry.active)

    if (!coupon) {
      setError('That coupon code is not available or has expired.')
      setAppliedCoupon(null)
      return
    }

    if (coupon.usageLimit <= coupon.usedCount) {
      setError('This coupon has reached its usage limit.')
      setAppliedCoupon(null)
      return
    }

    const expiry = new Date(coupon.expiryDate)
    if (Number.isNaN(expiry.getTime()) || expiry < new Date()) {
      setError('This coupon has expired.')
      setAppliedCoupon(null)
      return
    }

    const discount = coupon.type === 'fixed' ? Math.min(coupon.value, total) : total * (coupon.value / 100)
    setAppliedCoupon({ ...coupon, discount, discountedTotal: total - discount })
    setMessage(`Coupon ${coupon.code} applied successfully. Discount: ${coupon.type === 'fixed' ? formatCurrency(discount) : `${coupon.value}%`}.`)
    setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    const total = Number(amount)
    if (!Number.isFinite(total) || total <= 0) {
      setError('Enter a valid amount before continuing.')
      return
    }

    const finalTotal = appliedCoupon ? appliedCoupon.discountedTotal : total

    setSubmitting(true)
    setError(null)
    setMessage('Processing your payment securely…')

    const transactionReference = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const status = paymentMethod === 'M-Pesa' ? 'pending' : 'completed'

    const booking = bookings.find((entry) => entry.id === bookingId)
    const paymentPayload = {
      user_id: user.id,
      booking_id: bookingId || null,
      amount: finalTotal,
      currency: 'USD',
      payment_method: paymentMethod,
      status,
      transaction_reference: transactionReference,
      payment_type: bookingType,
      gateway: paymentMethod,
      customer_name: user.full_name ?? user.email,
      customer_email: user.email,
      booking_reference: booking?.id ?? transactionReference,
      notes: notes || `Payment for ${bookingType} booking via ${paymentMethod}${appliedCoupon ? ` · coupon ${appliedCoupon.code}` : ''}`,
    }

    const { data, error: insertError } = await supabase
      .from('payments')
      .insert(paymentPayload)
      .select('*')
      .single()

    if (insertError || !data) {
      setSubmitting(false)
      setError('Payment could not be saved. Please try again in a moment.')
      return
    }

    if (appliedCoupon) {
      const coupons = getCoupons().map((entry) => entry.id === appliedCoupon.id ? { ...entry, usedCount: entry.usedCount + 1 } : entry)
      saveCoupons(coupons)
    }

    if (bookingId) {
      await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId)
    }

    const emailSent = await sendPaymentConfirmation({
      customerName: user.full_name ?? user.email,
      customerEmail: user.email ?? 'support@sakhirtravel.com',
      amount: finalTotal,
      currency: 'USD',
      paymentMethod,
      status,
      transactionReference,
      bookingType,
      bookingId: bookingId || data.id,
    })

    setPayments((current) => [data, ...current])
    setMessage(`Payment ${status === 'completed' ? 'confirmed' : 'initiated'} successfully. ${emailSent ? 'A confirmation was sent to your email.' : 'Email confirmation is unavailable right now.'}`)
    setSubmitting(false)
  }

  const downloadReceipt = (payment: any) => {
    const text = [
      'Sakhir Travel & Cargo Agency Receipt',
      '==================================',
      `Transaction ID: ${payment.transaction_reference || payment.id}`,
      `Payment Method: ${payment.payment_method || 'Gateway'}`,
      `Amount: ${formatCurrency(Number(payment.amount || 0))}`,
      `Status: ${payment.status || 'pending'}`,
      `Customer: ${payment.customer_name || 'Customer'}`,
      `Email: ${payment.customer_email || 'N/A'}`,
      `Date: ${new Date(payment.created_at).toLocaleString()}`,
      'Thank you for choosing Sakhir Travel & Cargo.',
    ].join('\n')

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `receipt-${payment.transaction_reference || payment.id}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 text-slate-200 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)]">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Secure checkout</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Sign in to access the payment gateway</h1>
        <p className="mt-4 text-slate-300">Customers must be signed in to pay for bookings, store transaction records and receive confirmation emails.</p>
      </section>
    )
  }

  return (
    <section className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Payment gateway</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Complete booking payments online</h1>
            <p className="mt-5 max-w-2xl text-slate-300">Support for Stripe, PayPal, M-Pesa, Visa Card and Mastercard with transaction records, receipt downloads and payment confirmation emails.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 text-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Security</p>
            <p className="mt-3 text-xl font-semibold text-white">PCI-ready payment flow</p>
            <p className="mt-3 text-sm text-slate-300">Only secure transaction references and customer identifiers are stored. Card details are not kept on our platform.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          {[
            { label: 'Payments', value: summary.count, accent: 'text-amber-200' },
            { label: 'Completed', value: formatCurrency(summary.completed), accent: 'text-emerald-200' },
            { label: 'Pending', value: formatCurrency(summary.pending), accent: 'text-amber-100' },
            { label: 'Failed', value: formatCurrency(summary.failed), accent: 'text-rose-100' },
          ].map((item) => (
            <article key={item.label} className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
              <p className={`mt-4 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
            </article>
          ))}
        </div>
      </article>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Checkout</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Pay for flights, hotel stays, tours, cargo and visa support</h2>
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block space-y-2 text-sm text-slate-200">
              <span>Booking type</span>
              <select value={bookingType} onChange={(event) => setBookingType(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400">
                <option value="flight">Flight payment</option>
                <option value="hotel">Hotel payment</option>
                <option value="tour">Tour deposit / full payment</option>
                <option value="cargo">Cargo service / shipping invoice</option>
                <option value="visa">Visa application fee</option>
              </select>
            </label>

            <label className="block space-y-2 text-sm text-slate-200">
              <span>Link to booking</span>
              <select value={bookingId} onChange={(event) => setBookingId(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400">
                <option value="">No booking selected</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>{booking.id.slice(0, 8).toUpperCase()} · {booking.booking_type} · {formatCurrency(Number(booking.total_price || 0))}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-2 text-sm text-slate-200">
              <span>Amount (USD)</span>
              <input type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" />
            </label>

            <label className="block space-y-2 text-sm text-slate-200">
              <span>Coupon code</span>
              <div className="flex flex-wrap gap-3">
                <input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} className="flex-1 rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="SAVE10" />
                <button type="button" onClick={applyCoupon} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100 hover:bg-amber-400/20">Apply</button>
              </div>
            </label>
            {appliedCoupon && <p className="rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">Coupon {appliedCoupon.code} applied. New total: {formatCurrency(appliedCoupon.discountedTotal)}.</p>}

            <label className="block space-y-2 text-sm text-slate-200">
              <span>Payment method</span>
              <div className="grid gap-3 md:grid-cols-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() => setPaymentMethod(method.key)}
                    className={`rounded-[1.25rem] border px-4 py-3 text-left text-sm transition ${paymentMethod === method.key ? 'border-amber-400 bg-amber-400/10 text-amber-50' : 'border-white/10 bg-slate-900/90 text-slate-200 hover:border-amber-400/40'}`}
                  >
                    <span className="block font-semibold">{method.label}</span>
                    <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Secure gateway</span>
                  </button>
                ))}
              </div>
            </label>

            <label className="block space-y-2 text-sm text-slate-200">
              <span>Notes</span>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="Deposit, invoice number, travel reference, or payment note." />
            </label>

            <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70">{submitting ? 'Processing payment…' : 'Pay now'}</button>
          </form>

          {error && <p className="mt-4 rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</p>}
          {message && <p className="mt-4 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">{message}</p>}
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Wallet & history</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Customer payment history</h2>
          {loading ? (
            <p className="mt-6 text-slate-300">Loading payment history…</p>
          ) : payments.length === 0 ? (
            <p className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-slate-900/90 p-6 text-slate-300">No payment records yet. Use the checkout panel to create your first transaction.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {payments.map((payment) => (
                <article key={payment.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{payment.transaction_reference || payment.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-slate-400">{payment.payment_method || 'Gateway'} · {payment.payment_type || 'booking'}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${payment.status === 'completed' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100' : payment.status === 'failed' ? 'border-rose-400/30 bg-rose-400/10 text-rose-100' : 'border-amber-400/30 bg-amber-400/10 text-amber-100'}`}>{payment.status}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-200">Amount: {formatCurrency(Number(payment.amount || 0))}</p>
                  <p className="text-xs text-slate-400">Created {new Date(payment.created_at).toLocaleString()}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button type="button" onClick={() => downloadReceipt(payment)} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100 hover:bg-amber-400/20">Download receipt</button>
                    <button type="button" onClick={async () => { if (!user?.email) return; await sendPaymentConfirmation({ customerName: user.full_name ?? user.email, customerEmail: user.email, amount: Number(payment.amount || 0), currency: payment.currency || 'USD', paymentMethod: payment.payment_method, status: payment.status, transactionReference: payment.transaction_reference || payment.id, bookingType: payment.payment_type || 'booking', bookingId: payment.booking_id || payment.id }); setMessage('Payment confirmation email sent successfully.'); }} className="rounded-full border border-white/10 bg-slate-950/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-100 hover:border-amber-400">Email confirmation</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

export default Payments
