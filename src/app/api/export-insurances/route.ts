// app/api/export-insurances/route.ts
import { exportInsuranceExcel } from '@/app/(admin)/(others-pages)/policies/actions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = await exportInsuranceExcel();
    return NextResponse.json({ url });
  } catch  {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
