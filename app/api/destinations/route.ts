import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const rows = await prisma.customDestinations.findMany();
  const map: Record<string, unknown> = {};
  for (const row of rows) map[row.region] = row.destinations;
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { region, destinations } = body ?? {};

  if (!region || typeof region !== 'string' || !Array.isArray(destinations)) {
    return NextResponse.json({ error: 'region and destinations are required' }, { status: 400 });
  }

  await prisma.customDestinations.upsert({
    where: { region },
    create: { region, destinations },
    update: { destinations },
  });

  return NextResponse.json({ ok: true });
}
