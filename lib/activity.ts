import { prisma } from '@/lib/db';

const KEEP = 200;

export async function logActivity(profile: string, emoji: string, text: string, destId?: string | null) {
  try {
    const row = await prisma.activity.create({
      data: { profile, emoji: emoji.slice(0, 8), text: text.slice(0, 140), destId: destId || null },
    });
    if (row.id % 25 === 0) await prisma.activity.deleteMany({ where: { id: { lte: row.id - KEEP } } });
  } catch (e) { /* the feed is best-effort */ }
}
