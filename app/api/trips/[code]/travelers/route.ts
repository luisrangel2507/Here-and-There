import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Joins a trip as a new traveler — no passcode needed (matches this app's
// existing "just tap your name and go" trust model for non-organizers).
export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code.trim().toUpperCase();
  const trip = await prisma.trip.findUnique({ where: { code } });
  if (!trip) return NextResponse.json({ error: 'no trip with that code' }, { status: 404 });

  const body = (await req.json()) ?? {};
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 40) : '';
  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });

  const count = await prisma.traveler.count({ where: { tripId: trip.id } });
  if (count >= 20) return NextResponse.json({ error: 'this trip already has 20 travelers' }, { status: 400 });

  const traveler = await prisma.traveler.create({ data: { tripId: trip.id, name, isOrganizer: false } });
  return NextResponse.json({ tripId: trip.id, travelerId: traveler.id, name: traveler.name });
}
