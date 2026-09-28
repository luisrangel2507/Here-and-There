import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireTraveler, isCtx } from '@/lib/trip';

export async function GET(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const rows = await prisma.destinationHighlights.findMany({ where: { tripId: ctx.tripId } });
  const map: Record<string, unknown> = {};
  for (const row of rows) map[row.destId] = row.highlights;
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const body = await req.json();
  const { destId, highlights } = body ?? {};

  if (!destId || typeof destId !== 'string' || !Array.isArray(highlights)) {
    return NextResponse.json({ error: 'destId and highlights are required' }, { status: 400 });
  }

  await prisma.destinationHighlights.upsert({
    where: { tripId_destId: { tripId: ctx.tripId, destId } },
    create: { tripId: ctx.tripId, destId, highlights },
    update: { highlights },
  });

  return NextResponse.json({ ok: true });
}
