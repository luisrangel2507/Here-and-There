import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireTraveler, isCtx } from '@/lib/trip';

export async function GET(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const rows = await prisma.customDestinations.findMany({ where: { tripId: ctx.tripId } });
  const map: Record<string, unknown> = {};
  for (const row of rows) map[row.region] = row.destinations;
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const body = await req.json();
  const { region, destinations } = body ?? {};

  if (!region || typeof region !== 'string' || !Array.isArray(destinations)) {
    return NextResponse.json({ error: 'region and destinations are required' }, { status: 400 });
  }

  await prisma.customDestinations.upsert({
    where: { tripId_region: { tripId: ctx.tripId, region } },
    create: { tripId: ctx.tripId, region, destinations },
    update: { destinations },
  });

  return NextResponse.json({ ok: true });
}
