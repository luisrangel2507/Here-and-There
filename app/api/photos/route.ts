import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cloudinary, publicIdForKey } from '@/lib/cloudinary';

const MAX_DATA_URL_LENGTH = 8_000_000; // ~6MB image, generous over the client-side compressed size

export async function GET(req: NextRequest) {
  const destId = req.nextUrl.searchParams.get('destId');
  const rows = destId
    ? await prisma.photo.findMany({ where: { key: { startsWith: 'dest:' + destId + ':' } } })
    : await prisma.photo.findMany();
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
    try {
      await cloudinary.uploader.destroy(publicIdForKey(key));
    } catch (e) { /* best-effort cleanup */ }
    return NextResponse.json({ ok: true });
  }

  if (
    typeof dataUrl !== 'string' ||
    !dataUrl.startsWith('data:image/') ||
    dataUrl.length > MAX_DATA_URL_LENGTH
  ) {
    return NextResponse.json({ error: 'invalid photo' }, { status: 400 });
  }

  let hostedUrl: string;
  try {
    const uploaded = await cloudinary.uploader.upload(dataUrl, {
      public_id: publicIdForKey(key),
      overwrite: true,
      invalidate: true,
    });
    hostedUrl = uploaded.secure_url;
  } catch (e) {
    return NextResponse.json({ error: 'upload failed' }, { status: 502 });
  }

  await prisma.photo.upsert({
    where: { key },
    create: { key, dataUrl: hostedUrl },
    update: { dataUrl: hostedUrl },
  });

  return NextResponse.json({ ok: true, url: hostedUrl });
}
