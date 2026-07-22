/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_FEATURE_LIVE_STATS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
