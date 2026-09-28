import { prisma } from '@/lib/db';

const KEEP_PER_TRIP = 200;

// travelerId is null for a shared/system event (a match, the final winner).
export async function logActivity(tripId: string, travelerId: string | null, emoji: string, text: string, destId?: string | null) {
  try {
    await prisma.activity.create({
      data: { tripId, travelerId, emoji: emoji.slice(0, 8), text: text.slice(0, 140), destId: destId || null },
    });
    const total = await prisma.activity.count({ where: { tripId } });
    if (total > KEEP_PER_TRIP) {
      const stale = await prisma.activity.findMany({
        where: { tripId },
        orderBy: { id: 'desc' },
        skip: KEEP_PER_TRIP,
        take: 1,
        select: { id: true },
      });
      if (stale[0]) await prisma.activity.deleteMany({ where: { tripId, id: { lte: stale[0].id } } });
    }
  } catch (e) { /* the feed is best-effort */ }
}
