import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Unambiguous characters only (no 0/O, 1/I/L) — the code is meant to be
// read off a phone screen and typed by hand.
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function generateTripCode(length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return code;
}

export type TripContext = { tripId: string; travelerId: string; isOrganizer: boolean };

// Every per-trip data route requires these two headers (set by the client's
// api() wrapper) and checks the traveler actually belongs to that trip —
// so one trip's data is never reachable just by guessing another trip's id.
export async function requireTraveler(req: NextRequest): Promise<TripContext | NextResponse> {
  const tripId = req.headers.get('x-trip-id');
  const travelerId = req.headers.get('x-traveler-id');
  if (!tripId || !travelerId) {
    return NextResponse.json({ error: 'missing trip/traveler headers' }, { status: 401 });
  }
  const traveler = await prisma.traveler.findUnique({ where: { id: travelerId } });
  if (!traveler || traveler.tripId !== tripId) {
    return NextResponse.json({ error: 'not a member of this trip' }, { status: 401 });
  }
  return { tripId, travelerId, isOrganizer: traveler.isOrganizer };
}
export function isCtx(x: TripContext | NextResponse): x is TripContext {
  return !(x instanceof NextResponse);
}
