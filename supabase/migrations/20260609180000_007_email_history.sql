CREATE TABLE IF NOT EXISTS email_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  template_name text NOT NULL,
  subject text NOT NULL,
  provider text NOT NULL DEFAULT 'auto',
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'pending')),
  message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email history"
  ON email_history FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can read own email history"
  ON email_history FOR SELECT
  TO authenticated
  USING (
    metadata ? 'user_id' AND (metadata->>'user_id')::uuid = auth.uid()
  );

CREATE INDEX IF NOT EXISTS idx_email_history_recipient ON email_history(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_history_status ON email_history(status);
