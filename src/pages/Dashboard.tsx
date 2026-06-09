import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getFlightPricingSummary, getMarkupSettings, saveMarkupSettings, type MarkupSettings, type MarkupType } from '../lib/flightApi'
import { sendVisaStatusNotification } from '../lib/notifications'
import { supabase } from '../lib/supabase'
import { getWhatsAppSettings, inquiryLogSeed, saveWhatsAppSettings } from '../lib/whatsapp'
import { getVisaStatusLabel, getVisaStatusTone, saveVisaStatus } from '../lib/visa'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function statusTone(status: string) {
  const normalized = status.toLowerCase()
  if (['confirmed', 'completed', 'delivered'].includes(normalized)) return 'bg-emerald-500/10 text-emerald-200 border-emerald-400/30'
  if (['pending', 'requested', 'in transit'].includes(normalized)) return 'bg-amber-400/10 text-amber-100 border-amber-400/30'
  return 'bg-rose-500/10 text-rose-100 border-rose-400/20'
}

function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userSearch, setUserSearch] = useState('')
  const [trackingSearch, setTrackingSearch] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [flightBookings, setFlightBookings] = useState<any[]>([])
  const [hotelBookings, setHotelBookings] = useState<any[]>([])
  const [tourBookings, setTourBookings] = useState<any[]>([])
  const [cargoOrders, setCargoOrders] = useState<any[]>([])
  const [visaApplications, setVisaApplications] = useState<any[]>([])
  const [visaDocuments, setVisaDocuments] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [trackingRecords, setTrackingRecords] = useState<any[]>([])

  const [savingMarkup, setSavingMarkup] = useState(false)
  const [markupMessage, setMarkupMessage] = useState('')
  const [whatsappSettings, setWhatsappSettings] = useState(getWhatsAppSettings())
  const [inquiryLog, setInquiryLog] = useState(inquiryLogSeed)
  const [markupSettings, setMarkupSettings] = useState<MarkupSettings>(() => getMarkupSettings())
  const [pricingSummary, setPricingSummary] = useState(getFlightPricingSummary())
  const [airlineDraft, setAirlineDraft] = useState({ airlineCode: '', type: 'percentage' as MarkupType, value: 10 })
  const [routeDraft, setRouteDraft] = useState({ origin: '', destination: '', type: 'percentage' as MarkupType, value: 5 })

  const loadAdminData = async () => {
    if (!user || user.role !== 'admin') return

    setLoading(true)
    setError(null)

    const [profiles, flightBookingsResult, bookingsResult, cargoResult, visaResult, visaDocsResult, paymentsResult, trackingResult] = await Promise.all([
      supabase.from('profiles').select('id, full_name, role, created_at').order('created_at', { ascending: false }),
      supabase.from('flight_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('cargo_orders').select('*').order('created_at', { ascending: false }),
      supabase.from('visa_applications').select('*').order('created_at', { ascending: false }),
      supabase.from('visa_documents').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
      supabase.from('tracking_records').select('*, tracking_events(*)').order('updated_at', { ascending: false }),
    ])

    if (profiles.error || flightBookingsResult.error || bookingsResult.error || cargoResult.error || visaResult.error || visaDocsResult.error || paymentsResult.error || trackingResult.error) {
      setError('Unable to load the admin dashboard data. Check your database permissions.')
      setLoading(false)
      return
    }

    const bookingRows = bookingsResult.data ?? []
    const hotelRows = bookingRows.filter((item: any) => item.booking_type === 'hotel')
    const tourRows = bookingRows.filter((item: any) => item.booking_type === 'tour')
    const paymentsData = paymentsResult.data ?? []
    const revenue = paymentsData.filter((item: any) => item.status === 'completed').reduce((sum, item) => sum + Number(item.amount || 0), 0)

    setUsers(profiles.data ?? [])
    setFlightBookings(flightBookingsResult.data ?? [])
    setHotelBookings(hotelRows)
    setTourBookings(tourRows)
    setCargoOrders(cargoResult.data ?? [])
    setVisaApplications(visaResult.data ?? [])
    setVisaDocuments(visaDocsResult.data ?? [])
    setPayments(paymentsResult.data ?? [])
    setTrackingRecords(trackingResult.data ?? [])

    const stats = {
      totalUsers: profiles.data?.length ?? 0,
      totalFlightBookings: flightBookingsResult.data?.length ?? 0,
      totalHotelBookings: hotelRows.length,
      totalTourBookings: tourRows.length,
      totalCargoRequests: cargoResult.data?.length ?? 0,
      totalVisaApplications: visaResult.data?.length ?? 0,
      totalRevenue: revenue,
      totalProfit: revenue * 0.18,
      completedPayments: paymentsData.filter((item: any) => item.status === 'completed').length,
      pendingPayments: paymentsData.filter((item: any) => item.status === 'pending').length,
      failedPayments: paymentsData.filter((item: any) => item.status === 'failed').length,
      refundedPayments: paymentsData.filter((item: any) => item.status === 'refunded').length,
    }

    setStats(stats)
    setLoading(false)
  }

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFlightBookings: 0,
    totalHotelBookings: 0,
    totalTourBookings: 0,
    totalCargoRequests: 0,
    totalVisaApplications: 0,
    totalRevenue: 0,
    totalProfit: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    refundedPayments: 0,
  })

  useEffect(() => {
    setMarkupSettings(getMarkupSettings())
    setPricingSummary(getFlightPricingSummary())
    void loadAdminData()
  }, [user])

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase()
    if (!query) return users
    return users.filter((entry) => [entry.full_name, entry.role, entry.id].some((value) => String(value ?? '').toLowerCase().includes(query)))
  }, [users, userSearch])

  const filteredTracking = useMemo(() => {
    const query = trackingSearch.trim().toLowerCase()
    if (!query) return trackingRecords
    return trackingRecords.filter((entry) => [entry.reference_number, entry.customer_email, entry.booking_type, entry.current_status].some((value) => String(value ?? '').toLowerCase().includes(query)))
  }, [trackingRecords, trackingSearch])

  const updateUserRole = async (userId: string, role: 'customer' | 'admin' | 'suspended') => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (error) {
      setError('Unable to update the user role.')
      return
    }
    await loadAdminData()
  }

  const suspendUser = async (userId: string) => {
    await updateUserRole(userId, 'suspended')
  }

  const deleteUser = async (userId: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', userId)
    if (error) {
      setError('Unable to remove the user profile.')
      return
    }
    await loadAdminData()
  }

  const updateTrackingStatus = async (recordId: string, status: string) => {
    const { error } = await supabase.from('tracking_records').update({ current_status: status, updated_at: new Date().toISOString() }).eq('id', recordId)
    if (error) {
      setError('Unable to update the tracking status.')
      return
    }

    await supabase.from('tracking_events').insert({ tracking_record_id: recordId, status, note: 'Admin status update from the dashboard.' })
    await loadAdminData()
  }

  const syncTrackingRecords = async () => {
    setLoading(true)
    setError(null)

    const [flightRows, bookingRows, cargoRows, visaRows] = await Promise.all([
      supabase.from('flight_bookings').select('*'),
      supabase.from('bookings').select('*'),
      supabase.from('cargo_orders').select('*'),
      supabase.from('visa_applications').select('*'),
    ])

    if (flightRows.error || bookingRows.error || cargoRows.error || visaRows.error) {
      setError('Unable to generate tracking references from the current bookings.')
      setLoading(false)
      return
    }

    const recordsToInsert: any[] = []
    const makeReference = () => `TRK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

    ;(flightRows.data ?? []).forEach((record) => {
      recordsToInsert.push({
        reference_number: makeReference(),
        booking_type: 'flight',
        related_table: 'flight_bookings',
        related_id: record.id,
        customer_name: record.origin ? `${record.origin} → ${record.destination}` : 'Flight booking',
        customer_email: '',
        destination: `${record.origin} → ${record.destination}`,
        summary: `${record.travel_class} flight for ${record.passengers} passenger(s)`,
        current_status: record.status || 'pending',
        notes: 'Generated from flight booking data.',
      })
    })

    ;(bookingRows.data ?? []).forEach((record) => {
      recordsToInsert.push({
        reference_number: makeReference(),
        booking_type: record.booking_type === 'hotel' ? 'hotel' : 'tour',
        related_table: 'bookings',
        related_id: record.id,
        customer_name: record.user_id || 'Customer booking',
        customer_email: '',
        destination: record.cargo_destination || record.flight_route || 'Travel package',
        summary: `${record.booking_type} booking · ${record.guests} guest(s)`,
        current_status: record.status || 'pending',
        notes: 'Generated from booking record data.',
      })
    })

    ;(cargoRows.data ?? []).forEach((record) => {
      recordsToInsert.push({
        reference_number: makeReference(),
        booking_type: 'cargo',
        related_table: 'cargo_orders',
        related_id: record.id,
        customer_name: record.contact_name || 'Cargo shipment',
        customer_email: record.contact_email || '',
        destination: `${record.origin} → ${record.destination}`,
        summary: `${record.service_type} · ${record.transport_mode}`,
        current_status: record.status || 'received',
        notes: 'Generated from cargo order data.',
      })
    })

    ;(visaRows.data ?? []).forEach((record) => {
      recordsToInsert.push({
        reference_number: makeReference(),
        booking_type: 'visa',
        related_table: 'visa_applications',
        related_id: record.id,
        customer_name: record.user_id || 'Visa applicant',
        customer_email: '',
        destination: 'Visa processing',
        summary: record.passport_number || 'Visa application',
        current_status: record.status || 'submitted',
        notes: 'Generated from visa application data.',
      })
    })

    const { data: createdRecords, error: insertError } = await supabase.from('tracking_records').insert(recordsToInsert).select('id, current_status')
    if (insertError || !createdRecords) {
      setError('Unable to create tracking records.')
      setLoading(false)
      return
    }

    await supabase.from('tracking_events').insert(createdRecords.map((record) => ({ tracking_record_id: record.id, status: record.current_status, note: 'Tracking record created from admin sync.' })))
    await loadAdminData()
    setLoading(false)
  }

  const refundPayment = async (paymentId: string) => {
    const { error } = await supabase.from('payments').update({ status: 'refunded' }).eq('id', paymentId)
    if (error) {
      setError('Unable to process the refund request.')
      return
    }
    await loadAdminData()
  }

  const updateStatus = async (table: 'bookings' | 'flight_bookings' | 'cargo_orders' | 'visa_applications', id: string, status: string) => {
    const { error } = await supabase.from(table).update({ status }).eq('id', id)
    if (error) {
      setError('Unable to update the booking status.')
      return
    }
    await loadAdminData()
  }

  const reviewVisaApplication = async (applicationId: string, status: 'submitted' | 'under_review' | 'processing' | 'approved' | 'rejected', note: string) => {
    try {
      await saveVisaStatus(applicationId, status, note, user?.id)
      const application = visaApplications.find((entry) => entry.id === applicationId)
      if (application?.email) {
        await sendVisaStatusNotification({
          customerName: application.applicant_name || 'Traveler',
          customerEmail: application.email,
          applicationId,
          status,
          note,
        })
      }
      await loadAdminData()
    } catch (error) {
      console.error(error)
      setError('Unable to update the visa application status.')
    }
  }

  const exportBookings = () => {
    const rows = flightBookings.map((booking) => [
      booking.id,
      booking.origin,
      booking.destination,
      booking.departure_date,
      booking.travel_class,
      booking.passengers,
      booking.total_price,
      booking.status,
    ])

    const csv = ['id,origin,destination,departure_date,travel_class,passengers,total_price,status', ...rows.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'flight-bookings-export.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleSaveWhatsAppSettings() {
    saveWhatsAppSettings(whatsappSettings)
    setError('WhatsApp number and templates saved successfully.')
  }

  function updateMarkupSetting(partial: Partial<MarkupSettings>) {
    setMarkupSettings((current) => ({
      global: { ...current.global, ...partial.global },
      airlineSpecific: current.airlineSpecific,
      routeSpecific: current.routeSpecific,
      ...partial,
    }))
  }

  function handleSaveMarkup() {
    setSavingMarkup(true)
    setMarkupMessage('')
    saveMarkupSettings(markupSettings)
    setPricingSummary(getFlightPricingSummary())
    setTimeout(() => {
      setMarkupMessage('Markup rules saved. Flight pricing is now updated for the customer-facing search results.')
      setSavingMarkup(false)
    }, 200)
  }

  function addAirlineRule() {
    const code = airlineDraft.airlineCode.trim().toUpperCase()
    if (!code) {
      setMarkupMessage('Enter an airline code before saving a rule.')
      return
    }

    setMarkupSettings((current) => ({
      ...current,
      airlineSpecific: [...current.airlineSpecific.filter((rule) => rule.airlineCode !== code), { airlineCode: code, type: airlineDraft.type, value: Number(airlineDraft.value || 0) }],
    }))
    setAirlineDraft({ airlineCode: '', type: 'percentage', value: 10 })
  }

  function addRouteRule() {
    const origin = routeDraft.origin.trim().toUpperCase()
    const destination = routeDraft.destination.trim().toUpperCase()
    if (!origin || !destination) {
      setMarkupMessage('Enter both the origin and destination airports for the route rule.')
      return
    }

    setMarkupSettings((current) => ({
      ...current,
      routeSpecific: [...current.routeSpecific.filter((rule) => !(rule.origin === origin && rule.destination === destination)), { origin, destination, type: routeDraft.type, value: Number(routeDraft.value || 0) }],
    }))
    setRouteDraft({ origin: '', destination: '', type: 'percentage', value: 5 })
  }

  function removeRule(type: 'airline' | 'route', index: number) {
    if (type === 'airline') {
      setMarkupSettings((current) => ({
        ...current,
        airlineSpecific: current.airlineSpecific.filter((_, ruleIndex) => ruleIndex !== index),
      }))
    } else {
      setMarkupSettings((current) => ({
        ...current,
        routeSpecific: current.routeSpecific.filter((_, ruleIndex) => ruleIndex !== index),
      }))
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <section className="mx-auto max-w-5xl rounded-[2rem] bg-slate-950/95 p-10 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.18)] border border-white/10">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-300">Restricted access</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Admin dashboard</h1>
        <p className="mt-4 max-w-2xl text-slate-300">Sign in with an administrator account to access the full operations panel, user controls and booking reports.</p>
      </section>
    )
  }

  return (
    <section className="space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Admin control center</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Sakhir Travel & Cargo operations dashboard</h1>
            <p className="mt-5 max-w-3xl text-slate-300">Track revenue, customer accounts, bookings, cargo, visa files and pricing rules from one premium admin workspace.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Security & roles</p>
            <p className="mt-4 text-2xl font-semibold text-white">Role-based permissions</p>
            <p className="mt-3 text-sm text-slate-300">This panel is restricted to admins. User actions and booking updates use the existing Supabase policy layer and database schema.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, accent: 'text-amber-300' },
            { label: 'Total Flight Bookings', value: stats.totalFlightBookings, accent: 'text-sky-200' },
            { label: 'Total Hotel Bookings', value: stats.totalHotelBookings, accent: 'text-emerald-200' },
            { label: 'Total Tour Bookings', value: stats.totalTourBookings, accent: 'text-violet-200' },
            { label: 'Total Cargo Requests', value: stats.totalCargoRequests, accent: 'text-rose-200' },
            { label: 'Total Visa Applications', value: stats.totalVisaApplications, accent: 'text-cyan-200' },
            { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), accent: 'text-amber-200' },
            { label: 'Total Profit', value: formatCurrency(stats.totalProfit), accent: 'text-emerald-200' },
          ].map((item) => (
            <article key={item.label} className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
              <p className={`mt-4 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">User management</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Registered users</h2>
              </div>
              <label className="w-full max-w-sm text-sm text-slate-300">
                <span className="mb-2 block">Search users</span>
                <input
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"
                  placeholder="Search by name, role or ID"
                />
              </label>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
                <thead>
                  <tr>
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Created</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((userItem) => (
                    <tr key={userItem.id} className="align-top text-slate-200">
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-white">{userItem.full_name || 'Unnamed user'}</p>
                        <p className="text-xs text-slate-400">{userItem.id}</p>
                      </td>
                      <td className="py-4 pr-4">{userItem.role}</td>
                      <td className="py-4 pr-4">{new Date(userItem.created_at).toLocaleDateString()}</td>
                      <td className="py-4 pr-4">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => updateUserRole(userItem.id, 'admin')} className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">Promote</button>
                          <button type="button" onClick={() => suspendUser(userItem.id)} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">Suspend</button>
                          <button type="button" onClick={() => deleteUser(userItem.id)} className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Booking intelligence</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Revenue & profit snapshot</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Completed revenue</p>
                <p className="mt-3 text-3xl font-semibold text-amber-200">{formatCurrency(stats.totalRevenue)}</p>
                <p className="mt-2 text-sm text-slate-300">Calculated from completed payment records in the platform ledger.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Estimated profit</p>
                <p className="mt-3 text-3xl font-semibold text-emerald-200">{formatCurrency(stats.totalProfit)}</p>
                <p className="mt-2 text-sm text-slate-300">A live operational margin estimate to help leadership plan commissions and payouts.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Customer coverage</p>
                <p className="mt-3 text-2xl font-semibold text-white">{stats.totalUsers} registered accounts</p>
                <p className="mt-2 text-sm text-slate-300">User management is available directly from this panel alongside booking analytics.</p>
              </div>
            </div>
          </article>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Flight management</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Flight bookings</h2>
              </div>
              <button type="button" onClick={exportBookings} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100 hover:bg-amber-400/20">Export CSV</button>
            </div>
            <div className="mt-6 space-y-3">
              {flightBookings.slice(0, 6).map((booking) => (
                <div key={booking.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{booking.origin} → {booking.destination}</p>
                      <p className="text-xs text-slate-400">Passenger count: {booking.passengers} · {booking.travel_class}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${statusTone(booking.status)}`}>{booking.status}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                    <span>Departure {new Date(booking.departure_date).toLocaleDateString()}</span>
                    <strong className="text-amber-100">{formatCurrency(Number(booking.total_price || 0))}</strong>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Hotel management</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Hotel bookings</h2>
            <div className="mt-6 space-y-3">
              {hotelBookings.slice(0, 6).map((booking) => (
                <div key={booking.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">
                  <p className="text-sm font-semibold text-white">{booking.hotel_id || 'Hotel stay'}</p>
                  <p className="mt-1 text-xs text-slate-400">Check-in {new Date(booking.start_date).toLocaleDateString()} · Check-out {new Date(booking.end_date).toLocaleDateString()}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                    <span>Guests: {booking.guests}</span>
                    <span className={`rounded-full border px-3 py-1 uppercase tracking-[0.24em] ${statusTone(booking.status)}`}>{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Tour management</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Tour bookings</h2>
            <div className="mt-6 space-y-3">
              {tourBookings.slice(0, 6).map((booking) => (
                <div key={booking.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">
                  <p className="text-sm font-semibold text-white">{booking.tour_id || 'Tour package'}</p>
                  <p className="mt-1 text-xs text-slate-400">Customer booking reference: {booking.user_id}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                    <span>{booking.guests} guests</span>
                    <span className={`rounded-full border px-3 py-1 uppercase tracking-[0.24em] ${statusTone(booking.status)}`}>{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Cargo management</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Cargo requests</h2>
            <div className="mt-6 space-y-3">
              {cargoOrders.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">
                  <p className="text-sm font-semibold text-white">{item.service_type}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.origin} → {item.destination} · {item.transport_mode}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                    <span>Tracking: {item.id.slice(0, 8).toUpperCase()}</span>
                    <span className={`rounded-full border px-3 py-1 uppercase tracking-[0.24em] ${statusTone(item.status)}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6 xl:col-span-2">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Tracking system</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Live booking tracking</h2>
                <p className="mt-2 text-sm text-slate-300">Generate booking references, update status history and monitor real-time tracking records from the admin workspace.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={syncTrackingRecords} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100 hover:bg-amber-400/20">Generate references</button>
                <label className="text-sm text-slate-200">
                  <span className="sr-only">Search tracking</span>
                  <input value={trackingSearch} onChange={(event) => setTrackingSearch(event.target.value)} placeholder="Search tracking records" className="w-full min-w-[280px] rounded-full border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" />
                </label>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {filteredTracking.map((record) => (
                <article key={record.id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{record.reference_number}</p>
                      <p className="text-xs text-slate-400">{record.booking_type.toUpperCase()} · {record.customer_name || 'Customer record'}</p>
                      <p className="mt-2 text-xs text-slate-300">{record.destination || 'Booking route not provided'}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${statusTone(record.current_status)}`}>{record.current_status}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {['pending', 'confirmed', 'completed', 'delivered', 'approved'].map((status) => (
                      <button key={`${record.id}-${status}`} type="button" onClick={() => updateTrackingStatus(record.id, status)} className="rounded-full border border-white/10 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 hover:border-amber-400 hover:bg-slate-800">{status}</button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6 xl:col-span-2">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Payment analytics</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Transactions & refund control</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {[
                { label: 'Completed', value: stats.completedPayments, accent: 'text-emerald-200' },
                { label: 'Pending', value: stats.pendingPayments, accent: 'text-amber-200' },
                { label: 'Failed', value: stats.failedPayments, accent: 'text-rose-200' },
                { label: 'Refunded', value: stats.refundedPayments, accent: 'text-violet-200' },
              ].map((item) => (
                <article key={item.label} className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
                  <p className={`mt-4 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {payments.slice(0, 8).map((payment) => (
                <article key={payment.id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{payment.transaction_reference || payment.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-slate-400">{payment.payment_method || 'Gateway'} · {payment.customer_email || 'Customer email unavailable'}</p>
                      <p className="mt-2 text-xs text-slate-300">Amount {formatCurrency(Number(payment.amount || 0))}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {payment.status !== 'refunded' && <button type="button" onClick={() => refundPayment(payment.id)} className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-100">Refund</button>}
                      <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${statusTone(payment.status)}`}>{payment.status}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6 xl:col-span-2">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">WhatsApp communication</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Manage number, templates & inbound inquiries</h2>
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                <label className="block space-y-2 text-sm text-slate-200">
                  <span>WhatsApp number</span>
                  <input value={whatsappSettings.number} onChange={(event) => setWhatsappSettings((current) => ({ ...current, number: event.target.value }))} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="+254722231116" />
                </label>
                <div className="mt-4 space-y-3">
                  {Object.entries(whatsappSettings.templates).map(([key, value]) => (
                    <label key={key} className="block space-y-2 text-sm text-slate-200">
                      <span className="capitalize">{key} inquiry</span>
                      <textarea value={value} onChange={(event) => setWhatsappSettings((current) => ({ ...current, templates: { ...current.templates, [key]: event.target.value } }))} rows={2} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" />
                    </label>
                  ))}
                </div>
                <button type="button" onClick={handleSaveWhatsAppSettings} className="mt-5 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300">Save WhatsApp settings</button>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Inquiry tracking</p>
                <div className="mt-4 space-y-3">
                  {inquiryLog.map((entry) => (
                    <article key={entry.id} className="rounded-[1.25rem] border border-white/10 bg-slate-900/90 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{entry.service}</p>
                          <p className="text-xs text-slate-400">{entry.id} · {entry.time}</p>
                        </div>
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-100">{entry.status}</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-200">{entry.message}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6 xl:col-span-2">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Visa management</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Visa applications</h2>
            <div className="mt-6 space-y-3">
              {visaApplications.slice(0, 8).map((item) => {
                const docs = visaDocuments.filter((doc) => doc.visa_application_id === item.id)
                return (
                  <div key={item.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.applicant_name || 'Visa applicant'}</p>
                        <p className="text-xs text-slate-400">Passport: {item.passport_number || 'Pending'} · Destination: {item.destination_country || item.country || 'N/A'}</p>
                        <p className="text-xs text-slate-400">Email: {item.email || 'No email'} · Docs: {docs.length}</p>
                        {item.notes && <p className="mt-2 text-xs text-slate-300">Note: {item.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => reviewVisaApplication(item.id, 'approved', item.notes || 'Approved by admin. Please download your approval documents from the customer portal.') } className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">Approve</button>
                        <button type="button" onClick={() => reviewVisaApplication(item.id, 'rejected', item.notes || 'Rejected by admin. Please upload any missing documents or contact support.') } className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-100">Reject</button>
                        <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${getVisaStatusTone(item.status)}`}>{getVisaStatusLabel(item.status)}</span>
                      </div>
                    </div>
                    {docs.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {docs.map((doc) => (
                          <a key={doc.id} href={doc.file_url || '#'} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-slate-900/90 px-3 py-2 text-xs text-slate-100 hover:border-amber-400">{doc.document_type || 'Document'}</a>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </article>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Pricing rules</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Flight pricing markup</h2>
            <p className="mt-3 text-sm text-slate-300">Configure global, airline, and route pricing rules. These are applied live to the flight search experience.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span>Global markup type</span>
                <select value={markupSettings.global.type} onChange={(event) => updateMarkupSetting({ global: { ...markupSettings.global, type: event.target.value as MarkupType } })} className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed amount</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Global markup value</span>
                <input type="number" min="0" value={markupSettings.global.value} onChange={(event) => updateMarkupSetting({ global: { ...markupSettings.global, value: Number(event.target.value || 0) } })} className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" />
              </label>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-4 text-sm text-slate-200">
              <input aria-label="Enable global flight pricing markup" type="checkbox" checked={markupSettings.global.enabled} onChange={(event) => updateMarkupSetting({ global: { ...markupSettings.global, enabled: event.target.checked } })} className="h-5 w-5 rounded border-white/10 bg-slate-900 text-amber-400 focus:ring-amber-400" />
              <span>Enable global markup for all flight results</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={handleSaveMarkup} disabled={savingMarkup} className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70">{savingMarkup ? 'Saving…' : 'Save pricing rules'}</button>
              <button type="button" onClick={addAirlineRule} className="rounded-full border border-white/10 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 hover:border-amber-400">Add airline rule</button>
              <button type="button" onClick={addRouteRule} className="rounded-full border border-white/10 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 hover:border-amber-400">Add route rule</button>
            </div>
            {markupMessage && <p className="mt-4 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">{markupMessage}</p>}
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Profit reporting</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Live margin summary</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Base vs selling value</p>
                <p className="mt-3 text-xl font-semibold text-white">Base {formatCurrency(pricingSummary.totalApiPrice)} → Selling {formatCurrency(pricingSummary.totalSellingPrice)}</p>
                <p className="mt-2 text-sm text-slate-300">The pricing engine uses the latest search results to calculate the customer-facing selling price.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Estimated profit</p>
                <p className="mt-3 text-3xl font-semibold text-emerald-200">{formatCurrency(pricingSummary.totalProfit)}</p>
                <p className="mt-2 text-sm text-slate-300">Managed from the active pricing rules and the last flight search results in the system.</p>
              </div>
            </div>
          </article>
        </div>

        {loading && <p className="text-slate-300">Refreshing admin data…</p>}
        {error && <p className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</p>}
      </div>
    </section>
  )
}

export default Dashboard
