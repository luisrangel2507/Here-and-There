import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cloudinary, publicIdForKey } from '@/lib/cloudinary';

// One-time migration: move any photo still stored as a raw data URL
// (uploaded before Cloudinary was wired in) onto Cloudinary too, so old
// photos get the same fast, cached loading as new ones.
//
// Runs in the background instead of making the request wait for every
// upload to finish — a slow phone connection or a proxy timeout would
// otherwise kill the request before it completes. Progress is tracked
// in memory; call again with &status=1 to check on it.

type Progress = { running: boolean; total: number; migrated: number; failed: string[] };
const progress: Progress = { running: false, total: 0, migrated: 0, failed: [] };

async function runMigration() {
  progress.running = true;
  progress.migrated = 0;
  progress.failed = [];

  const rows = await prisma.photo.findMany({
    where: { dataUrl: { startsWith: 'data:image/' } },
  });
  progress.total = rows.length;

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
      progress.migrated++;
    } catch (e) {
      progress.failed.push(row.key);
    }
  }

  progress.running = false;
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (key !== 'aguacate9') {
    return NextResponse.json({ error: 'not authorized' }, { status: 401 });
  }

  if (req.nextUrl.searchParams.get('status')) {
    return NextResponse.json(progress);
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json({ error: 'Cloudinary is not configured yet' }, { status: 400 });
  }

  if (progress.running) {
    return NextResponse.json({ ...progress, note: 'already running' });
  }

  runMigration().catch(() => { progress.running = false; });

  return NextResponse.json({ status: 'started', note: 'add &status=1 to this URL to check progress' });
}
