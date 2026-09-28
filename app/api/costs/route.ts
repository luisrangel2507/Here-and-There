import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireTraveler, isCtx } from '@/lib/trip';

// Costs are organizer-only, both to read and write — never sent to the rest
// of the trip's travelers.
export async function GET(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;
  if (!ctx.isOrganizer) return NextResponse.json({}, { status: 403 });

  const rows = await prisma.destinationCosts.findMany({ where: { tripId: ctx.tripId } });
  const map: Record<string, unknown> = {};
  for (const row of rows) map[row.destId] = row.costs;
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;
  if (!ctx.isOrganizer) return NextResponse.json({ error: 'organizer only' }, { status: 403 });

  const body = await req.json();
  const { destId, costs } = body ?? {};

  if (!destId || typeof destId !== 'string' || typeof costs !== 'object' || costs === null) {
    return NextResponse.json({ error: 'destId and costs are required' }, { status: 400 });
  }

  await prisma.destinationCosts.upsert({
    where: { tripId_destId: { tripId: ctx.tripId, destId } },
    create: { tripId: ctx.tripId, destId, costs },
    update: { costs },
  });

  return NextResponse.json({ ok: true });
}
