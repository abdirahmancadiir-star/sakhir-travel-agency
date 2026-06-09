const AMADEUS_CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID
const AMADEUS_CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET
const AMADEUS_AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token'
const AMADEUS_FLIGHT_SEARCH_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers'
const MARKUP_SETTINGS_KEY = 'sakhir-flight-markup-settings'
const LAST_FLIGHT_SEARCH_KEY = 'sakhir-last-flight-search'

export type MarkupType = 'fixed' | 'percentage'

export type MarkupSettings = {
  global: { enabled: boolean; type: MarkupType; value: number }
  airlineSpecific: Array<{ airlineCode: string; type: MarkupType; value: number }>
  routeSpecific: Array<{ origin: string; destination: string; type: MarkupType; value: number }>
}

type FlightSearchParams = {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults?: number
  tripType?: 'oneway' | 'roundtrip' | 'multicity'
}

export type FlightOffer = {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  departAirport: string
  arriveAirport: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  cabin: string
  price: string
  apiPrice: string
  basePrice: number
  markupAmount: number
  sellingPrice: number
  profit: number
  markupLabel: string
  refundable: boolean
}

async function getAmadeusAccessToken(): Promise<string | null> {
  if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET) {
    return null
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: AMADEUS_CLIENT_ID,
    client_secret: AMADEUS_CLIENT_SECRET,
  })

  try {
    const response = await fetch(AMADEUS_AUTH_URL, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.access_token ?? null
  } catch {
    return null
  }
}

function getDefaultMarkupSettings(): MarkupSettings {
  return {
    global: { enabled: false, type: 'percentage', value: 0 },
    airlineSpecific: [],
    routeSpecific: [],
  }
}

function readMarkupSettings(): MarkupSettings {
  if (typeof window === 'undefined') {
    return getDefaultMarkupSettings()
  }

  try {
    const raw = window.localStorage.getItem(MARKUP_SETTINGS_KEY)
    if (!raw) {
      return getDefaultMarkupSettings()
    }

    const parsed = JSON.parse(raw) as Partial<MarkupSettings>
    return {
      global: {
        enabled: Boolean(parsed.global?.enabled ?? false),
        type: parsed.global?.type === 'fixed' ? 'fixed' : 'percentage',
        value: Number(parsed.global?.value ?? 0),
      },
      airlineSpecific: Array.isArray(parsed.airlineSpecific)
        ? parsed.airlineSpecific.map((rule) => ({
            airlineCode: String(rule.airlineCode ?? '').toUpperCase(),
            type: rule.type === 'fixed' ? 'fixed' : 'percentage',
            value: Number(rule.value ?? 0),
          }))
        : [],
      routeSpecific: Array.isArray(parsed.routeSpecific)
        ? parsed.routeSpecific.map((rule) => ({
            origin: String(rule.origin ?? '').toUpperCase(),
            destination: String(rule.destination ?? '').toUpperCase(),
            type: rule.type === 'fixed' ? 'fixed' : 'percentage',
            value: Number(rule.value ?? 0),
          }))
        : [],
    }
  } catch {
    return getDefaultMarkupSettings()
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function parseCurrency(value: string | number): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  const numeric = String(value ?? '0').replace(/[^0-9.-]/g, '')
  const parsed = Number(numeric)
  return Number.isFinite(parsed) ? parsed : 0
}

function calculateMarkup(basePrice: number, airlineCode: string, origin: string, destination: string) {
  const settings = readMarkupSettings()
  const routeRule = settings.routeSpecific.find(
    (rule) => rule.origin === origin.toUpperCase() && rule.destination === destination.toUpperCase(),
  )
  const airlineRule = settings.airlineSpecific.find((rule) => rule.airlineCode === airlineCode.toUpperCase())
  const selectedRule = routeRule ?? airlineRule ?? (settings.global.enabled ? settings.global : null)

  if (!selectedRule) {
    return { amount: 0, label: 'No markup applied' }
  }

  const amount = selectedRule.type === 'fixed'
    ? Number(selectedRule.value)
    : basePrice * (Number(selectedRule.value) / 100)

  return {
    amount,
    label: selectedRule.type === 'fixed'
      ? `Fixed ${formatCurrency(Number(selectedRule.value))} markup`
      : `${Number(selectedRule.value)}% markup`,
  }
}

function withMarkupApplied(offer: Partial<FlightOffer> & { price: string | number; airlineCode?: string; departAirport?: string; arriveAirport?: string }): FlightOffer {
  const basePrice = parseCurrency(offer.price ?? 0)
  const airlineCode = String(offer.airlineCode ?? 'XX').toUpperCase()
  const origin = String(offer.departAirport ?? '').split(' ')[0].toUpperCase()
  const destination = String(offer.arriveAirport ?? '').split(' ')[0].toUpperCase()
  const markup = calculateMarkup(basePrice, airlineCode, origin, destination)
  const sellingPrice = basePrice + markup.amount

  return {
    id: offer.id ?? 'offer',
    airline: offer.airline ?? 'Unknown Airline',
    airlineCode,
    flightNumber: offer.flightNumber ?? 'N/A',
    departAirport: offer.departAirport ?? 'N/A',
    arriveAirport: offer.arriveAirport ?? 'N/A',
    departureTime: offer.departureTime ?? 'N/A',
    arrivalTime: offer.arrivalTime ?? 'N/A',
    duration: offer.duration ?? 'N/A',
    stops: offer.stops ?? 0,
    cabin: offer.cabin ?? 'Economy',
    price: formatCurrency(sellingPrice),
    apiPrice: formatCurrency(basePrice),
    basePrice,
    markupAmount: markup.amount,
    sellingPrice,
    profit: markup.amount,
    markupLabel: markup.label,
    refundable: Boolean(offer.refundable),
  }
}

export function saveMarkupSettings(settings: MarkupSettings) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(MARKUP_SETTINGS_KEY, JSON.stringify(settings))
}

