/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_REGION: string
  readonly VITE_AZURE_SUBSCRIPTION_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 