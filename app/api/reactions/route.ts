import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PROFILES } from '@/lib/push';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const REACTIONS = ['love', 'maybe', 'nope'];

// { luis: { "<destId>|<name>": reaction }, eleny: {...} }
export async function GET() {
  const rows = await prisma.reaction.findMany();
  const map: Record<string, Record<string, string>> = { luis: {}, eleny: {} };
  for (const row of rows) {
    if (map[row.profile]) map[row.profile][row.destId + '|' + row.name] = row.reaction;
  }
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const { profile, destId, name, reaction, city } = (await req.json()) ?? {};
  if (!PROFILES.includes(profile) || typeof destId !== 'string' || typeof name !== 'string' || !destId || !name) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
  if (!reaction) {
    await prisma.reaction.deleteMany({ where: { profile, destId, name } });
    return NextResponse.json({ ok: true });
  }
  if (!REACTIONS.includes(reaction)) {
    return NextResponse.json({ error: 'invalid reaction' }, { status: 400 });
  }
  await prisma.reaction.upsert({
    where: { profile_destId_name: { profile, destId, name } },
    create: { profile, destId, name, reaction },
    update: { reaction },
  });
  if (reaction === 'love') {
    await logActivity(profile, '', 'loved ' + name + (typeof city === 'string' && city ? ' in ' + city : ''), destId);
  }
  return NextResponse.json({ ok: true });
}
