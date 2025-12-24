import * as jose from "jose";
import { ensureKeypair, getPrivateKeyOrNull } from "./cryptoKeys";

function looksLikeCompactJWE(v) {
  if (typeof v !== "string") return false;
  const parts = v.split(".");
  return parts.length === 5 && parts.every(p => p.length > 0);
}

async function tryDecryptInPlace(response) {
  // Don’t touch empty bodies or HEAD/204
  if (response.status === 204 || !response.data) return { ok: false };

  const ct = response.headers?.["content-type"] || "";
  const flagged = response.headers?.["x-encrypted"] === "1";
  const isJose = ct.includes("application/jose");
  const encrypted = flagged || isJose || looksLikeCompactJWE(response.data);

  if (!encrypted || typeof response.data !== "string") return { ok: false };

  const pk = getPrivateKeyOrNull();
  if (!pk) throw new Error("NO_PRIVATE_KEY");

  const { plaintext } = await jose.compactDecrypt(response.data, pk);
  response.data = JSON.parse(new TextDecoder().decode(plaintext));
  return { ok: true };
}

export function attachJweInterceptors(instance) {
  if (!instance || instance.__jweAttached) return;
  instance.__jweAttached = true;

  // SUCCESS path
  instance.interceptors.response.use(
    async (response) => {
      try {
        const res = await tryDecryptInPlace(response);
        return response; // plain JSON or decrypted — either way, resolve
      } catch (err) {
        // IMPORTANT: do not throw — re-key + register + retry once
        if (response.config?.__jweRetry) return response; // already retried; give up silently

        const { publicJwk } = await ensureKeypair({ force: true });
        try {
          await instance.post("crypto/register-key", { publicJwk }, { withCredentials: true });
          const retryCfg = { ...response.config, __jweRetry: true };
          return await instance.request(retryCfg);
        } catch {
          // Still failing — return original response so caller can handle normally
          return response;
        }
      }
    },

    // ERROR path
    async (error) => {
      const res = error?.response;
      const cfg = error?.config;

      // If server has no key (428), register + retry once
      if (res?.status === 428 && cfg && !cfg.__jweRetry) {
        const { publicJwk } = await ensureKeypair();
        await instance.post("crypto/register-key", { publicJwk }, { withCredentials: true });
        return instance.request({ ...cfg, __jweRetry: true });
      }

      // If the error body itself is JWE, try to decrypt to a readable error
      if (res && typeof res.data === "string" && looksLikeCompactJWE(res.data)) {
        try {
          const pk = getPrivateKeyOrNull();
          if (pk) {
            const { plaintext } = await jose.compactDecrypt(res.data, pk);
            res.data = JSON.parse(new TextDecoder().decode(plaintext));
          }
        } catch { /* nothing to do here */ }
      }

      return Promise.reject(error);
    }
  );
}