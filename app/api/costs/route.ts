import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const rows = await prisma.destinationCosts.findMany();
  const map: Record<string, unknown> = {};
  for (const row of rows) map[row.destId] = row.costs;
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { destId, costs } = body ?? {};

  if (!destId || typeof destId !== 'string' || typeof costs !== 'object' || costs === null) {
    return NextResponse.json({ error: 'destId and costs are required' }, { status: 400 });
  }

  await prisma.destinationCosts.upsert({
    where: { destId },
    create: { destId, costs },
    update: { costs },
  });

  return NextResponse.json({ ok: true });
}
