import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Tour } from '../lib/types'

function Tours() {
  const [searchParams] = useSearchParams()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTours() {
      setLoading(true)
      const destination = searchParams.get('destination')?.toLowerCase()
      let query = supabase.from('tours').select('*').eq('is_active', true).order('created_at', { ascending: false })
      if (destination) {
        query = query.ilike('destination', `%${destination}%`)
      }
      const { data, error } = await query
      if (!error && data) {
        setTours(data)
      }
      setLoading(false)
    }

    loadTours()
  }, [searchParams])

  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.12)]">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Tour Packages</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Curated holiday experiences</h1>
        <p className="mt-4 max-w-2xl text-slate-600">Choose from premium tour packages designed for culture, luxury and unforgettable adventure.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-700 bg-slate-950/95 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-white">Find your ideal package</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">Search by destination to discover tours tailored to your travel style.</p>
          <form className="mt-8 flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              name="destination"
              placeholder="Search destinations"
              className="w-full rounded-[1.5rem] border border-slate-700 bg-slate-950/95 px-4 py-3 text-sm text-slate-100 shadow-sm focus:border-slate-400 focus:outline-none"
            />
            <button className="btn-primary rounded-[1.5rem] px-6 py-3 text-sm">Search tours</button>
          </form>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950/95 p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Featured services</p>
          <div className="mt-6 grid gap-4">
            {[
              'Personalised travel planning',
              'Luxury hotel access',
              'Visa and cargo support',
              '24/7 concierge service',
            ].map((item) => (
              <div key={item} className="rounded-[1.75rem] bg-slate-50 p-5">
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading tour packages…</p>
      ) : tours.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tours.map((tour) => (
            <Link
              key={tour.id}
              to={`/tour/${tour.id}`}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950/95 shadow-[0_25px_55px_-40px_rgba(15,23,42,0.14)] transition hover:-translate-y-1 hover:shadow-[0_35px_90px_-45px_rgba(15,23,42,0.18)]"
            >
              <div className="relative h-72 overflow-hidden bg-slate-100">
                {tour.image_url ? (
                  <img src={tour.image_url} alt={tour.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : null}
              </div>
              <div className="p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-amber-500">{tour.destination}</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{tour.name}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 line-clamp-3">{tour.description}</p>
                <div className="mt-6 space-y-2 text-sm text-slate-600">
                  <p>Duration: {tour.duration_days} days</p>
                  <p>Destination: {tour.destination}</p>
                  <p>Highlights: {tour.highlights?.join(' • ') || 'Tailored itinerary, premium stays, and expert guidance'}</p>
                  <p>Services Included: Hotel access, transfers, visa support, and concierge planning</p>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-amber-600">Contact us for personalized pricing</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-slate-600">No tour packages available.</p>
      )}
    </section>
  )
}

export default Tours
