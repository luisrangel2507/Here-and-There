import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const JSON_FIELDS = ['priorityOrder', 'blockedIds', 'hiddenIds', 'profileInfo', 'adminRanking', 'elenyHiddenIds'] as const;
const DATE_FIELDS = ['tripStart', 'tripEnd'] as const;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET() {
  const row = await prisma.appState.findUnique({ where: { id: 1 } });
  if (!row) return NextResponse.json(null);
  return NextResponse.json({
    priorityOrder: row.priorityOrder,
    blockedIds: row.blockedIds,
    hiddenIds: row.hiddenIds,
    profileInfo: row.profileInfo,
    adminRanking: row.adminRanking,
    elenyHiddenIds: row.elenyHiddenIds,
    tripStart: row.tripStart,
    tripEnd: row.tripEnd,
    lastSubmitAt: row.lastSubmitAt ? row.lastSubmitAt.getTime() : null,
  });
}

// Only the fields present in the body are written, so each phone can save
// what it changed without overwriting what the other phone changed meanwhile.
export async function POST(req: NextRequest) {
  const body = (await req.json()) ?? {};
  const data: Record<string, unknown> = {};

  for (const field of JSON_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field] ?? (field === 'profileInfo' ? {} : []);
  }
  for (const field of DATE_FIELDS) {
    if (body[field] === undefined) continue;
    if (body[field] !== null && !DATE_RE.test(body[field])) {
      return NextResponse.json({ error: 'invalid ' + field }, { status: 400 });
    }
    data[field] = body[field];
  }
  // Per-traveler profile info is merged in, so each phone only touches its own entry.
  if (body.profileInfoFor && ['luis', 'eleny'].includes(body.profileInfoFor.profile)) {
    const current = await prisma.appState.findUnique({ where: { id: 1 } });
    const existing = (current && current.profileInfo && typeof current.profileInfo === 'object') ? current.profileInfo as Record<string, unknown> : {};
    data.profileInfo = { ...existing, [body.profileInfoFor.profile]: body.profileInfoFor.info || {} };
  }
  if (body.lastSubmitAt !== undefined) {
    data.lastSubmitAt = body.lastSubmitAt ? new Date(body.lastSubmitAt) : null;
  }

  const row = await prisma.appState.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });

  return NextResponse.json({ ok: true, updatedAt: row.updatedAt });
}
