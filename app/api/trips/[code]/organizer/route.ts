import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Elevates an existing organizer traveler for this session — the same
// lightweight, client-checked passcode this app has always used, now
// scoped per trip. Never elevates a non-organizer traveler.
export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code.trim().toUpperCase();
  const trip = await prisma.trip.findUnique({ where: { code } });
  if (!trip) return NextResponse.json({ error: 'no trip with that code' }, { status: 404 });

  const body = (await req.json()) ?? {};
  const travelerId = typeof body.travelerId === 'string' ? body.travelerId : '';
  const passcode = typeof body.passcode === 'string' ? body.passcode.trim() : '';

  if (passcode !== trip.organizerPasscode) {
    return NextResponse.json({ error: 'incorrect passcode' }, { status: 401 });
  }
  const traveler = await prisma.traveler.findUnique({ where: { id: travelerId } });
  if (!traveler || traveler.tripId !== trip.id || !traveler.isOrganizer) {
    return NextResponse.json({ error: 'not the organizer' }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
