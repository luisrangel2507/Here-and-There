import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireTraveler, isCtx } from '@/lib/trip';

// { "<destId>": [[{ name }, ...], ...] }
export async function GET(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const rows = await prisma.itinerary.findMany({ where: { tripId: ctx.tripId } });
  const map: Record<string, unknown> = {};
  for (const row of rows) map[row.destId] = row.days;
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const { destId, days } = (await req.json()) ?? {};
  if (typeof destId !== 'string' || !destId || !Array.isArray(days) || days.length > 60) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
  const clean = days.map((day: unknown) =>
    (Array.isArray(day) ? day : [])
      .filter((stop: any) => stop && typeof stop.name === 'string' && stop.name.trim())
      .slice(0, 30)
      .map((stop: any) => ({ name: stop.name.trim().slice(0, 120) })),
  );
  await prisma.itinerary.upsert({
    where: { tripId_destId: { tripId: ctx.tripId, destId } },
    create: { tripId: ctx.tripId, destId, days: clean },
    update: { days: clean },
  });
  return NextResponse.json({ ok: true });
}
