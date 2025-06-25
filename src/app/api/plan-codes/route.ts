// app/api/plan-codes/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const plans = await prisma.planCode.findMany()
  return NextResponse.json(plans)
}
export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('📦 Incoming Data:', body)

    const newPlan = await prisma.planCode.create({
      data: {
        planCode: body.planCode,
        name: body.name,
        type: body.type,
        minAmount: body.minAmount ? Number(body.minAmount) : null,
        maxAmount: body.maxAmount ? Number(body.maxAmount) : null,
        priceAmount: body.priceAmount ? Number(body.priceAmount) : null
      }
    })

    return NextResponse.json(newPlan, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating plan:', error)
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 })
  }
}
