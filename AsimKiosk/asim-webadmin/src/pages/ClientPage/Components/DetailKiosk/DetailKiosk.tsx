import React, { Suspense } from 'react';
import { useParams } from 'react-router';

const KioskInfo = React.lazy(() => import('./KioskInfo'));
const LogKiosk = React.lazy(() => import('./LogKiosk'));
const SkeletonComponent = React.lazy(
  () => import('../../../../Components/Skeleton')
);
export interface DetailKiosk {}

export default function DetailKiosk(props: DetailKiosk) {
  const kioskId = useParams<{ kioskId: string }>().kioskId || '';

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <KioskInfo kioskId={kioskId} />

      {/* <LogKiosk kioskId={kioskId} /> */}
    </Suspense>
  );
}
