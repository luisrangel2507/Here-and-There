import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logActivity } from '@/lib/activity';
import { requireTraveler, isCtx } from '@/lib/trip';

export async function GET(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const rows = await prisma.activity.findMany({ where: { tripId: ctx.tripId }, orderBy: { id: 'desc' }, take: 30 });
  return NextResponse.json(rows.map(r => ({
    id: r.id, travelerId: r.travelerId, emoji: r.emoji, text: r.text, destId: r.destId, at: r.createdAt.getTime(),
  })));
}

export async function POST(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const { emoji, text, destId } = (await req.json()) ?? {};
  if (typeof emoji !== 'string' || typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
  await logActivity(ctx.tripId, ctx.travelerId, emoji, text.trim(), typeof destId === 'string' ? destId : null);
  return NextResponse.json({ ok: true });
}