export function getMarkupSettings() {
  return readMarkupSettings()
}

export function getFlightPricingSummary() {
  if (typeof window === 'undefined') {
    return { totalApiPrice: 0, totalSellingPrice: 0, totalProfit: 0, offerCount: 0 }
  }

  try {
    const raw = window.localStorage.getItem(LAST_FLIGHT_SEARCH_KEY)
    if (!raw) {
      return { totalApiPrice: 0, totalSellingPrice: 0, totalProfit: 0, offerCount: 0 }
    }

    const offers = JSON.parse(raw) as FlightOffer[]
    const totalApiPrice = offers.reduce((sum, offer) => sum + (offer.basePrice ?? 0), 0)
    const totalSellingPrice = offers.reduce((sum, offer) => sum + (offer.sellingPrice ?? offer.basePrice ?? 0), 0)
    const totalProfit = offers.reduce((sum, offer) => sum + (offer.profit ?? 0), 0)

    return { totalApiPrice, totalSellingPrice, totalProfit, offerCount: offers.length }
  } catch {
    return { totalApiPrice: 0, totalSellingPrice: 0, totalProfit: 0, offerCount: 0 }
  }
}

function sampleFlightOffers(params: FlightSearchParams): FlightOffer[] {
  return [
    {
      id: 'AMX001',
      airline: 'Qatar Airways',
      airlineCode: 'QR',
      flightNumber: 'QR700',
      departAirport: `${params.origin.toUpperCase()} International`,
      arriveAirport: `${params.destination.toUpperCase()} International`,
      departureTime: `${params.departureDate} 07:20`,
      arrivalTime: `${params.departureDate} 13:05`,
      duration: '6h 45m',
      stops: 0,
      cabin: 'Business',
      price: '$1,450',
      refundable: true,
    },
    {
      id: 'TK416',
      airline: 'Turkish Airlines',
      airlineCode: 'TK',
      flightNumber: 'TK416',
      departAirport: `${params.origin.toUpperCase()} International`,
      arriveAirport: `${params.destination.toUpperCase()} International`,
      departureTime: `${params.departureDate} 10:45`,
      arrivalTime: `${params.departureDate} 18:25`,
      duration: '7h 40m',
      stops: 1,
      cabin: 'Economy',
      price: '$890',
      refundable: false,
    },
    {
      id: 'EK204',
      airline: 'Emirates',
      airlineCode: 'EK',
      flightNumber: 'EK204',
      departAirport: `${params.origin.toUpperCase()} International`,
      arriveAirport: `${params.destination.toUpperCase()} International`,
      departureTime: `${params.departureDate} 22:10`,
      arrivalTime: `${params.departureDate} 06:15 +1`,
      duration: '8h 05m',
      stops: 0,
      cabin: 'Premium Economy',
      price: '$1,120',
      refundable: false,
    },
  ]
}

