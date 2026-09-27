import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getVapidPublicKey, PROFILES } from '@/lib/push';

export async function GET() {
  return NextResponse.json({ publicKey: await getVapidPublicKey() });
}

// Body: { profile, subscription } to subscribe, or { endpoint, unsubscribe: true }.
export async function POST(req: NextRequest) {
  const body = (await req.json()) ?? {};

  if (body.unsubscribe) {
    if (typeof body.endpoint === 'string') {
      await prisma.pushSubscription.deleteMany({ where: { endpoint: body.endpoint } });
    }
    return NextResponse.json({ ok: true });
  }

  const { profile, subscription } = body;
  if (!PROFILES.includes(profile)) {
    return NextResponse.json({ error: 'invalid profile' }, { status: 400 });
  }
  const endpoint = subscription && subscription.endpoint;
  const keys = subscription && subscription.keys;
  if (typeof endpoint !== 'string' || !endpoint.startsWith('https://') || !keys || !keys.p256dh || !keys.auth) {
    return NextResponse.json({ error: 'invalid subscription' }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: { endpoint, profile, keys: { p256dh: keys.p256dh, auth: keys.auth } },
    update: { profile, keys: { p256dh: keys.p256dh, auth: keys.auth } },
  });
  return NextResponse.json({ ok: true });
}
