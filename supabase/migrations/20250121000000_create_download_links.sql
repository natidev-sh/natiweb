-- Create download_links table
CREATE TABLE IF NOT EXISTS download_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL UNIQUE CHECK (platform IN ('windows', 'macos', 'linux')),
  version text NOT NULL,
  download_url text NOT NULL,
  is_available boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_url CHECK (download_url = '#' OR download_url ~ '^https?://.*')
);

-- Enable RLS
ALTER TABLE download_links ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read download links
CREATE POLICY "Anyone can view download links"
  ON download_links
  FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can modify download links"
  ON download_links
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default data
INSERT INTO download_links (platform, version, download_url, is_available)
VALUES 
  ('windows', '0.2.2', 'https://github.com/natidev-sh/nati/releases/download/v0.2.2/Nati-0.2.2.Setup.exe', true),
  ('macos', 'Coming Soon', '#', false),
  ('linux', 'Coming Soon', '#', false)
ON CONFLICT (platform) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_download_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_download_links_updated_at
  BEFORE UPDATE ON download_links
  FOR EACH ROW
  EXECUTE FUNCTION update_download_links_updated_at();
