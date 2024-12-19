interface Env {
  // biome-ignore lint/correctness/noUndeclaredVariables: global
  AI: Ai;

  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;

  PANGEA_AUDIT_TOKEN: string;
  PANGEA_AUDIT_CONFIG_ID: string;
  PANGEA_DOMAIN: string;
}
