-- Global travel and cargo database schema

CREATE TABLE IF NOT EXISTS airlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  iata_code text NOT NULL,
  country text,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS airports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  iata_code text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  time_zone text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  airline_id uuid REFERENCES airlines(id) ON DELETE SET NULL,
  flight_number text NOT NULL,
  origin_airport_id uuid REFERENCES airports(id) ON DELETE SET NULL,
  destination_airport_id uuid REFERENCES airports(id) ON DELETE SET NULL,
  departure_time timestamptz NOT NULL,
  arrival_time timestamptz NOT NULL,
  duration text NOT NULL,
  cabin_class text NOT NULL,
  fare_amount decimal(10,2) NOT NULL,
  available_seats integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS flight_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  flight_id uuid REFERENCES flights(id) ON DELETE SET NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  departure_date date NOT NULL,
  return_date date,
  passengers integer NOT NULL DEFAULT 1,
  travel_class text NOT NULL,
  total_price decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cargo_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  service_type text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  transport_mode text NOT NULL,
  pickup_date date NOT NULL,
  delivery_date date,
  cargo_weight decimal(10,2) NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  status text DEFAULT 'requested' CHECK (status IN ('requested', 'in transit', 'delivered', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  company text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  payment_method text NOT NULL,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_reference text,
  created_at timestamptz DEFAULT now()
);

-- Public read policies for airlines and airports
CREATE POLICY "Anyone can read airlines"
  ON airlines FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read airports"
  ON airports FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage flights"
  ON flights FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can create flight bookings"
  ON flight_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own flight bookings"
  ON flight_bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage flight bookings"
  ON flight_bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can create cargo orders"
  ON cargo_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can manage cargo orders"
  ON cargo_orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage customers"
  ON customers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id OR profile_id IS NULL);

CREATE POLICY "Users can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_flights_airline_id ON flights(airline_id);
CREATE INDEX IF NOT EXISTS idx_flights_origin_airport_id ON flights(origin_airport_id);
CREATE INDEX IF NOT EXISTS idx_flights_destination_airport_id ON flights(destination_airport_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_user_id ON flight_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_cargo_orders_user_id ON cargo_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
