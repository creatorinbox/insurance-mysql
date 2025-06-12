// app/api/import-insurances/route.ts
import { NextResponse } from 'next/server';
import { importInsuranceExcel } from '@/app/(admin)/(others-pages)/policies/actions';

export async function POST(req: Request) {
  const formData = await req.formData();
  try {
    await importInsuranceExcel(formData);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Import error:', err);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}
