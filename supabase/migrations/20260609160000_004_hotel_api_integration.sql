ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS booking_reference text,
ADD COLUMN IF NOT EXISTS provider text,
ADD COLUMN IF NOT EXISTS payment_status text,
ADD COLUMN IF NOT EXISTS cancellation_policy text;

CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON bookings (booking_reference);
