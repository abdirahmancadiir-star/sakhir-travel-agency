import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchFlights, type FlightOffer } from '../lib/flightApi'

const suggestedRoutes = [
  { origin: 'NBO', destination: 'DXB', label: 'Nairobi → Dubai' },
  { origin: 'DWC', destination: 'IST', label: 'Dubai → Istanbul' },
  { origin: 'NBO', destination: 'JED', label: 'Nairobi → Jeddah' },
  { origin: 'EBB', destination: 'DXB', label: 'Kampala → Dubai' },
]

const airlines = ['Qatar Airways', 'Turkish Airlines', 'Emirates', 'Ethiopian Airlines', 'Saudi Airlines', 'FlyDubai', 'EgyptAir', 'Kenya Airways']

function Flights() {
  const navigate = useNavigate()
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('roundtrip')
  const [origin, setOrigin] = useState('NBO')
  const [destination, setDestination] = useState('DXB')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [results, setResults] = useState<FlightOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    if (!origin || !destination || !departureDate) {
      setError('Please enter an origin, destination and departure date.')
      setLoading(false)
      return
    }

    try {
      const offers = await searchFlights({
        origin,
        destination,
        departureDate,
        returnDate: tripType === 'roundtrip' ? returnDate : undefined,
        adults: passengers,
        tripType,
      })
      setResults(offers)
    } catch (err) {
      setError('Unable to fetch flight results. Please check your API settings.')
      setResults([])
    }

    setLoading(false)
  }

  return (
    <div className="space-y-10">
      <section className="brand-shell p-10 backdrop-blur-xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Global flight search</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Search flights and request tailored quotations for worldwide routes.</h1>
            <p className="mt-5 max-w-2xl text-slate-300">Share your itinerary details and let our travel team prepare the right flight options, departure information, and personalized guidance for your journey.</p>
          </div>
          <div className="brand-card p-8">
            <div className="mb-6 brand-card p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Top global carriers</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {airlines.map((name) => (
                  <div key={name} className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-200">
                    {name}
                  </div>
                ))}
              </div>
            </div>
            <div className="brand-card p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Suggested routes</p>
              <div className="mt-5 space-y-3">
                {suggestedRoutes.map((route) => (
                  <button
                    key={route.label}
                    type="button"
                    onClick={() => {
                      setOrigin(route.origin)
                      setDestination(route.destination)
                    }}
                    className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-amber-400 hover:bg-slate-900"
                  >
                    {route.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="brand-shell p-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="brand-card p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              {['oneway', 'roundtrip', 'multicity'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTripType(type as 'oneway' | 'roundtrip' | 'multicity')}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${tripType === type ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <label className="space-y-2 text-sm text-slate-700">
              <span>Origin airport</span>
              <input
                value={origin}
                onChange={(event) => setOrigin(event.target.value.toUpperCase())}
                placeholder="NBO"
                className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Destination airport</span>
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value.toUpperCase())}
                placeholder="DXB"
                className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Departure date</span>
              <input
                type="date"
                value={departureDate}
                onChange={(event) => setDepartureDate(event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Passengers</span>
              <input
                type="number"
                min={1}
                value={passengers}
                onChange={(event) => setPassengers(Number(event.target.value))}
                className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"
              />
            </label>
          </div>

          {tripType === 'roundtrip' && (
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span>Return date</span>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(event) => setReturnDate(event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"
                />
              </label>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">Search flights, compare fares and choose the best schedule for your journey.</p>
            <button type="submit" className="brand-button px-8 py-3 text-sm font-semibold">
              {loading ? 'Submitting request…' : 'Submit Request'}
            </button>
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </form>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-6 brand-shell p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Why our flight search</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Compare global airlines in a single booking experience</h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />Real-time flight offers from premium carriers.</li>
            <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />Departure and arrival times, connections, and fare classes.</li>
            <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />Easy booking flow with tailored travel classes and passenger counts.</li>
            <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />Secure checkout support for your agency customers.</li>
          </ul>
        </div>
        <div className="grid gap-6">
          {airlines.map((airline) => (
            <div key={airline} className="brand-card p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Airline</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{airline}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Results</p>
            <h2 className="text-3xl font-semibold text-white">Available flights</h2>
          </div>
          <p className="text-sm text-slate-300">Selected route: {origin} → {destination}</p>
        </div>

        <div className="grid gap-6">
          {results.length === 0 && !loading ? (
            <div className="rounded-[2rem] border border-dashed border-white/20 bg-slate-950/90 p-10 text-center text-slate-300">Submit your route details and our team will prepare the best flight options and custom pricing for you.</div>
          ) : (
            results.map((offer) => (
              <div key={offer.id} className="brand-shell p-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                      <span className="inline-flex h-9 items-center justify-center rounded-full bg-slate-900/80 px-4 text-slate-200">{offer.airlineCode}</span>
                      <span>{offer.airline}</span>
                      <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">{offer.cabin}</span>
                      <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">{offer.stops} stop(s)</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-slate-400">Departure</p>
                        <p className="mt-2 text-lg font-semibold text-white">{offer.departureTime}</p>
                        <p className="text-sm text-slate-400">{offer.departAirport}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Arrival</p>
                        <p className="mt-2 text-lg font-semibold text-white">{offer.arrivalTime}</p>
                        <p className="text-sm text-slate-400">{offer.arriveAirport}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-between gap-4 text-right sm:items-end">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pricing</p>
                      <p className="mt-2 text-2xl font-semibold text-white">Custom quote available</p>
                      <p className="mt-2 text-sm text-slate-300">Share your route and passenger details with our team for a personalized fare consultation.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/contact')}
                      className="brand-button px-6 py-3 text-sm font-semibold"
                    >
                      Speak With an Agent
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default Flights
