import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic'; // For edge compatibility
interface PolicyPricingRow {
  Category: string;
  MinAmount: number | string;
  MaxAmount: number | string;
    ADLD?: number | string;
  EW1Year?: number | string;
  EW2Year?: number | string;
  EW3Year?: number | string;
  Combo1Year?: number | string;
}
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
      const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // 2) Parse into typed rows:
    const rows = XLSX.utils.sheet_to_json<PolicyPricingRow>(sheet, { defval: "" });

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("Invalid or empty Excel file.");
    }
//runbuild
    // const buffer = Buffer.from(await file.arrayBuffer());
    // const workbook = XLSX.read(buffer, { type: 'buffer' });
    // const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // const rows = XLSX.utils.sheet_to_json(sheet);

    // if (!rows || !Array.isArray(rows) || rows.length === 0) {
    //   throw new Error('Invalid or empty Excel file.');
    // }
        const records = rows.map((row) => ({
      category: row.Category,
      minAmount: Number(row.MinAmount),
      maxAmount: Number(row.MaxAmount),
        adld: row.ADLD ? Number(row.ADLD) : undefined,
      ew1Year: row.EW1Year ? Number(row.EW1Year) : undefined,
      ew2Year: row.EW2Year ? Number(row.EW2Year) : undefined,
      ew3Year: row.EW3Year ? Number(row.EW3Year) : undefined,
      combo1Year: row.Combo1Year ? Number(row.Combo1Year) : undefined,
      updatedAt:new Date(),
    }));
//runbuild
    // const records = (rows as any[]).map((row) => ({
    //   category: row['Category'],
    //   minAmount: parseInt(row['MinAmount']),
    //   maxAmount: parseInt(row['MaxAmount']),
    //   ew1Year: row['EW1Year'] ? parseInt(row['EW1Year']) : null,
    //   ew2Year: row['EW2Year'] ? parseInt(row['EW2Year']) : null,
    //   ew3Year: row['EW3Year'] ? parseInt(row['EW3Year']) : null,
    //   adld: row['ADLD'] ? parseInt(row['ADLD']) : null,
    //   combo1Year: row['Combo1Year'] ? parseInt(row['Combo1Year']) : null,
    // }));

    await prisma.policyPricing.createMany({ data: records });

    return NextResponse.json({ success: true, count: records.length });
  } catch (err: unknown) {
  if (err instanceof Error) {
    console.error('UPLOAD_POLICY_PRICING_ERROR:', err.message);
  } else {
    console.error('UPLOAD_POLICY_PRICING_ERROR:', err);
  }

  return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
}
}


export async function GET() {
  try {
    const categories = await prisma.policyPricing.findMany({
      distinct: ['category'],
      orderBy: { category: 'asc' },
      select: { category: true },
    });

   // return NextResponse.json(categories.map((item) => item.category));
        return NextResponse.json(categories);

  } catch (error) {
    console.error('FETCH_CATEGORIES_ERROR', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
