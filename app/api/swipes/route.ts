import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PROFILES, NAMES, partnerOf, sendToProfile } from '@/lib/push';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CHOICES = ['like', 'nope'];

export async function GET() {
  const [rows, state] = await Promise.all([
    prisma.swipe.findMany(),
    prisma.appState.findUnique({ where: { id: 1 } }),
  ]);
  const map: Record<string, Record<string, string>> = { luis: {}, eleny: {} };
  for (const row of rows) {
    if (map[row.profile]) map[row.profile][row.destId] = row.choice;
  }
  return NextResponse.json({ ...map, round: state ? state.swipeRound : 1 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { profile, destId, choice } = body ?? {};

  if (!PROFILES.includes(profile)) {
    return NextResponse.json({ error: 'invalid profile' }, { status: 400 });
  }

  // Admin-only: wipe every swipe from both travelers and start over at round 1.
  if (body.resetAll === true) {
    await prisma.swipe.deleteMany({});
    await prisma.appState.upsert({
      where: { id: 1 },
      create: { id: 1, swipeRound: 1 },
      update: { swipeRound: 1 },
    });
    return NextResponse.json({ ok: true });
  }

  // Next round: everyone left said yes, so clear those likes and swipe again.
  // Only advances from the round the phone saw, so two phones finishing at
  // once can't skip a round or wipe likes from the new one.
  if (Array.isArray(body.resetRound)) {
    const ids = body.resetRound.filter((id: unknown) => typeof id === 'string');
    const fromRound = Number(body.fromRound) || 1;
    const bumped = await prisma.appState.updateMany({ where: { id: 1, swipeRound: fromRound }, data: { swipeRound: fromRound + 1 } });
    if (bumped.count === 0) {
      const state = await prisma.appState.findUnique({ where: { id: 1 } });
      if (state) return NextResponse.json({ ok: true, advanced: false, round: state.swipeRound });
      await prisma.appState.create({ data: { id: 1, swipeRound: fromRound + 1 } });
    }
    await prisma.swipe.deleteMany({ where: { destId: { in: ids }, choice: 'like' } });
    return NextResponse.json({ ok: true, advanced: true, round: fromRound + 1 });
  }

  // Bring a swiped-out destination back into play.
  if (typeof body.restore === 'string') {
    await prisma.swipe.deleteMany({ where: { destId: body.restore, choice: 'nope' } });
    return NextResponse.json({ ok: true });
  }

  if (!destId || typeof destId !== 'string') {
    return NextResponse.json({ error: 'destId is required' }, { status: 400 });
  }

  if (!choice) {
    await prisma.swipe.deleteMany({ where: { profile, destId } });
    return NextResponse.json({ ok: true });
  }

  if (!CHOICES.includes(choice)) {
    return NextResponse.json({ error: 'invalid choice' }, { status: 400 });
  }

  await prisma.swipe.upsert({
    where: { profile_destId: { profile, destId } },
    create: { profile, destId, choice },
    update: { choice },
  });

  // The swiper sees the match on screen; let the partner know by push.
  if (choice === 'like') {
    const partner = partnerOf(profile);
    const partnerSwipe = await prisma.swipe.findUnique({ where: { profile_destId: { profile: partner, destId } } });
    if (partnerSwipe && partnerSwipe.choice === 'like') {
      const city = typeof body.city === 'string' ? body.city.slice(0, 60) : 'un destino';
      await logActivity('both', '', 'Es un match: ' + city, destId);
      sendToProfile(partner, {
        title: '¡Es un match!',
        body: 'Tú y ' + NAMES[profile] + ' quieren ir a ' + city + '.',
        tag: 'match-' + destId,
      }).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
