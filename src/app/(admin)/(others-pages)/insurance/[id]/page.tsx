import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface InsuranceDetailPageProps {
  params: { id: string };
}

export default async function InsuranceDetailPage({ params }: InsuranceDetailPageProps) {
  const insurance = await prisma.insurance.findUnique({
    where: { id: parseInt(params.id,10) },
  });

  if (!insurance) return notFound();

  // const policy = await prisma.policy.findUnique({
  //   where: { id: insurance.policyNumber },
  // });
const policy = await prisma.policyPricing.findFirst({
    where: {
      category: insurance.productName,
    minAmount: { lte: insurance.invoiceAmount ?? 0 },
maxAmount: { gte: insurance.invoiceAmount ?? 0 },
    },
  });
 type EWYear = "ew1Year" | "ew2Year" | "ew3Year" |"adld"|"combo1Year"; // etc.
const yearKey = insurance.policyType.toLowerCase() as EWYear;
const price = policy?.[yearKey] ?? "N/A";


  const dealer = await prisma.dealer.findUnique({
    where: { id: parseInt(insurance.dealerName,10) },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Insurance Details</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Insurance</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Product Name" value={insurance.productName} />
          <Field label="Invoice Amount" value={`₹ ${insurance.invoiceAmount}`} />
          <Field label="Due Amount" value={`₹ ${insurance.dueamount}`} />
          <Field label="Paid Status" value={insurance.paidstatus === "1" ? "Paid" : "Unpaid"} />
          <Field label="Policy Start" value={insurance.policyStartDate.toDateString()} />
          <Field label="Policy Expiry" value={insurance.expiryDate.toDateString()} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Policy</h2>
        {policy ? (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Policy Number" value={String(policy.id)} />
            <Field label="Type" value={String(price)} />
            <Field label="Category" value={policy.category} />
            {/* <Field label="Tier" value={policy.tier} />
            <Field label="Start Date" value={policy.startDate.toDateString()} />
            <Field label="Expiry Date" value={policy.expiryDate.toDateString()} /> */}
          </div>
        ) : (
          <p className="text-gray-600">No policy found for this insurance.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Dealer</h2>
        {dealer ? (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Dealer Name" value={dealer.dealerName} />
            <Field label="Location" value={dealer.dealerLocation} />
            <Field label="Dealer Code" value={dealer.dealerCode} />
            <Field label="Business Partner" value={dealer.businessPartnerName} />
            <Field label="Status" value={dealer.status} />
          </div>
        ) : (
          <p className="text-gray-600">No dealer found for this insurance.</p>
        )}
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  );
}
