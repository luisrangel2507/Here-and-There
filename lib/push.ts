import webpush from 'web-push';
import { prisma } from '@/lib/db';

let vapidReady: Promise<string> | null = null;

// Returns the VAPID public key, creating and storing a key pair the first
// time. One key pair is shared across every trip.
export function getVapidPublicKey(): Promise<string> {
  if (!vapidReady) {
    vapidReady = (async () => {
      let row = await prisma.pushConfig.findUnique({ where: { id: 1 } });
      if (!row) {
        const keys = webpush.generateVAPIDKeys();
        row = await prisma.pushConfig.upsert({
          where: { id: 1 },
          create: { id: 1, publicKey: keys.publicKey, privateKey: keys.privateKey },
          update: {},
        });
      }
      webpush.setVapidDetails('mailto:hello@here-and-there.app', row.publicKey, row.privateKey);
      return row.publicKey;
    })().catch((e) => { vapidReady = null; throw e; });
  }
  return vapidReady;
}

export type PushPayload = { title: string; body: string; tag?: string };

async function send(sub: { endpoint: string; keys: unknown }, payload: PushPayload) {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: sub.keys as { p256dh: string; auth: string } },
      JSON.stringify({ ...payload, url: '/' }),
    );
  } catch (e: any) {
    // The device unsubscribed or the subscription expired.
    if (e && (e.statusCode === 404 || e.statusCode === 410)) {
      await prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } }).catch(() => {});
    }
  }
}

// Notifies everyone in the trip except the traveler who triggered the event.
export async function notifyOthers(tripId: string, exceptTravelerId: string, payload: PushPayload) {
  await getVapidPublicKey();
  const subs = await prisma.pushSubscription.findMany({
    where: { tripId, travelerId: { not: exceptTravelerId } },
  });
  await Promise.all(subs.map(sub => send(sub, payload)));
}
