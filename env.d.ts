/// <reference types="svelte" />
/// <reference types="vite/client" />
interface ImportMeta {
  env: {
    PKG_VERSION: string;
    PKG_NAME: string;

    VITE_WITHINGS_CLIENT_ID: string;
    VITE_WITHINGS_SECRET: string;
  };
}
