import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const rows = await prisma.destinationLodging.findMany();
  const map: Record<string, unknown> = {};
  for (const row of rows) map[row.destId] = row.lodging;
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { destId, lodging } = body ?? {};

  if (!destId || typeof destId !== 'string' || !Array.isArray(lodging)) {
    return NextResponse.json({ error: 'destId and lodging are required' }, { status: 400 });
  }

  await prisma.destinationLodging.upsert({
    where: { destId },
    create: { destId, lodging },
    update: { lodging },
  });

  return NextResponse.json({ ok: true });
}
