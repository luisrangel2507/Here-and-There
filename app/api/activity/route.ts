import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logActivity } from '@/lib/activity';
import { PROFILES } from '@/lib/push';

export async function GET() {
  const rows = await prisma.activity.findMany({ orderBy: { id: 'desc' }, take: 30 });
  return NextResponse.json(rows.map(r => ({
    id: r.id, profile: r.profile, emoji: r.emoji, text: r.text, destId: r.destId, at: r.createdAt.getTime(),
  })));
}

export async function POST(req: NextRequest) {
  const { profile, emoji, text, destId } = (await req.json()) ?? {};
  if (!PROFILES.includes(profile) || typeof emoji !== 'string' || typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
  await logActivity(profile, emoji, text.trim(), typeof destId === 'string' ? destId : null);
  return NextResponse.json({ ok: true });
}
