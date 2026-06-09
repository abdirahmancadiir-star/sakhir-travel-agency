import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CalendarDays, FileText, Globe, Package2, ShieldCheck, Wallet, Plane, Hotel, Compass, BadgeCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function customerStatusTone(status: string) {
  const normalized = String(status || '').toLowerCase()
  if (['confirmed', 'completed', 'approved', 'delivered'].includes(normalized)) return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
  if (['pending', 'processing', 'submitted', 'in transit'].includes(normalized)) return 'border-amber-400/30 bg-amber-400/10 text-amber-100'
  return 'border-rose-400/30 bg-rose-500/10 text-rose-100'
}

function CustomerDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [visaApplications, setVisaApplications] = useState<any[]>([])
  const [cargoOrders, setCargoOrders] = useState<any[]>([])
  const [trackingRecords, setTrackingRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function loadDashboardData() {
      setLoading(true)
      setError(null)

      const [bookingsResponse, paymentsResponse, visaResponse, cargoResponse, trackingResponse] = await Promise.all([
        supabase
          .from('bookings')
          .select('id,booking_type,booking_reference,status,total_price,start_date,end_date,flight_route,cargo_description,hotels(name),tours(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('visa_applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('cargo_orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('tracking_records')
          .select('*')
          .eq('customer_email', user.email || '')
          .order('updated_at', { ascending: false }),
      ])

      if (bookingsResponse.error || paymentsResponse.error || visaResponse.error || cargoResponse.error || trackingResponse.error) {
        setError('Unable to load your customer dashboard yet. Please try again in a moment.')
        setLoading(false)
        return
      }

      setBookings(bookingsResponse.data ?? [])
      setPayments(paymentsResponse.data ?? [])
      setVisaApplications(visaResponse.data ?? [])
      setCargoOrders(cargoResponse.data ?? [])
      setTrackingRecords(trackingResponse.data ?? [])
      setLoading(false)
    }

    void loadDashboardData()
  }, [user])

  const summary = useMemo(() => {
    const completedPayments = payments.filter((entry) => entry.status === 'completed').reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
    const pendingPayments = payments.filter((entry) => entry.status === 'pending').reduce((sum, entry) => sum + Number(entry.amount || 0), 0)

    return {
      totalBookings: bookings.length,
      totalSpent: completedPayments,
      pendingAmount: pendingPayments,
      activeVisa: visaApplications.filter((entry) => !['approved', 'rejected'].includes(String(entry.status || '').toLowerCase())).length,
      activeCargo: cargoOrders.filter((entry) => !['delivered', 'cancelled'].includes(String(entry.status || '').toLowerCase())).length,
    }
  }, [bookings, cargoOrders, payments, visaApplications])

  const recentActivity = useMemo(() => {
    const items = [
      ...bookings.slice(0, 3).map((entry) => ({
        label: `${entry.booking_type || 'booking'} update`,
        value: entry.status,
        time: entry.start_date || entry.created_at,
      })),
      ...payments.slice(0, 2).map((entry) => ({
        label: 'Payment update',
        value: `${entry.payment_method || 'Gateway'} · ${entry.status}`,
        time: entry.created_at,
      })),
      ...visaApplications.slice(0, 2).map((entry) => ({
        label: 'Visa update',
        value: entry.status,
        time: entry.created_at,
      })),
    ].sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime())

    return items.slice(0, 6)
  }, [bookings, payments, visaApplications])

  const downloadReceipt = (payment: any) => {
    const text = [
      'Sakhir Travel & Cargo Receipt',
      '=============================',
      `Transaction: ${payment.transaction_reference || payment.id}`,
      `Amount: ${formatCurrency(Number(payment.amount || 0))}`,
      `Status: ${payment.status || 'pending'}`,
      `Method: ${payment.payment_method || 'Gateway'}`,
      `Customer: ${payment.customer_name || user?.full_name || user?.email}`,
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
        <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Customer dashboard</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Sign in to manage your bookings and payments</h1>
        <p className="mt-4 text-slate-300">Your dashboard keeps flights, cargo, visas, and payment history in one secure place. Use the sign-in area to access your personal travel workspace.</p>
      </section>
    )
  }

  return (
    <section className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Customer dashboard</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Welcome back, {user.full_name || user.email || 'traveler'}.</h1>
            <p className="mt-5 max-w-2xl text-slate-300">Track bookings, review payments, manage visa applications, monitor cargo shipments, and keep every travel detail in one secure place.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 text-slate-200">
            <div className="flex items-center gap-3 text-amber-200">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-sm uppercase tracking-[0.24em]">Secure authentication</p>
            </div>
            <p className="mt-3 text-xl font-semibold text-white">Real-time updates & secure access</p>
            <p className="mt-3 text-sm text-slate-300">Every booking and payment event is synced to your account so you always see the latest travel status without contacting support.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          {[
            { label: 'Total bookings', value: summary.totalBookings, icon: CalendarDays, accent: 'text-amber-100' },
            { label: 'Completed spend', value: formatCurrency(summary.totalSpent), icon: Wallet, accent: 'text-emerald-100' },
            { label: 'Active visa cases', value: summary.activeVisa, icon: FileText, accent: 'text-sky-100' },
            { label: 'Active cargo requests', value: summary.activeCargo, icon: Package2, accent: 'text-violet-100' },
          ].map((item) => (
            <article key={item.label} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
                <item.icon className="h-5 w-5 text-amber-300" />
              </div>
              <p className={`mt-4 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
            </article>
          ))}
        </div>
      </article>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Overview</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Recent activity</h2>
            </div>
            <Bell className="h-5 w-5 text-amber-300" />
          </div>
          <div className="mt-6 space-y-4">
            {loading ? <p className="text-slate-300">Loading your dashboard…</p> : recentActivity.length === 0 ? <p className="rounded-[1.25rem] border border-dashed border-white/10 bg-slate-900/90 p-5 text-slate-300">No recent activity yet. Create a booking or payment to populate this panel.</p> : recentActivity.map((item, index) => (
              <article key={`${item.label}-${index}`} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-2 text-sm text-slate-200">{item.value}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-400">Updated {new Date(item.time || new Date()).toLocaleString()}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Quick access</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Manage everything from one dashboard</h2>
          <div className="mt-6 grid gap-4">
            {[
              ['Flights & Hotels', '/bookings', Plane],
              ['Payments & Receipts', '/payments', Wallet],
              ['Track a booking', '/track-booking', Globe],
              ['Visa & cargo updates', '/contact', BadgeCheck],
            ].map(([label, to, Icon]) => (
              <Link key={label} to={to as string} className="flex items-center justify-between rounded-[1.35rem] border border-white/10 bg-slate-900/85 p-4 text-slate-100 transition hover:border-amber-400/40 hover:bg-slate-800">
                <span className="flex items-center gap-3 text-sm font-semibold"><Icon className="h-4 w-4 text-amber-300" />{label}</span>
                <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Open</span>
              </Link>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">My bookings</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Flight, hotel, and tour reservations</h2>
          </div>
          <Link to="/bookings" className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-amber-100 hover:bg-amber-400/20">View all</Link>
        </div>
        {loading ? <p className="mt-6 text-slate-300">Loading your bookings…</p> : bookings.length === 0 ? <p className="mt-6 rounded-[1.25rem] border border-dashed border-white/10 bg-slate-900/90 p-6 text-slate-300">No bookings yet. Start by searching flights or packages.</p> : <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{bookings.map((booking) => (
          <article key={booking.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{booking.booking_type}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{booking.booking_type === 'tour' ? booking.tours?.name : booking.booking_type === 'hotel' ? booking.hotels?.name : booking.flight_route || booking.cargo_description || 'Travel booking'}</h3>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${customerStatusTone(booking.status)}`}>{booking.status}</span>
            </div>
            <p className="mt-4 text-sm text-slate-200">{booking.start_date} → {booking.end_date}</p>
            <p className="mt-2 text-sm text-slate-300">Reference: {booking.booking_reference || booking.id.slice(0, 8).toUpperCase()}</p>
            <p className="mt-3 text-lg font-semibold text-amber-100">{formatCurrency(Number(booking.total_price || 0))}</p>
          </article>
        ))}</div>}
      </article>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">My payments</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Payment history & receipts</h2>
            </div>
            <Wallet className="h-5 w-5 text-amber-300" />
          </div>
          {payments.length === 0 ? <p className="mt-6 rounded-[1.25rem] border border-dashed border-white/10 bg-slate-900/90 p-6 text-slate-300">No payment records yet.</p> : <div className="mt-6 space-y-4">{payments.slice(0, 5).map((payment) => (
            <article key={payment.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{payment.transaction_reference || payment.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-slate-400">{payment.payment_method || 'Gateway'} · {payment.payment_type || 'booking'}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${customerStatusTone(payment.status)}`}>{payment.status}</span>
              </div>
              <p className="mt-3 text-sm text-slate-200">Amount: {formatCurrency(Number(payment.amount || 0))}</p>
              <p className="mt-1 text-xs text-slate-400">Created {new Date(payment.created_at).toLocaleString()}</p>
              <button type="button" onClick={() => downloadReceipt(payment)} className="mt-4 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100 hover:bg-amber-400/20">Download receipt</button>
            </article>
          ))}</div>}
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Profile</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Account summary</h2>
            </div>
            <Globe className="h-5 w-5 text-amber-300" />
          </div>
          <div className="mt-6 space-y-4 text-sm text-slate-200">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Email</p>
              <p className="mt-2 text-base text-white">{user.email}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Role</p>
              <p className="mt-2 text-base text-white">{user.role || 'customer'}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Preferences</p>
              <ul className="mt-3 space-y-2 text-slate-200">
                <li>• Edit profile details</li>
                <li>• Change password</li>
                <li>• Manage notifications</li>
              </ul>
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Visa applications</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Application status & documents</h2>
            </div>
            <FileText className="h-5 w-5 text-amber-300" />
          </div>
          {visaApplications.length === 0 ? <p className="mt-6 rounded-[1.25rem] border border-dashed border-white/10 bg-slate-900/90 p-6 text-slate-300">No visa applications yet.</p> : <div className="mt-6 space-y-4">{visaApplications.slice(0, 4).map((application) => (
            <article key={application.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{application.passport_number || 'Visa application'}</p>
                  <p className="text-xs text-slate-400">{application.country || 'Processing location'}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${customerStatusTone(application.status)}`}>{application.status}</span>
              </div>
              <p className="mt-3 text-sm text-slate-200">Documents uploaded: {application.documents_count || 'Pending'}</p>
            </article>
          ))}</div>}
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Cargo requests</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Shipment status & tracking</h2>
            </div>
            <Package2 className="h-5 w-5 text-amber-300" />
          </div>
          {cargoOrders.length === 0 ? <p className="mt-6 rounded-[1.25rem] border border-dashed border-white/10 bg-slate-900/90 p-6 text-slate-300">No cargo orders have been created yet.</p> : <div className="mt-6 space-y-4">{cargoOrders.slice(0, 4).map((cargo) => (
            <article key={cargo.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{cargo.service_type || 'Cargo shipment'}</p>
                  <p className="text-xs text-slate-400">{cargo.origin || 'Origin'} → {cargo.destination || 'Destination'}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${customerStatusTone(cargo.status)}`}>{cargo.status}</span>
              </div>
              <p className="mt-3 text-sm text-slate-200">Tracking: {cargo.tracking_number || 'Awaiting update'}</p>
            </article>
          ))}</div>}
          <div className="mt-6 rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 p-5 text-sm text-amber-50">
            <p className="font-semibold">Live tracking links</p>
            <p className="mt-2 text-amber-100">Use the public tracking page to check flights, hotels, tours, cargo, and visa stages with your booking reference and email.</p>
          </div>
        </article>
      </div>

      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Tracking</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Public booking tracking records</h2>
          </div>
          <Compass className="h-5 w-5 text-amber-300" />
        </div>
        {trackingRecords.length === 0 ? <p className="mt-6 rounded-[1.25rem] border border-dashed border-white/10 bg-slate-900/90 p-6 text-slate-300">No tracking record is available yet. Your booking reference can be used on the track page once records are generated.</p> : <div className="mt-6 grid gap-5 md:grid-cols-2">{trackingRecords.map((record) => (
          <article key={record.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/85 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{record.booking_type}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{record.reference_number}</h3>
            <p className="mt-2 text-sm text-slate-200">{record.summary || 'Tracking record update'}</p>
            <p className="mt-3 text-sm text-slate-300">Status: {record.current_status}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">Last update: {new Date(record.updated_at || record.created_at).toLocaleString()}</p>
          </article>
        ))}</div>}
      </article>

      {error && <p className="rounded-[1.5rem] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</p>}
    </section>
  )
}

export default CustomerDashboard
