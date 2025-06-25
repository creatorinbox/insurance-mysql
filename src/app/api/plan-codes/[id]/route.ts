// app/api/plan-codes/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const plan = await prisma.planCode.findUnique({
    where: { id: parseInt(params.id) }
  })
  return NextResponse.json(plan)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const updated = await prisma.planCode.update({
    where: { id: parseInt(params.id) },
    data: body
  })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.planCode.delete({
    where: { id: parseInt(params.id) }
  })
  return new Response(null, { status: 204 })
}
