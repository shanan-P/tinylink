import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { url, code } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (code) {
      const codeRegex = /^[A-Za-z0-9]{6,8}$/;
      if (!codeRegex.test(code)) {
        return NextResponse.json({ error: "Invalid code format. Must be 6-8 alphanumeric characters." }, { status: 422 });
      }

      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing) {
        return NextResponse.json({ error: "Code already in use" }, { status: 409 });
      }
    } else {
      code = nanoid(6); 
    }

    const newLink = await prisma.link.create({
      data: { url, code }
    });

    return NextResponse.json(newLink, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(links);
}