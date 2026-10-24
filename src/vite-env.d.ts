/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  /** 站点暗号的 SHA-256 十六进制摘要（只注入哈希，绝不注入明文） */
  readonly VITE_SITE_PASSWORD_HASH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
