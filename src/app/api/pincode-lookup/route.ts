import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { pincode } = await req.json();

  if (!pincode || pincode.length !== 6) {
    return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 });
  }

  const location = await prisma.indiaLocation.findFirst({
    where: { pincode },
    select: { city: true, state: true }
  });

  if (!location) {
    return NextResponse.json({ error: 'Pincode not found' }, { status: 404 });
  }

  return NextResponse.json(location);
}
