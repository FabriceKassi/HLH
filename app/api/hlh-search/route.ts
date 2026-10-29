import { validateHLHSearch } from '../../../lib/hlh-search';

export async function POST(request: Request) {
  let input: unknown;
  try { input = await request.json(); }
  catch { return Response.json({ ok: false, field: 'property', code: 'invalid_request' }, { status: 400 }); }
  const result = validateHLHSearch(input);
  return Response.json(result, { status: result.ok ? 200 : 422, headers: { 'Cache-Control': 'no-store' } });
}
