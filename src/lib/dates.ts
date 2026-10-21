const TZ = "Africa/Nairobi";

/** YYYY-MM-DD in Nairobi time. */
export function nairobiDate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** The last `n` calendar days (oldest first), as YYYY-MM-DD. */
export function lastNDays(n: number): string[] {
  const out: string[] = [];
  const now = Date.now();
  for (let i = n - 1; i >= 0; i--) {
    out.push(nairobiDate(new Date(now - i * 86_400_000)));
  }
  return out;
}
