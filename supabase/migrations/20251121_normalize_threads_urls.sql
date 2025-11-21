-- Migration: Normalize Threads URLs
-- Description: Automatically convert threads.com to threads.net for all social URLs

-- Create function to normalize Threads URLs
CREATE OR REPLACE FUNCTION normalize_threads_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if the URL contains threads.com
  IF NEW.profile_url LIKE '%threads.com%' THEN
    NEW.profile_url = REPLACE(NEW.profile_url, 'threads.com', 'threads.net');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT operations
CREATE TRIGGER normalize_threads_url_insert
  BEFORE INSERT ON socials
  FOR EACH ROW
  EXECUTE FUNCTION normalize_threads_url();

-- Create trigger for UPDATE operations
CREATE TRIGGER normalize_threads_url_update
  BEFORE UPDATE OF profile_url ON socials
  FOR EACH ROW
  WHEN (NEW.profile_url IS DISTINCT FROM OLD.profile_url)
  EXECUTE FUNCTION normalize_threads_url();

-- Update any existing threads.com URLs (though we just deleted the only one)
UPDATE socials 
SET profile_url = REPLACE(profile_url, 'threads.com', 'threads.net')
WHERE profile_url LIKE '%threads.com%';

-- Add a comment to document this behavior
COMMENT ON FUNCTION normalize_threads_url() IS 
'Automatically converts threads.com URLs to threads.net for scraper compatibility';
