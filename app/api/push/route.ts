import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getVapidPublicKey } from '@/lib/push';
import { requireTraveler, isCtx } from '@/lib/trip';

export async function GET() {
  return NextResponse.json({ publicKey: await getVapidPublicKey() });
}

// Body: { subscription } to subscribe (trip/traveler come from headers), or
// { endpoint, unsubscribe: true }.
export async function POST(req: NextRequest) {
  const body = (await req.json()) ?? {};

  if (body.unsubscribe) {
    if (typeof body.endpoint === 'string') {
      await prisma.pushSubscription.deleteMany({ where: { endpoint: body.endpoint } });
    }
    return NextResponse.json({ ok: true });
  }

  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const { subscription } = body;
  const endpoint = subscription && subscription.endpoint;
  const keys = subscription && subscription.keys;
  if (typeof endpoint !== 'string' || !endpoint.startsWith('https://') || !keys || !keys.p256dh || !keys.auth) {
    return NextResponse.json({ error: 'invalid subscription' }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: { endpoint, tripId: ctx.tripId, travelerId: ctx.travelerId, keys: { p256dh: keys.p256dh, auth: keys.auth } },
    update: { tripId: ctx.tripId, travelerId: ctx.travelerId, keys: { p256dh: keys.p256dh, auth: keys.auth } },
  });
  return NextResponse.json({ ok: true });
}
