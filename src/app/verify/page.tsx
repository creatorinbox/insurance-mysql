// app/verify/page.tsx
import { Suspense } from 'react';
import OtpVerifyClient from './OtpVerifyClient';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <OtpVerifyClient />
    </Suspense>
  );
}
