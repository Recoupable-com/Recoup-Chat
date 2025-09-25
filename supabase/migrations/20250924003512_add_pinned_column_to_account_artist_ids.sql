-- Add pinned column to account_artist_ids table
ALTER TABLE "public"."account_artist_ids"
ADD COLUMN "pinned" boolean DEFAULT false NOT NULL;

-- Add index for efficient queries on pinned artists
CREATE INDEX account_artist_ids_account_pinned_idx ON account_artist_ids(account_id, pinned);

-- Add comment for documentation
COMMENT ON COLUMN "public"."account_artist_ids"."pinned" IS 'Indicates whether an artist is pinned by the user';
