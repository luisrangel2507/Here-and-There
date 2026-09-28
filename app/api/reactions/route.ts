import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireTraveler, isCtx } from '@/lib/trip';
import { logActivity } from '@/lib/activity';

const REACTIONS = ['love', 'maybe', 'nope'];

// { "<travelerId>": { "<destId>|<name>": reaction } }
export async function GET(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const rows = await prisma.reaction.findMany({ where: { tripId: ctx.tripId } });
  const map: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    if (!map[row.travelerId]) map[row.travelerId] = {};
    map[row.travelerId][row.destId + '|' + row.name] = row.reaction;
  }
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const { destId, name, reaction, city } = (await req.json()) ?? {};
  if (typeof destId !== 'string' || typeof name !== 'string' || !destId || !name) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
  if (!reaction) {
    await prisma.reaction.deleteMany({ where: { travelerId: ctx.travelerId, destId, name } });
    return NextResponse.json({ ok: true });
  }
  if (!REACTIONS.includes(reaction)) {
    return NextResponse.json({ error: 'invalid reaction' }, { status: 400 });
  }
  await prisma.reaction.upsert({
    where: { travelerId_destId_name: { travelerId: ctx.travelerId, destId, name } },
    create: { tripId: ctx.tripId, travelerId: ctx.travelerId, destId, name, reaction },
    update: { reaction },
  });
  if (reaction === 'love') {
    logActivity(ctx.tripId, ctx.travelerId, '😍', 'loved ' + name + (typeof city === 'string' && city ? ' in ' + city : ''), destId).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
