import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Tour } from '../lib/types'

function TourDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    async function loadTour() {
      if (!id) {
        return
      }
      setLoading(true)
      const { data, error } = await supabase.from('tours').select('*').eq('id', id).single()
      if (!error) {
        setTour(data)
      }
      setLoading(false)
    }
    loadTour()
  }, [id])

  const handleQuoteRequest = () => {
    navigate('/contact')
  }

  if (loading) {
    return <p className="text-slate-600">Loading tour…</p>
  }
  if (!tour) {
    return <p className="text-slate-600">Tour not found.</p>
  }

  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.12)]">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Tour details</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">{tour.name}</h1>
        <p className="mt-4 text-slate-600">{tour.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-[2rem] bg-slate-950/95 p-8 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[1.75rem] bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Destination</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{tour.destination}</p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Duration</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{tour.duration_days} days</p>
            </div>
          </div>
          <div className="mt-5 rounded-[1.75rem] bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Highlights</p>
            <ul className="mt-4 space-y-3 text-slate-600">
              {tour.highlights?.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="rounded-[2rem] bg-slate-950/95 p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pricing</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">Personalized package available</p>
          <p className="mt-3 text-sm text-slate-600">Tell us your travel dates, group size and preferences and our team will prepare the best options for you.</p>
          <button onClick={handleQuoteRequest} type="button" className="mt-8 btn-primary w-full">
            Request Quote
          </button>
          {status && <div className="mt-5 rounded-3xl bg-[#E8F5FF] p-4 text-sm text-[#0F4C81]">{status}</div>}
        </aside>
      </div>
    </section>
  )
}

export default TourDetail
