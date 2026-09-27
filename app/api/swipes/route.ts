import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const PROFILES = ['luis', 'eleny'];
const CHOICES = ['like', 'nope'];

export async function GET() {
  const rows = await prisma.swipe.findMany();
  const map: Record<string, Record<string, string>> = { luis: {}, eleny: {} };
  for (const row of rows) {
    if (map[row.profile]) map[row.profile][row.destId] = row.choice;
  }
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { profile, destId, choice, reset } = body ?? {};

  if (!PROFILES.includes(profile)) {
    return NextResponse.json({ error: 'invalid profile' }, { status: 400 });
  }

  if (reset) {
    await prisma.swipe.deleteMany({ where: { profile } });
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

  return NextResponse.json({ ok: true });
}
