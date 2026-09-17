import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cloudinary, publicIdForKey } from '@/lib/cloudinary';

// One-time migration: move any photo still stored as a raw data URL
// (uploaded before Cloudinary was wired in) onto Cloudinary too, so old
// photos get the same fast, cached loading as new ones.
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (key !== 'aguacate9') {
    return NextResponse.json({ error: 'not authorized' }, { status: 401 });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json({ error: 'Cloudinary is not configured yet' }, { status: 400 });
  }

  const rows = await prisma.photo.findMany({
    where: { dataUrl: { startsWith: 'data:image/' } },
  });

  let migrated = 0;
  const failed: string[] = [];

  for (const row of rows) {
    try {
      const uploaded = await cloudinary.uploader.upload(row.dataUrl, {
        public_id: publicIdForKey(row.key),
        overwrite: true,
        invalidate: true,
      });
      await prisma.photo.update({
        where: { key: row.key },
        data: { dataUrl: uploaded.secure_url },
      });
      migrated++;
    } catch (e) {
      failed.push(row.key);
    }
  }

  return NextResponse.json({ total: rows.length, migrated, failed });
}
