import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const MAX_DATA_URL_LENGTH = 8_000_000; // ~6MB image, generous over the client-side compressed size

export async function GET() {
  const rows = await prisma.photo.findMany();
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.dataUrl;
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { key, dataUrl } = body ?? {};

  if (!key || typeof key !== 'string') {
    return NextResponse.json({ error: 'key is required' }, { status: 400 });
  }

  if (!dataUrl) {
    await prisma.photo.deleteMany({ where: { key } });
    return NextResponse.json({ ok: true });
  }

  if (
    typeof dataUrl !== 'string' ||
    !dataUrl.startsWith('data:image/') ||
    dataUrl.length > MAX_DATA_URL_LENGTH
  ) {
    return NextResponse.json({ error: 'invalid photo' }, { status: 400 });
  }

  await prisma.photo.upsert({
    where: { key },
    create: { key, dataUrl },
    update: { dataUrl },
  });

  return NextResponse.json({ ok: true });
}
