'use server';

import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
// 1) Define the shape of each row in the Excel sheet:
interface InsuranceRow {
  id: string;
  mobile: string;
  kitNumber: string;
  policyType: string;
  policyHolder: string;
  productName: string;
  productId: string;
  tier: string;
  certificateNo: string;
  policyNumber: string;
  policyStartDate: string;
  expiryDate: string;
  policyStatus: string;
  make: string;
  modelNo: string;
  invoiceDate: string;
  invoiceAmount: string;
  invoiceNo: string;
  imeiNumber: string;
  salesChannel: string;
  dealerName: string;
  dealerLocation: string;
  dealerCode: string;
  vas: string;
  businessPartnerName: string;
  businessPartnerCategory: string;
  lanNumber: string;
  policyBookingDate: string;
  membershipFees: string;
  brokerDetails: string;
  locationCode: string;
  loanApiIntegration: string;
  userId: string;
  dueamount: string;
  paidstatus: string;
  createdAt: string;
  updatedAt: string;
}
export async function exportInsuranceExcel(): Promise<string> {
  //const insurances = await prisma.insurance.findMany();
  // ✅ Filter records before exporting
    const insurances = await prisma.insurance.findMany();

  const filteredInsurances = insurances.filter(
    (p) => p.paidstatus === 'PAID' && (!p.policyNumber || p.policyNumber.trim() === '')
  );
  const sheetData = filteredInsurances.map((p) => ({
    id: p.id,
    mobile: p.mobile,
    kitNumber: p.kitNumber,
    policyType: p.policyType,
    policyHolder: p.policyHolder,
    productName: p.productName,
    productId: p.productId,
    tier: p.tier,
    certificateNo: p.certificateNo,
    policyNumber: p.policyNumber,
    policyStartDate: p.policyStartDate.toISOString(),
    expiryDate: p.expiryDate.toISOString(),
    policyStatus: p.policyStatus,
    make: p.make,
    modelNo: p.modelNo,
    invoiceDate: p.invoiceDate.toISOString(),
    invoiceAmount: p.invoiceAmount,
    invoiceNo: p.invoiceNo,
    imeiNumber: p.imeiNumber,
    salesChannel: p.salesChannel,
    dealerName: p.dealerName,
    dealerLocation: p.dealerLocation,
    dealerCode: p.dealerCode,
    vas: p.vas,
    businessPartnerName: p.businessPartnerName,
    businessPartnerCategory: p.businessPartnerCategory,
    lanNumber: p.lanNumber,
    policyBookingDate: p.policyBookingDate.toISOString(),
    membershipFees: p.membershipFees,
    brokerDetails: p.brokerDetails,
    locationCode: p.locationCode,
    loanApiIntegration: p.loanApiIntegration,
    userId: p.userId,
    dueamount: p.dueamount,
    paidstatus: p.paidstatus,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Insurances');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  const exportDir = join(process.cwd(), 'public', 'exports');
  if (!existsSync(exportDir)) {
    await mkdir(exportDir, { recursive: true });
  }

  const filePath = join(exportDir, 'insurances.xlsx');
  await writeFile(filePath, buffer);

  return '/exports/insurances.xlsx';
}

export async function importInsuranceExcel(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file uploaded');

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<InsuranceRow>(sheet);

  if (!json || !Array.isArray(json)) {
    throw new Error('Invalid Excel data. Could not parse to JSON.');
  }

  for (const item of json) {
    if (!item.id) continue;

    await prisma.insurance.upsert({
      where: { id: item.id },
      update: {
        mobile: item.mobile,
        kitNumber: item.kitNumber,
        policyType: item.policyType,
        policyHolder: item.policyHolder,
        productName: item.productName,
        productId: item.productId,
        tier: item.tier,
        certificateNo: item.certificateNo,
        policyNumber: item.policyNumber,
        policyStartDate: new Date(item.policyStartDate),
        expiryDate: new Date(item.expiryDate),
        policyStatus: item.policyStatus,
        make: item.make,
        modelNo: item.modelNo,
        invoiceDate: new Date(item.invoiceDate),
        invoiceAmount: parseFloat(item.invoiceAmount),
        invoiceNo: item.invoiceNo,
        imeiNumber: item.imeiNumber,
        salesChannel: item.salesChannel,
        dealerName: item.dealerName,
        dealerLocation: item.dealerLocation,
        dealerCode: item.dealerCode,
        vas: item.vas,
        businessPartnerName: item.businessPartnerName,
        businessPartnerCategory: item.businessPartnerCategory,
        lanNumber: item.lanNumber,
        policyBookingDate: new Date(item.policyBookingDate),
        membershipFees: item.membershipFees,
        brokerDetails: item.brokerDetails,
        locationCode: item.locationCode,
        loanApiIntegration: item.loanApiIntegration,
        userId: item.userId,
        dueamount: parseFloat(item.dueamount),
        paidstatus: item.paidstatus,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      },
      create: {
        id: item.id,
        mobile: item.mobile,
        kitNumber: item.kitNumber,
        policyType: item.policyType,
        policyHolder: item.policyHolder,
        productName: item.productName,
        productId: item.productId,
        tier: item.tier,
        certificateNo: item.certificateNo,
        policyNumber: item.policyNumber,
        policyStartDate: new Date(item.policyStartDate),
        expiryDate: new Date(item.expiryDate),
        policyStatus: item.policyStatus,
        make: item.make,
        modelNo: item.modelNo,
        invoiceDate: new Date(item.invoiceDate),
        invoiceAmount:  parseFloat(item.invoiceAmount),
        invoiceNo: item.invoiceNo,
        imeiNumber: item.imeiNumber,
        salesChannel: item.salesChannel,
        dealerName: item.dealerName,
        dealerLocation: item.dealerLocation,
        dealerCode: item.dealerCode,
        vas: item.vas,
        businessPartnerName: item.businessPartnerName,
        businessPartnerCategory: item.businessPartnerCategory,
        lanNumber: item.lanNumber,
        policyBookingDate: new Date(item.policyBookingDate),
        membershipFees: item.membershipFees,
        brokerDetails: item.brokerDetails,
        locationCode: item.locationCode,
        loanApiIntegration: item.loanApiIntegration,
        userId: item.userId,
        dueamount:  parseFloat(item.dueamount),
        paidstatus: item.paidstatus,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      },
    });
  }
}
