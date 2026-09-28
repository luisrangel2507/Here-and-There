import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Public lookup by join code — no passcode required, just the roster so the
// "who are you?" picker can show existing names. Never returns the passcode.
export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code.trim().toUpperCase();
  const trip = await prisma.trip.findUnique({ where: { code } });
  if (!trip) return NextResponse.json({ error: 'no trip with that code' }, { status: 404 });

  const travelers = await prisma.traveler.findMany({
    where: { tripId: trip.id },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, isOrganizer: true, info: true },
  });

  return NextResponse.json({
    tripId: trip.id,
    code: trip.code,
    name: trip.name,
    travelers: travelers.map(t => ({ id: t.id, name: t.name, isOrganizer: t.isOrganizer, avatar: (t.info as any)?.avatar || null })),
  });
}
