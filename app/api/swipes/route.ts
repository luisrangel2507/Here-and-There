import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireTraveler, isCtx } from '@/lib/trip';
import { notifyOthers } from '@/lib/push';
import { logActivity } from '@/lib/activity';

const CHOICES = ['like', 'nope'];

export async function GET(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const [rows, state] = await Promise.all([
    prisma.swipe.findMany({ where: { tripId: ctx.tripId } }),
    prisma.tripState.findUnique({ where: { tripId: ctx.tripId } }),
  ]);
  const map: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    if (!map[row.travelerId]) map[row.travelerId] = {};
    map[row.travelerId][row.destId] = row.choice;
  }
  return NextResponse.json({ swipes: map, round: state?.swipeRound ?? 1 });
}

export async function POST(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const body = (await req.json()) ?? {};

  // Next round: everyone left said yes, so clear those likes and swipe again.
  // Only advances from the round the phone saw, so two phones finishing at
  // once can't skip a round or wipe likes from the new one.
  if (Array.isArray(body.resetRound)) {
    const ids = body.resetRound.filter((id: unknown) => typeof id === 'string');
    const fromRound = Number(body.fromRound) || 1;
    const bumped = await prisma.tripState.updateMany({
      where: { tripId: ctx.tripId, swipeRound: fromRound },
      data: { swipeRound: fromRound + 1 },
    });
    if (bumped.count === 0) {
      const state = await prisma.tripState.findUnique({ where: { tripId: ctx.tripId } });
      if (state) return NextResponse.json({ ok: true, advanced: false, round: state.swipeRound });
      await prisma.tripState.create({ data: { tripId: ctx.tripId, swipeRound: fromRound + 1 } });
    }
    await prisma.swipe.deleteMany({ where: { tripId: ctx.tripId, destId: { in: ids }, choice: 'like' } });
    const count = Number.isFinite(body.count) ? body.count : ids.length;
    notifyOthers(ctx.tripId, ctx.travelerId, {
      title: '🔥 Round ' + (fromRound + 1) + '!',
      body: 'Everyone said yes to ' + count + ' places — swipe again to narrow it down.',
      tag: 'round',
    }).catch(() => {});
    logActivity(ctx.tripId, null, '🔥', 'Round ' + (fromRound + 1) + ' starts — ' + count + ' destinations left').catch(() => {});
    return NextResponse.json({ ok: true, advanced: true, round: fromRound + 1 });
  }

  // Bring a swiped-out destination back into play.
  if (typeof body.restore === 'string') {
    await prisma.swipe.deleteMany({ where: { tripId: ctx.tripId, destId: body.restore, choice: 'nope' } });
    return NextResponse.json({ ok: true });
  }

  const { destId, choice } = body;
  if (!destId || typeof destId !== 'string') {
    return NextResponse.json({ error: 'destId is required' }, { status: 400 });
  }

  if (!choice) {
    await prisma.swipe.deleteMany({ where: { travelerId: ctx.travelerId, destId } });
    return NextResponse.json({ ok: true });
  }
  if (!CHOICES.includes(choice)) {
    return NextResponse.json({ error: 'invalid choice' }, { status: 400 });
  }

  await prisma.swipe.upsert({
    where: { travelerId_destId: { travelerId: ctx.travelerId, destId } },
    create: { tripId: ctx.tripId, travelerId: ctx.travelerId, destId, choice },
    update: { choice },
  });

  // A match needs every traveler in the trip to have liked it. "Out" and
  // "winner" events are left to the client's /api/notify call — the server
  // has no idea how many built-in destinations exist to count what's left.
  if (choice === 'like') {
    const city = typeof body.city === 'string' ? body.city.slice(0, 60) : 'a destination';
    const [travelers, swipesForDest] = await Promise.all([
      prisma.traveler.findMany({ where: { tripId: ctx.tripId }, select: { id: true } }),
      prisma.swipe.findMany({ where: { tripId: ctx.tripId, destId, choice: 'like' }, select: { travelerId: true } }),
    ]);
    const liked = new Set(swipesForDest.map(s => s.travelerId));
    if (travelers.length > 1 && travelers.every(t => liked.has(t.id))) {
      notifyOthers(ctx.tripId, ctx.travelerId, {
        title: '💘 It\'s a match!',
        body: 'Everyone wants to go to ' + city + '.',
        tag: 'match-' + destId,
      }).catch(() => {});
      logActivity(ctx.tripId, null, '💘', 'It\'s a match: ' + city, destId).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
