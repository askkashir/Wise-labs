-- Fires the notify-submission edge function whenever a new application
-- comes in, via Supabase's pg_net extension (async HTTP from Postgres).
-- Requires pg_net to be enabled on the project (Database > Extensions).
--
-- The edge function URL/anon key below are placeholders — replace
-- <PROJECT_REF> after the project is provisioned, or set this up via the
-- Supabase dashboard's Database Webhooks UI instead (equivalent, easier to
-- manage without editing SQL). Either approach works; this file documents
-- the SQL-only path for completeness.

create extension if not exists pg_net;

create or replace function public.notify_new_submission()
returns trigger as $$
begin
  perform net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/notify-submission',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'id', new.id,
      'track', new.track,
      'submitted_at', new.submitted_at
    )
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists submissions_notify on public.submissions;
create trigger submissions_notify
  after insert on public.submissions
  for each row execute function public.notify_new_submission();
