-- Booking tracking system

CREATE TABLE IF NOT EXISTS tracking_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text NOT NULL UNIQUE,
  booking_type text NOT NULL CHECK (booking_type IN ('flight', 'hotel', 'tour', 'cargo', 'visa')),
  related_table text,
  related_id uuid,
  customer_name text,
  customer_email text,
  destination text,
  summary text,
  current_status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_record_id uuid NOT NULL REFERENCES tracking_records(id) ON DELETE CASCADE,
  status text NOT NULL,
  note text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tracking_records_reference_number ON tracking_records(reference_number);
CREATE INDEX IF NOT EXISTS idx_tracking_records_booking_type ON tracking_records(booking_type);
CREATE INDEX IF NOT EXISTS idx_tracking_events_tracking_record_id ON tracking_events(tracking_record_id);

CREATE OR REPLACE FUNCTION update_tracking_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tracking_records_set_updated_at
BEFORE UPDATE ON tracking_records
FOR EACH ROW
EXECUTE FUNCTION update_tracking_records_updated_at();

ALTER TABLE tracking_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tracking records" ON tracking_records
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read tracking events" ON tracking_events
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tracking records" ON tracking_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage tracking events" ON tracking_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
