import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireTraveler, isCtx } from '@/lib/trip';

const JSON_FIELDS = ['blockedIds', 'hiddenIds', 'hiddenFrom'] as const;
const DATE_FIELDS = ['tripStart', 'tripEnd'] as const;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const [row, travelers] = await Promise.all([
    prisma.tripState.findUnique({ where: { tripId: ctx.tripId } }),
    prisma.traveler.findMany({
      where: { tripId: ctx.tripId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, isOrganizer: true, info: true },
    }),
  ]);

  return NextResponse.json({
    blockedIds: row?.blockedIds ?? [],
    hiddenIds: row?.hiddenIds ?? [],
    hiddenFrom: row?.hiddenFrom ?? {},
    tripStart: row?.tripStart ?? null,
    tripEnd: row?.tripEnd ?? null,
    swipeRound: row?.swipeRound ?? 1,
    travelers: travelers.map(t => ({ id: t.id, name: t.name, isOrganizer: t.isOrganizer, info: t.info })),
    me: { id: ctx.travelerId, isOrganizer: ctx.isOrganizer },
  });
}

// Only the fields present in the body are written, so multiple phones can
// each save what they changed without overwriting each other.
export async function POST(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const body = (await req.json()) ?? {};
  const data: Record<string, unknown> = {};

  for (const field of JSON_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field] ?? (field === 'hiddenFrom' ? {} : []);
  }
  for (const field of DATE_FIELDS) {
    if (body[field] === undefined) continue;
    if (body[field] !== null && !DATE_RE.test(body[field])) {
      return NextResponse.json({ error: 'invalid ' + field }, { status: 400 });
    }
    data[field] = body[field];
  }
  // Per-traveler info (avatar, home base, free days, emergency contact) is
  // merged in, so each phone only touches its own traveler's row.
  if (body.myInfo !== undefined) {
    const current = await prisma.traveler.findUnique({ where: { id: ctx.travelerId } });
    const existing = (current && current.info && typeof current.info === 'object') ? current.info as Record<string, unknown> : {};
    await prisma.traveler.update({
      where: { id: ctx.travelerId },
      data: { info: { ...existing, ...(body.myInfo || {}) } },
    });
  }

  if (Object.keys(data).length) {
    await prisma.tripState.upsert({
      where: { tripId: ctx.tripId },
      create: { tripId: ctx.tripId, ...data },
      update: data,
    });
  }

  return NextResponse.json({ ok: true });
}
