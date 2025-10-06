-- Update songs table to make all columns nullable except ISRC
ALTER TABLE "public"."songs" 
ALTER COLUMN "name" DROP NOT NULL;

ALTER TABLE "public"."songs" 
ALTER COLUMN "album" DROP NOT NULL;

ALTER TABLE "public"."songs" 
ALTER COLUMN "lyrics" DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN "public"."songs"."name" IS 'Name/title of the song (nullable)';
COMMENT ON COLUMN "public"."songs"."album" IS 'Album name where the song appears (nullable)';
COMMENT ON COLUMN "public"."songs"."lyrics" IS 'Full lyrics text of the song (nullable)';
