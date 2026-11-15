export function isValidTimeString(raw: string): boolean {
  const value = raw.trim();
  if (!value) return false;
  // Matches 12-hour format (e.g., 8:00 AM, 08:30 PM) or 24-hour format (e.g., 08:00, 20:30)
  const pattern12h = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;
  const pattern24h = /^([01]?\d|2[0-3]):[0-5]\d$/;
  return pattern12h.test(value) || pattern24h.test(value);
}

export function normalizeTimeString(raw: string): string {
  const value = raw.trim().toUpperCase();
  const match12 = value.match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/);
  if (match12) {
    const hh = match12[1].padStart(2, '0');
    return `${hh}:${match12[2]} ${match12[3]}`;
  }
  const match24 = value.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (match24) {
    const h24 = parseInt(match24[1], 10);
    const period = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${String(h12).padStart(2, '0')}:${match24[2]} ${period}`;
  }
  return raw.trim();
}
