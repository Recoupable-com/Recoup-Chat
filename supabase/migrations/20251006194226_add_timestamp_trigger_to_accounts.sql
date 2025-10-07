-- Create trigger function to auto-update timestamp field
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    new.timestamp = extract(epoch from now());
    return NEW;
end
$function$
;

-- Add trigger to automatically update timestamp field on accounts table
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Add comment for documentation
COMMENT ON FUNCTION public.trigger_set_timestamp() IS 'Trigger function to auto-update timestamp field with current Unix timestamp';
COMMENT ON TRIGGER set_timestamp ON public.accounts IS 'Auto-updates timestamp field to current moment on row update';
