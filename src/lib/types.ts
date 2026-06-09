export type Tour = {
  id: string
  name: string
  name_so?: string | null
  description: string
  description_so?: string | null
  destination: string
  duration_days: number
  price: string
  image_url?: string | null
  highlights?: string[] | null
  is_featured: boolean
  is_active: boolean
}

export type Hotel = {
  id: string
  name: string
  name_so?: string | null
  location: string
  description: string
  description_so?: string | null
  price_per_night: string
  rating: number
  amenities?: string[] | null
  image_url?: string | null
  is_active: boolean
}

export type Booking = {
  id: string
  booking_type: 'tour' | 'hotel'
  user_id: string
  tour_id?: string | null
  hotel_id?: string | null
  start_date: string
  end_date: string
  guests: number
  total_price: string
  status: string
  flight_route?: string | null
  flight_class?: string | null
  cargo_origin?: string | null
  cargo_destination?: string | null
  cargo_weight?: string | null
  cargo_description?: string | null
  booking_reference?: string | null
  provider?: string | null
  payment_status?: string | null
  cancellation_policy?: string | null
  notes?: string | null
  created_at: string
}
