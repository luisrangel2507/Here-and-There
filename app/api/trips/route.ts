import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateTripCode } from '@/lib/trip';

// Creates a new trip. The creator becomes its organizer immediately —
// setting the passcode is proof enough, no separate challenge needed.
export async function POST(req: NextRequest) {
  const body = (await req.json()) ?? {};
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : '';
  const organizerName = typeof body.organizerName === 'string' ? body.organizerName.trim().slice(0, 40) : '';
  const passcode = typeof body.passcode === 'string' ? body.passcode.trim() : '';

  if (!name || !organizerName || passcode.length < 4) {
    return NextResponse.json({ error: 'name, organizerName, and a passcode of 4+ characters are required' }, { status: 400 });
  }

  let code = '';
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = generateTripCode();
    const existing = await prisma.trip.findUnique({ where: { code: candidate } });
    if (!existing) { code = candidate; break; }
  }
  if (!code) return NextResponse.json({ error: 'could not generate a trip code — try again' }, { status: 500 });

  const [trip, organizer] = await prisma.$transaction(async (tx) => {
    const t = await tx.trip.create({ data: { code, name, organizerPasscode: passcode } });
    const o = await tx.traveler.create({ data: { tripId: t.id, name: organizerName, isOrganizer: true } });
    await tx.tripState.create({ data: { tripId: t.id } });
    return [t, o];
  });

  return NextResponse.json({
    tripId: trip.id,
    code: trip.code,
    name: trip.name,
    travelerId: organizer.id,
  });
}
