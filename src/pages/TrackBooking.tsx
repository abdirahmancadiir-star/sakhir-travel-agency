import { type FormEvent, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const statusMap: Record<string, string[]> = {
  flight: ['Pending', 'Confirmed', 'Ticket Issued', 'Completed', 'Cancelled'],
  hotel: ['Pending', 'Confirmed', 'Checked In', 'Completed', 'Cancelled'],
  cargo: ['Received', 'Processing', 'In Transit', 'Arrived', 'Delivered'],
  tour: ['Pending', 'Confirmed', 'Checked In', 'Completed', 'Cancelled'],
  visa: ['Submitted', 'Under Review', 'Processing', 'Approved', 'Rejected'],
}

function statusProgress(status: string, type: string) {
  const steps = statusMap[type] ?? statusMap.flight
  const index = steps.findIndex((item) => item.toLowerCase() === String(status || '').toLowerCase())
  return index >= 0 ? ((index + 1) / steps.length) * 100 : 0
}

function TrackBooking() {
  const [reference, setReference] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    const ref = reference.trim().toUpperCase()
    if (!ref) {
      setError('Enter a booking reference number to continue.')
      setLoading(false)
      return
    }

    const { data, error: queryError } = await supabase
      .from('tracking_records')
      .select('*, tracking_events(*)')
      .eq('reference_number', ref)
      .maybeSingle()

    if (queryError || !data) {
      setError('No tracking record matches that reference number. Please confirm the reference or contact support.')
      setLoading(false)
      return
    }

    if (email.trim() && data.customer_email && data.customer_email.toLowerCase() !== email.trim().toLowerCase()) {
      setError('The email address does not match the tracking record. Please verify the booking email and try again.')
      setLoading(false)
      return
    }

    setResult(data)
    setLoading(false)
  }

  const timeline = useMemo(() => {
    const type = result?.booking_type || 'flight'
    return statusMap[type] ?? statusMap.flight
  }, [result])

  return (
    <section className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Track booking</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Monitor flights, hotels, tours, cargo and visa progress in real time.</h1>
            <p className="mt-5 max-w-2xl text-slate-300">Use your booking reference number and email to view the latest status, progress timeline and booking details for your travel or cargo request.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/85 p-6 text-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">How it works</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Search with your booking reference number.</li>
              <li>• Confirm the email address on the booking.</li>
              <li>• View live updates and the full status timeline.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleSearch} className="rounded-[2rem] border border-white/10 bg-slate-900/85 p-6 shadow-sm">
            <label className="block space-y-2 text-sm text-slate-200">
              <span>Booking reference number</span>
              <input
                value={reference}
                onChange={(event) => setReference(event.target.value.toUpperCase())}
                placeholder="TRK-ABC123"
                className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"
              />
            </label>
            <label className="mt-4 block space-y-2 text-sm text-slate-200">
              <span>Email address</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="customer@example.com"
                className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"
              />
            </label>
            <button type="submit" disabled={loading} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? 'Searching…' : 'Track booking'}
            </button>
            {error && <p className="mt-4 rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</p>}
          </form>

          <article className="rounded-[2rem] border border-white/10 bg-slate-900/85 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Tracking result</p>
            {!result ? (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/90 p-8 text-slate-300">Enter a booking reference to view shipment, visa or booking progress.</div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Reference</p>
                      <p className="mt-2 text-xl font-semibold text-white">{result.reference_number}</p>
                    </div>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs uppercase tracking-[0.24em] text-emerald-100">{result.booking_type}</span>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Customer</p>
                      <p className="mt-2 text-base text-slate-100">{result.customer_name || 'Customer details unavailable'}</p>
                      <p className="text-sm text-slate-300">{result.customer_email || 'No email on file'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Status</p>
                      <p className="mt-2 text-base text-slate-100">{result.current_status}</p>
                      <p className="text-sm text-slate-300">Updated {new Date(result.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Booking details</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-slate-200">
                    <div><span className="text-slate-400">Route / destination:</span> {result.destination || 'Not provided'}</div>
                    <div><span className="text-slate-400">Summary:</span> {result.summary || 'Booking summary not provided'}</div>
                    <div><span className="text-slate-400">Notes:</span> {result.notes || 'No additional notes.'}</div>
                    <div><span className="text-slate-400">Created:</span> {new Date(result.created_at).toLocaleString()}</div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Status timeline</p>
                  <div className="mt-5 space-y-4">
                    {timeline.map((step, index) => {
                      const isActive = step.toLowerCase() === String(result.current_status || '').toLowerCase()
                      const isCompleted = index < timeline.findIndex((item) => item.toLowerCase() === String(result.current_status || '').toLowerCase())
                      return (
                        <div key={step} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <span className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${isActive ? 'border-amber-400 bg-amber-400/10 text-amber-100' : isCompleted ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100' : 'border-white/10 bg-slate-900 text-slate-300'}`}>
                              {index + 1}
                            </span>
                            {index < timeline.length - 1 && <span className="mt-2 h-full w-px bg-white/10" />}
                          </div>
                          <div className="flex-1 rounded-[1.25rem] border border-white/10 bg-slate-900/90 p-4">
                            <p className="text-sm font-semibold text-white">{step}</p>
                            <p className="mt-1 text-xs text-slate-400">{isActive ? 'Current stage' : isCompleted ? 'Completed stage' : 'Upcoming stage'}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-5 rounded-[1.25rem] border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
                    <p className="font-semibold">Progress</p>
                    <p className="mt-2 text-amber-100">{Math.round(statusProgress(result.current_status, result.booking_type))}% complete</p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">History</p>
                  {(result.tracking_events || []).length === 0 ? (
                    <p className="mt-4 text-sm text-slate-300">No history updates are available yet for this record.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {(result.tracking_events || []).slice().sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((event: any) => (
                        <article key={event.id} className="rounded-[1.25rem] border border-white/10 bg-slate-900/90 p-4 text-sm text-slate-200">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-white">{event.status}</p>
                              <p className="text-xs text-slate-400">{new Date(event.created_at).toLocaleString()}</p>
                            </div>
                            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-amber-100">Update</span>
                          </div>
                          {event.note && <p className="mt-3 text-slate-300">{event.note}</p>}
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </article>
        </div>
      </article>
    </section>
  )
}

export default TrackBooking
