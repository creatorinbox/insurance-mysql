// app/customer/page.tsx
import { Suspense } from "react";
import CustomerClient from "./CustomerClient";

export default function CustomerPage() {
  return (
    <Suspense fallback={<div>Loading customer data...</div>}>
      <CustomerClient />
    </Suspense>
  );
}
