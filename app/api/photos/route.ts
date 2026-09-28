import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cloudinary, publicIdForKey } from '@/lib/cloudinary';
import { requireTraveler, isCtx } from '@/lib/trip';

const MAX_DATA_URL_LENGTH = 8_000_000; // ~6MB image, generous over the client-side compressed size

export async function GET(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const destId = req.nextUrl.searchParams.get('destId');
  const rows = destId
    ? await prisma.photo.findMany({ where: { tripId: ctx.tripId, key: { startsWith: 'dest:' + destId + ':' } } })
    : await prisma.photo.findMany({ where: { tripId: ctx.tripId } });
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.dataUrl;
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const ctx = await requireTraveler(req);
  if (!isCtx(ctx)) return ctx;

  const body = await req.json();
  const { key, dataUrl } = body ?? {};

  if (!key || typeof key !== 'string') {
    return NextResponse.json({ error: 'key is required' }, { status: 400 });
  }

  if (!dataUrl) {
    await prisma.photo.deleteMany({ where: { tripId: ctx.tripId, key } });
    try {
      await cloudinary.uploader.destroy(publicIdForKey(ctx.tripId, key));
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

  // Prefer Cloudinary (fast, cached), but never block a save on it — if it's
  // not configured yet or the upload fails, fall back to storing the photo
  // directly, same as before Cloudinary was wired in.
  let storedUrl = dataUrl;
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const uploaded = await cloudinary.uploader.upload(dataUrl, {
        public_id: publicIdForKey(ctx.tripId, key),
        overwrite: true,
        invalidate: true,
      });
      storedUrl = uploaded.secure_url;
    } catch (e) { /* fall back to storing dataUrl directly below */ }
  }

  await prisma.photo.upsert({
    where: { tripId_key: { tripId: ctx.tripId, key } },
    create: { tripId: ctx.tripId, key, dataUrl: storedUrl },
    update: { dataUrl: storedUrl },
  });

  return NextResponse.json({ ok: true, url: storedUrl });
}
