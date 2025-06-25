import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'


export async function GET(request: Request, context: { params: { id: string } }) {
  const id = parseInt(context.params.id, 10)
  const policy = await prisma.policyPricing.findUnique({
    where: { id }
  })
  return NextResponse.json(policy)
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()

  try {

      const updated = await prisma.policyPricing.update({
    where: { id: parseInt(params.id) },
    data: body
  })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating policy:", error)
    return NextResponse.json(
      { error: "Failed to update policy" },
      { status: 500 }
    )
  }
}
