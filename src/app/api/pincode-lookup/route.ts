import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { pincode } = await req.json();

  if (!pincode || pincode.length !== 6) {
    return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 });
  }

  // Fetch all cities with the provided pincode
  const results = await prisma.indiaLocation.findMany({
    where: { pincode: parseInt(pincode, 10) },
    select: { city: true, state: true },
  });

  if (!results || results.length === 0) {
    return NextResponse.json({ error: 'Pincode not found' }, { status: 404 });
  }

  // Collect unique cities
  const cities = Array.from(new Set(results.map((r) => r.city)));
  const state = results[0].state;

  return NextResponse.json({ cities, state });
}
