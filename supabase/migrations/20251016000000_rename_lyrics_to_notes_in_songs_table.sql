-- Rename lyrics column to notes in songs table
ALTER TABLE "public"."songs" 
RENAME COLUMN "lyrics" TO "notes";

-- Update column comment for documentation
COMMENT ON COLUMN "public"."songs"."notes" IS 'Notes or lyrics text for the song (nullable)';

