ALTER TABLE visa_applications
  ADD COLUMN IF NOT EXISTS nationality text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS destination_country text,
  ADD COLUMN IF NOT EXISTS approval_file_url text,
  ADD COLUMN IF NOT EXISTS document_count integer DEFAULT 0;

ALTER TABLE visa_applications
  DROP CONSTRAINT IF EXISTS visa_applications_status_check;

ALTER TABLE visa_applications
  ADD CONSTRAINT visa_applications_status_check
  CHECK (status IN ('submitted', 'under_review', 'processing', 'approved', 'rejected', 'pending'));

CREATE TABLE IF NOT EXISTS visa_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_application_id uuid NOT NULL REFERENCES visa_applications(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_path text,
  file_url text,
  file_size integer,
  mime_type text,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visa_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_application_id uuid NOT NULL REFERENCES visa_applications(id) ON DELETE CASCADE,
  status text NOT NULL,
  note text,
  changed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE visa_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own visa documents"
  ON visa_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM visa_applications
      WHERE visa_applications.id = visa_documents.visa_application_id
        AND visa_applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload visa documents"
  ON visa_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM visa_applications
      WHERE visa_applications.id = visa_documents.visa_application_id
        AND visa_applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage visa documents"
  ON visa_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can read own visa status history"
  ON visa_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM visa_applications
      WHERE visa_applications.id = visa_status_history.visa_application_id
        AND visa_applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage visa status history"
  ON visa_status_history FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_visa_documents_application_id ON visa_documents(visa_application_id);
CREATE INDEX IF NOT EXISTS idx_visa_status_history_application_id ON visa_status_history(visa_application_id);
