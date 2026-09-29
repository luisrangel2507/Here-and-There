import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// { "<destId>": [[{ name }, ...], ...] }
export async function GET() {
  const rows = await prisma.itinerary.findMany();
  const map: Record<string, unknown> = {};
  for (const row of rows) map[row.destId] = row.days;
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const { destId, days } = (await req.json()) ?? {};
  if (typeof destId !== 'string' || !destId || !Array.isArray(days) || days.length > 60) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
  const clean = days.map((day: unknown) =>
    (Array.isArray(day) ? day : [])
      .filter((stop: any) => stop && typeof stop.name === 'string' && stop.name.trim())
      .slice(0, 30)
      .map((stop: any) => ({ name: stop.name.trim().slice(0, 120) })),
  );
  await prisma.itinerary.upsert({
    where: { destId },
    create: { destId, days: clean },
    update: { days: clean },
  });
  return NextResponse.json({ ok: true });
}
