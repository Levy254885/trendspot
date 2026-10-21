/**
 * Tiny in-memory TTL cache so one page render doesn't hit Firestore ten times.
 * Lives per server instance; entries expire quickly and are cleared on every
 * admin write.
 */
const store = new Map<string, { at: number; data: unknown }>();

export async function cached<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>
): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.data as T;
  const data = await load();
  store.set(key, { at: Date.now(), data });
  return data;
}

export function clearCache() {
  store.clear();
}
