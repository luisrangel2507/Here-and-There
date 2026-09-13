import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const row = await prisma.appState.findUnique({ where: { id: 1 } });
  if (!row) return NextResponse.json(null);
  return NextResponse.json({
    priorityOrder: row.priorityOrder,
    blockedIds: row.blockedIds,
    hiddenIds: row.hiddenIds,
    profileInfo: row.profileInfo,
    adminPickId: row.adminPickId,
    lastSubmitAt: row.lastSubmitAt ? row.lastSubmitAt.getTime() : null,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { priorityOrder, blockedIds, hiddenIds, profileInfo, adminPickId, lastSubmitAt } = body ?? {};

  const row = await prisma.appState.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      priorityOrder: priorityOrder ?? [],
      blockedIds: blockedIds ?? [],
      hiddenIds: hiddenIds ?? [],
      profileInfo: profileInfo ?? {},
      adminPickId: adminPickId ?? null,
      lastSubmitAt: lastSubmitAt ? new Date(lastSubmitAt) : null,
    },
    update: {
      priorityOrder: priorityOrder ?? [],
      blockedIds: blockedIds ?? [],
      hiddenIds: hiddenIds ?? [],
      profileInfo: profileInfo ?? {},
      adminPickId: adminPickId ?? null,
      lastSubmitAt: lastSubmitAt ? new Date(lastSubmitAt) : null,
    },
  });

  return NextResponse.json({ ok: true, updatedAt: row.updatedAt });
}