export async function searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
  const token = await getAmadeusAccessToken()

  if (!token) {
    const offers = sampleFlightOffers(params).map((offer) => withMarkupApplied(offer))
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LAST_FLIGHT_SEARCH_KEY, JSON.stringify(offers))
    }
    return offers
  }

  const query = new URLSearchParams({
    originLocationCode: params.origin.toUpperCase(),
    destinationLocationCode: params.destination.toUpperCase(),
    departureDate: params.departureDate,
    adults: `${params.adults ?? 1}`,
    currencyCode: 'USD',
    travelClass: 'ECONOMY',
    max: '6',
  })

  if (params.tripType === 'roundtrip' && params.returnDate) {
    query.set('returnDate', params.returnDate)
  }

  try {
    const response = await fetch(`${AMADEUS_FLIGHT_SEARCH_URL}?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const offers = sampleFlightOffers(params).map((offer) => withMarkupApplied(offer))
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LAST_FLIGHT_SEARCH_KEY, JSON.stringify(offers))
      }
      return offers
    }

    const data = await response.json()
    if (!Array.isArray(data.data) || data.data.length === 0) {
      const offers = sampleFlightOffers(params).map((offer) => withMarkupApplied(offer))
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LAST_FLIGHT_SEARCH_KEY, JSON.stringify(offers))
      }
      return offers
    }

    const offers = data.data.slice(0, 6).map((offer: any, index: number) => {
      const itinerary = offer.itineraries?.[0]
      const segment = itinerary?.segments?.[0]
      const price = offer.price?.grandTotal ?? offer.price?.total ?? '0'
      const airline = segment?.carrierCode || 'Unknown'
      const depart = segment?.departure
      const arrive = segment?.arrival

      return {
        id: offer.id || `offer-${index}`,
        airline: segment?.carrierCode || 'Unknown Airline',
        airlineCode: segment?.carrierCode || 'XX',
        flightNumber: segment?.carrierCode && segment?.number ? `${segment.carrierCode}${segment.number}` : 'N/A',
        departAirport: depart?.iataCode ?? 'N/A',
        arriveAirport: arrive?.iataCode ?? 'N/A',
        departureTime: depart?.at ?? 'N/A',
        arrivalTime: arrive?.at ?? 'N/A',
        duration: itinerary?.duration?.replace('PT', '').toLowerCase() ?? 'N/A',
        stops: itinerary?.segments?.length ? itinerary.segments.length - 1 : 0,
        cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ?? 'Economy',
        price: `$${price}`,
        refundable: offer.refundable ?? false,
      }
    }).map((offer) => withMarkupApplied(offer))

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LAST_FLIGHT_SEARCH_KEY, JSON.stringify(offers))
    }

    return offers
  } catch {
    const offers = sampleFlightOffers(params).map((offer) => withMarkupApplied(offer))
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LAST_FLIGHT_SEARCH_KEY, JSON.stringify(offers))
    }
    return offers
  }
}
