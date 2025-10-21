-- Add is_beta column to download_links table
ALTER TABLE download_links
ADD COLUMN IF NOT EXISTS is_beta BOOLEAN DEFAULT FALSE;

-- Drop the old unique constraint on platform only
ALTER TABLE download_links
DROP CONSTRAINT IF EXISTS download_links_platform_key;

-- Add new unique constraint on platform AND is_beta together
ALTER TABLE download_links
ADD CONSTRAINT download_links_platform_is_beta_key UNIQUE (platform, is_beta);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_download_links_is_beta ON download_links(is_beta);

-- Insert beta release entries for each platform if they don't exist
INSERT INTO download_links (platform, version, download_url, is_available, is_beta)
SELECT 
  platform,
  'Coming Soon',
  '#',
  FALSE,
  TRUE
FROM download_links
WHERE is_beta = FALSE
ON CONFLICT (platform, is_beta) DO NOTHING;

-- Add comment to table
COMMENT ON COLUMN download_links.is_beta IS 'Indicates if this is a beta release (true) or stable release (false)';
