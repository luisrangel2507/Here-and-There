import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { notifyOthers, PushPayload } from '@/lib/push';
import { logActivity } from '@/lib/activity';
import { requireTraveler, isCtx } from '@/lib/trip';

// Messages are composed here from a fixed set of event types, so the client
// only supplies who did it and which city. `who` is the acting traveler's name.
function compose(who: string, type: string, city: string, count: number): { push: PushPayload; emoji: string; feedText: string; feedTravelerId: 'actor' | 'shared' } | null {
  switch (type) {
    case 'city_added':
      return { push: { title: '📍 New destination', body: who + ' added ' + city + ' — go swipe on it!', tag: 'city' }, emoji: '📍', feedText: 'added ' + city, feedTravelerId: 'actor' };
    case 'city_cut':
      return {
        push: { title: '💔 ' + city + ' is out', body: who + ' swiped it out — ' + count + ' destination' + (count === 1 ? '' : 's') + ' left.', tag: 'swipes' },
        emoji: '💔',
        feedText: 'swiped ' + city + ' out',
        feedTravelerId: 'actor',
      };
    case 'winner':
      return { push: { title: '✈️ It\'s decided!', body: 'You\'re going to ' + city + '. Open the app for the big reveal.', tag: 'winner' }, emoji: '✈️', feedText: 'It\'s decided — everyone\'s going to ' + city + '!', feedTravelerId: 'shared' };
    case 'trip_dates':
      return { push: { title: '🗓️ Trip dates set', body: who + ' set the dates — the countdown is on.', tag: 'dates' }, emoji: '🗓️', feedText: 'set the trip dates', feedTravelerId: 'actor' };
    case 'availability':
      return { push: { title: '📅 Free days updated', body: who + ' marked the days they can travel — see where you overlap.', tag: 'availability' }, emoji: '📅', feedText: 'marked new free days', feedTravelerId: 'actor' };
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const body = (await req.json()) ?? {};
  const type = body.type;
  const city = typeof body.city === 'string' ? body.city.slice(0, 60) : '';
  const count = Number.isFinite(body.count) ? body.count : 0;
  const destId = typeof body.destId === 'string' ? body.destId : null;

  const me = await prisma.traveler.findUnique({ where: { id: ctx.travelerId } });
  const entry = compose(me?.name || 'Someone', type, city, count);
  if (!entry) return NextResponse.json({ error: 'invalid type' }, { status: 400 });

  await logActivity(ctx.tripId, entry.feedTravelerId === 'shared' ? null : ctx.travelerId, entry.emoji, entry.feedText, destId).catch(() => {});
  try {
    await notifyOthers(ctx.tripId, ctx.travelerId, entry.push);
  } catch (e) { /* notifications are best-effort */ }
  return NextResponse.json({ ok: true });
}
