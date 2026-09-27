import { NextRequest, NextResponse } from 'next/server';
import { NAMES, PROFILES, partnerOf, sendToProfile, PushPayload } from '@/lib/push';
import { logActivity } from '@/lib/activity';

// Feed entry for each event: [profile ('both' = shared moment), emoji, text without the subject].
function feedEntry(from: string, type: string, city: string, count: number): [string, string, string] | null {
  switch (type) {
    case 'city_added': return [from, '📍', 'added ' + city];
    case 'city_cut': return [from, '💔', 'swiped ' + city + ' out'];
    case 'round': return ['both', '🔥', 'Round ' + city + ' starts — ' + count + ' destinations left'];
    case 'winner': return ['both', '✈️', 'It\'s decided — you\'re going to ' + city + '!'];
    case 'trip_dates': return [from, '🗓️', 'set the trip dates'];
    case 'availability': return [from, '📅', 'marked new free days'];
    default: return null;
  }
}

// Messages are composed here from a fixed set of event types, so the client
// only supplies who did it and which city.
function compose(from: string, type: string, city: string, count: number): PushPayload | null {
  const who = NAMES[from];
  switch (type) {
    case 'city_added':
      return { title: '📍 New destination', body: who + ' added ' + city + ' — go swipe on it!', tag: 'city' };
    case 'city_cut':
      return {
        title: '💔 ' + city + ' got cut',
        body: who + ' swiped it out — ' + count + ' destination' + (count === 1 ? '' : 's') + ' left.',
        tag: 'swipes',
      };
    case 'round':
      return { title: '🔥 Round ' + city + '!', body: 'You both said yes to ' + count + ' places — swipe again to narrow it down.', tag: 'round' };
    case 'winner':
      return { title: '✈️ It\'s decided!', body: 'You\'re going to ' + city + '. Open the app for the big reveal.', tag: 'winner' };
    case 'availability':
      return { title: '📅 Free days updated', body: who + ' marked the days they can travel — see where you overlap.', tag: 'availability' };
    case 'trip_dates':
      return { title: '🗓️ Trip dates set', body: who + ' set the dates — the countdown is on.', tag: 'dates' };
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) ?? {};
  const { from, type } = body;
  if (!PROFILES.includes(from)) {
    return NextResponse.json({ error: 'invalid profile' }, { status: 400 });
  }
  const city = typeof body.city === 'string' ? body.city.slice(0, 60) : '';
  const count = Number.isFinite(body.count) ? body.count : 0;
  const payload = compose(from, type, city, count);
  if (!payload) return NextResponse.json({ error: 'invalid type' }, { status: 400 });

  const entry = feedEntry(from, type, city, count);
  if (entry) await logActivity(entry[0], entry[1], entry[2], typeof body.destId === 'string' ? body.destId : null);
  try {
    await sendToProfile(partnerOf(from), payload);
  } catch (e) { /* notifications are best-effort */ }
  return NextResponse.json({ ok: true });
}
