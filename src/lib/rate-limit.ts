const hits = new Map<string, number[]>();

/** In-memory sliding window. Fine for one Node process (your Plesk setup). */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
    const now = Date.now();
    if (hits.size > 5000) hits.clear(); // crude memory cap
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
        hits.set(key, recent);
        return false;
    }
    recent.push(now);
    hits.set(key, recent);
    return true;
}