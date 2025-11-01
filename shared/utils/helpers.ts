export const fromBase64URL = (base64url: string) => {
  if (import.meta.server) {
    return Buffer.from(base64url, "base64url").toString("utf-8");
  }

  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  return atob(base64);
};
