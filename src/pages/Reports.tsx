import { useEffect, useMemo, useState } from 'react'
import jsPDF from 'jspdf'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function getBarWidthClass(value: number, max: number) {
  if (max <= 0) return 'w-1/12'

  const ratio = Math.round((value / max) * 100)
  if (ratio >= 90) return 'w-full'
  if (ratio >= 75) return 'w-3/4'
  if (ratio >= 60) return 'w-2/3'
  if (ratio >= 45) return 'w-1/2'
  if (ratio >= 30) return 'w-1/3'
  if (ratio >= 15) return 'w-1/4'
  return 'w-1/6'
}

function Reports() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalPayments: 0,
    totalVisaApplications: 0,
    totalCargoRequests: 0,
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    revenueByService: [] as Array<{ label: string; revenue: number; profit: number }>,
    paymentMethodStats: [] as Array<{ label: string; value: number }>,
    destinationStats: [] as Array<{ label: string; value: number }>,
    airlineStats: [] as Array<{ label: string; value: number }>,
    hotelStats: [] as Array<{ label: string; value: number }>,
    tourStats: [] as Array<{ label: string; value: number }>,
    newUsers: 0,
    activeUsers: 0,
    returningCustomers: 0,
  })

  useEffect(() => {
    async function loadAnalytics() {
      if (!user || user.role !== 'admin') {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      const [profilesResult, bookingsResult, flightBookingsResult, cargoResult, visaResult, paymentsResult] = await Promise.all([
        supabase.from('profiles').select('id, created_at').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('flight_bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('cargo_orders').select('*').order('created_at', { ascending: false }),
        supabase.from('visa_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
      ])

      if (profilesResult.error || bookingsResult.error || flightBookingsResult.error || cargoResult.error || visaResult.error || paymentsResult.error) {
        setError('Unable to load analytics data from the database.')
        setLoading(false)
        return
      }

      const profiles = profilesResult.data ?? []
      const bookingRows = bookingsResult.data ?? []
      const flightRows = flightBookingsResult.data ?? []
      const cargoRows = cargoResult.data ?? []
      const visaRows = visaResult.data ?? []
      const paymentRows = paymentsResult.data ?? []

      const completedPayments = paymentRows.filter((entry: any) => entry.status === 'completed')
      const totalRevenue = completedPayments.reduce((sum: number, entry: any) => sum + Number(entry.amount || 0), 0)
      const totalProfit = totalRevenue * 0.18
      const now = new Date()
      const dayStart = new Date(now)
      dayStart.setHours(0, 0, 0, 0)
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - 7)
      const monthStart = new Date(now)
      monthStart.setMonth(now.getMonth() - 1)
      const yearStart = new Date(now)
      yearStart.setFullYear(now.getFullYear() - 1)

      const sumForRange = (from: Date) => completedPayments
        .filter((entry: any) => new Date(entry.created_at || entry.updated_at || 0) >= from)
        .reduce((sum: number, entry: any) => sum + Number(entry.amount || 0), 0)

      const destinationMap = new Map<string, number>()
      bookingRows.forEach((entry: any) => {
        const destination = entry.cargo_destination || entry.flight_route || entry.destination_country || 'Unspecified'
        destinationMap.set(destination, (destinationMap.get(destination) || 0) + 1)
      })
      flightRows.forEach((entry: any) => {
        const destination = `${entry.origin || 'Unknown'} → ${entry.destination || 'Unknown'}`
        destinationMap.set(destination, (destinationMap.get(destination) || 0) + 1)
      })

      const airlineMap = new Map<string, number>()
      flightRows.forEach((entry: any) => {
        const airline = entry.airline || entry.airline_name || 'Other airlines'
        airlineMap.set(airline, (airlineMap.get(airline) || 0) + 1)
      })

      const hotelMap = new Map<string, number>()
      bookingRows.filter((entry: any) => entry.booking_type === 'hotel').forEach((entry: any) => {
        const hotel = entry.hotel_id || entry.hotel_name || 'Featured hotels'
        hotelMap.set(hotel, (hotelMap.get(hotel) || 0) + 1)
      })

      const tourMap = new Map<string, number>()
      bookingRows.filter((entry: any) => entry.booking_type === 'tour').forEach((entry: any) => {
        const tour = entry.tour_id || entry.tour_name || 'Signature tours'
        tourMap.set(tour, (tourMap.get(tour) || 0) + 1)
      })

      const serviceRevenue = [
        { label: 'Flights', revenue: flightRows.reduce((sum: number, entry: any) => sum + Number(entry.total_price || 0), 0), profit: flightRows.reduce((sum: number, entry: any) => sum + Number(entry.total_price || 0), 0) * 0.18 },
        { label: 'Hotels', revenue: bookingRows.filter((entry: any) => entry.booking_type === 'hotel').reduce((sum: number, entry: any) => sum + Number(entry.total_price || 0), 0), profit: bookingRows.filter((entry: any) => entry.booking_type === 'hotel').reduce((sum: number, entry: any) => sum + Number(entry.total_price || 0), 0) * 0.18 },
        { label: 'Tours', revenue: bookingRows.filter((entry: any) => entry.booking_type === 'tour').reduce((sum: number, entry: any) => sum + Number(entry.total_price || 0), 0), profit: bookingRows.filter((entry: any) => entry.booking_type === 'tour').reduce((sum: number, entry: any) => sum + Number(entry.total_price || 0), 0) * 0.18 },
        { label: 'Cargo', revenue: cargoRows.reduce((sum: number, entry: any) => sum + Number(entry.estimated_cost || entry.total_price || 0), 0), profit: cargoRows.reduce((sum: number, entry: any) => sum + Number(entry.estimated_cost || entry.total_price || 0), 0) * 0.17 },
        { label: 'Visa', revenue: visaRows.reduce((sum: number, entry: any) => sum + Number(entry.service_fee || entry.total_amount || 0), 0), profit: visaRows.reduce((sum: number, entry: any) => sum + Number(entry.service_fee || entry.total_amount || 0), 0) * 0.15 },
      ]

      const paymentMethodStats = Array.from(
        paymentRows.reduce((map: Map<string, number>, entry: any) => {
          const key = entry.payment_method || 'Other'
          map.set(key, (map.get(key) || 0) + 1)
          return map
        }, new Map()).entries(),
      ).map(([label, value]) => ({ label, value }))

      const newUsers = profiles.filter((entry: any) => new Date(entry.created_at) >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())).length
      const activeUsers = profiles.filter((entry: any) => new Date(entry.created_at) >= weekStart).length
      const returningCustomers = new Set([
        ...bookingRows.map((entry: any) => entry.user_id).filter(Boolean),
        ...paymentRows.map((entry: any) => entry.user_id).filter(Boolean),
      ]).size

      setAnalytics({
        totalRevenue,
        totalProfit,
        totalBookings: bookingRows.length + flightRows.length,
        totalUsers: profiles.length,
        totalPayments: paymentRows.length,
        totalVisaApplications: visaRows.length,
        totalCargoRequests: cargoRows.length,
        dailyRevenue: sumForRange(dayStart),
        weeklyRevenue: sumForRange(weekStart),
        monthlyRevenue: sumForRange(monthStart),
        yearlyRevenue: sumForRange(yearStart),
        revenueByService: serviceRevenue,
        paymentMethodStats,
        destinationStats: Array.from(destinationMap.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6),
        airlineStats: Array.from(airlineMap.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6),
        hotelStats: Array.from(hotelMap.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6),
        tourStats: Array.from(tourMap.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6),
        newUsers,
        activeUsers,
        returningCustomers,
      })
      setLoading(false)
    }

    void loadAnalytics()
  }, [user])

  const revenueChart = useMemo(() => {
    const labels = ['Daily', 'Weekly', 'Monthly', 'Yearly']
    const values = [analytics.dailyRevenue, analytics.weeklyRevenue, analytics.monthlyRevenue, analytics.yearlyRevenue]
    const max = Math.max(...values, 1)
    return labels.map((label, index) => ({ label, value: values[index], widthClass: getBarWidthClass(values[index], max) }))
  }, [analytics])

  const bookingChart = useMemo(() => {
    const groups = [
      { label: 'Flights', value: analytics.totalBookings },
      { label: 'Hotels', value: analytics.hotelStats.reduce((sum, item) => sum + item.value, 0) },
      { label: 'Tours', value: analytics.tourStats.reduce((sum, item) => sum + item.value, 0) },
      { label: 'Cargo', value: analytics.totalCargoRequests },
      { label: 'Visa', value: analytics.totalVisaApplications },
    ]
    const max = Math.max(...groups.map((item) => item.value), 1)
    return groups.map((item) => ({ ...item, widthClass: getBarWidthClass(item.value, max) }))
  }, [analytics])

  const exportCsv = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Revenue', analytics.totalRevenue],
      ['Total Profit', analytics.totalProfit],
      ['Total Bookings', analytics.totalBookings],
      ['Total Users', analytics.totalUsers],
      ['Total Payments', analytics.totalPayments],
      ['Total Visa Applications', analytics.totalVisaApplications],
      ['Total Cargo Requests', analytics.totalCargoRequests],
      ['Daily Revenue', analytics.dailyRevenue],
      ['Weekly Revenue', analytics.weeklyRevenue],
      ['Monthly Revenue', analytics.monthlyRevenue],
      ['Yearly Revenue', analytics.yearlyRevenue],
    ]

    const csv = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sakhir-reports.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportExcel = () => {
    exportCsv()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob(['\ufeff' + 'Sakhir Reports\n' + 'Generated at ' + new Date().toLocaleString()], { type: 'application/vnd.ms-excel;charset=utf-8;' }))
    link.download = 'sakhir-reports.xls'
    link.click()
  }

  const exportPdf = () => {
    const doc = new jsPDF()
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('Sakhir Travel & Cargo Analytics', 14, 18)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28)
    doc.text(`Revenue: ${formatCurrency(analytics.totalRevenue)}`, 14, 40)
    doc.text(`Profit: ${formatCurrency(analytics.totalProfit)}`, 14, 48)
    doc.text(`Bookings: ${analytics.totalBookings}`, 14, 56)
    doc.text(`Users: ${analytics.totalUsers}`, 14, 64)
    doc.text(`Payments: ${analytics.totalPayments}`, 14, 72)
    doc.save('sakhir-reports.pdf')
  }

  if (!user || user.role !== 'admin') {
    return (
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.18)]">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-300">Restricted access</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Reports & analytics</h1>
        <p className="mt-4 max-w-2xl text-slate-300">Only administrators can view the complete revenue, customer, booking, and performance analytics workspace.</p>
      </section>
    )
  }

  return (
    <section className="space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Reports & analytics</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Complete business insights dashboard</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Monitor revenue, profit, bookings, customer health, and financial performance in one secure admin view with export-ready reporting.</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={exportCsv} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-400/20">Export CSV</button>
          <button type="button" onClick={exportExcel} className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/20">Export Excel</button>
          <button type="button" onClick={exportPdf} className="rounded-full border border-sky-400/30 bg-sky-400/10 px-5 py-3 text-sm font-semibold text-sky-100 hover:bg-sky-400/20">Export PDF</button>
        </div>
      </article>

      {loading ? <p className="text-slate-300">Loading analytics…</p> : error ? <p className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</p> : (
        <>
          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {[
              ['Total Revenue', formatCurrency(analytics.totalRevenue), 'text-amber-200'],
              ['Total Profit', formatCurrency(analytics.totalProfit), 'text-emerald-200'],
              ['Total Bookings', analytics.totalBookings.toLocaleString(), 'text-sky-200'],
              ['Total Users', analytics.totalUsers.toLocaleString(), 'text-violet-200'],
              ['Total Payments', analytics.totalPayments.toLocaleString(), 'text-cyan-200'],
              ['Total Visa Applications', analytics.totalVisaApplications.toLocaleString(), 'text-rose-200'],
              ['Total Cargo Requests', analytics.totalCargoRequests.toLocaleString(), 'text-amber-100'],
              ['Returning Customers', analytics.returningCustomers.toLocaleString(), 'text-emerald-100'],
            ].map(([label, value, tone]) => (
              <article key={label as string} className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{label as string}</p>
                <p className={`mt-4 text-3xl font-semibold ${tone as string}`}>{value as string}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Revenue reports</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Daily, weekly, monthly, yearly revenue</h2>
              <div className="mt-6 space-y-4">
                {[
                  ['Daily Revenue', analytics.dailyRevenue],
                  ['Weekly Revenue', analytics.weeklyRevenue],
                  ['Monthly Revenue', analytics.monthlyRevenue],
                  ['Yearly Revenue', analytics.yearlyRevenue],
                ].map(([label, amount]) => (
                  <div key={label as string} className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                    <div className="flex items-center justify-between gap-3 text-slate-200">
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{label as string}</p>
                      <strong className="text-amber-100">{formatCurrency(amount as number)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Revenue trends</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Revenue performance</h2>
              <div className="mt-6 space-y-4">
                {revenueChart.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span>{item.label}</span>
                      <strong>{formatCurrency(item.value)}</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className={`h-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 ${item.widthClass}`} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Booking trends</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Service activity</h2>
              <div className="mt-6 space-y-4">
                {bookingChart.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className={`h-2 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 ${item.widthClass}`} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Customer growth</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">New, active, returning</h2>
              <div className="mt-6 space-y-4">
                {[
                  ['New Users', analytics.newUsers, 'text-amber-100'],
                  ['Active Users', analytics.activeUsers, 'text-emerald-100'],
                  ['Returning Customers', analytics.returningCustomers, 'text-sky-100'],
                ].map(([label, value, tone]) => (
                  <div key={label as string} className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{label as string}</p>
                    <p className={`mt-3 text-3xl font-semibold ${tone as string}`}>{value as number}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Revenue by service</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Service contribution</h2>
              <div className="mt-6 space-y-3">
                {analytics.revenueByService.map((item) => (
                  <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm text-slate-200">
                      <span>{item.label}</span>
                      <strong className="text-amber-100">{formatCurrency(item.revenue)}</strong>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Profit estimate: {formatCurrency(item.profit)}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Payment method statistics</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Channel share</h2>
              <div className="mt-6 space-y-3">
                {analytics.paymentMethodStats.map((item) => (
                  <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm text-slate-200">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Most popular destinations</p>
              <div className="mt-6 space-y-3">{analytics.destinationStats.map((item) => <p key={item.label} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4 text-sm text-slate-100">{item.label} · {item.value} bookings</p>)}</div>
            </article>
            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Most booked airlines</p>
              <div className="mt-6 space-y-3">{analytics.airlineStats.map((item) => <p key={item.label} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4 text-sm text-slate-100">{item.label} · {item.value} bookings</p>)}</div>
            </article>
            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Most booked hotels & tours</p>
              <div className="mt-6 space-y-3">{analytics.hotelStats.map((item) => <p key={item.label} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4 text-sm text-slate-100">Hotel: {item.label} · {item.value}</p>)}{analytics.tourStats.map((item) => <p key={`tour-${item.label}`} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4 text-sm text-slate-100">Tour: {item.label} · {item.value}</p>)}</div>
            </article>
          </div>
        </>
      )}
    </section>
  )
}

export default Reports
