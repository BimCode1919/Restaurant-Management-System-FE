/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  // thêm các biến khác nếu có...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}