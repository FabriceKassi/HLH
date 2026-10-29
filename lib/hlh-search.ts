export const HLH_PROPERTIES = ['wia', 'atta', 'astral'] as const;

export type HLHSearch = {
  property: typeof HLH_PROPERTIES[number];
  arrival: string;
  departure: string;
  rooms: number;
  adults: number;
  children: number;
};

export function abidjanToday(now = new Date()): string {
  return now.toISOString().slice(0, 10); // Abidjan stays at UTC+0 throughout the year.
}

function realDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + 'T00:00:00Z');
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateHLHSearch(input: unknown, today = abidjanToday()):
  { ok: true; criteria: HLHSearch } | { ok: false; field: string; code: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, field: 'property', code: 'invalid_request' };
  const data = input as Record<string, unknown>;
  if (!HLH_PROPERTIES.includes(data.property as HLHSearch['property'])) return { ok: false, field: 'property', code: 'property_required' };
  if (!realDate(data.arrival) || data.arrival < today) return { ok: false, field: 'arrival', code: 'invalid_arrival' };
  if (!realDate(data.departure) || data.departure <= data.arrival) return { ok: false, field: 'departure', code: 'invalid_departure' };
  if (!Number.isSafeInteger(data.rooms) || Number(data.rooms) < 1) return { ok: false, field: 'rooms', code: 'invalid_rooms' };
  if (!Number.isSafeInteger(data.adults) || Number(data.adults) < 1 || !Number.isSafeInteger(data.children) || Number(data.children) < 0 || Number(data.adults) + Number(data.children) > 3) return { ok: false, field: 'guests', code: 'invalid_guests' };
  return { ok: true, criteria: { property: data.property as HLHSearch['property'], arrival: data.arrival, departure: data.departure, rooms: data.rooms as number, adults: data.adults as number, children: data.children as number } };
}
