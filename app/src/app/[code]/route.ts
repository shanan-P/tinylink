import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code;

  const link = await prisma.link.findUnique({
    where: { code }
  });

  if (!link) {
    return new NextResponse("Not Found", { status: 404 });
  }

  await prisma.link.update({
    where: { id: link.id },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date()
    }
  });

  return NextResponse.redirect(link.url, 302);
}