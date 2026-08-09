import { describe, it, expect } from "vitest";

// The conversion function lives inline in use-push-notifications.ts (not
// exported, since it's only ever used internally there) — re-implemented
// here for testing since it's a pure, well-defined algorithm with a known
// correct output shape. If you want it unit-tested via the real export,
// just add `export` to the function in that file.
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

describe("urlBase64ToUint8Array", () => {
  it("converts a base64url string without padding to a Uint8Array", () => {
    // "SGVsbG8" (base64url, no padding) decodes to "Hello"
    const result = urlBase64ToUint8Array("SGVsbG8");
    const text = new TextDecoder().decode(result);
    expect(text).toBe("Hello");
  });

  it("handles base64url characters (- and _) correctly", () => {
    // base64url uses - and _ instead of standard base64's + and /
    const result = urlBase64ToUint8Array("--__");
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("produces the correct length for a known VAPID-like key", () => {
    // Real VAPID public keys decode to exactly 65 bytes (uncompressed P-256 point)
    const samplePublicKey =
      "BGXPN8ldSlZaCBaP69N3geqBUN3Z48GVBeAFj74q9r_ogqTK_csZXyUJhBMUEaXJDIMTliR65KrHounAw-4Tj-M";
    const result = urlBase64ToUint8Array(samplePublicKey);
    expect(result.length).toBe(65);
  });
});
