import { Suspense, lazy } from 'react';
import { useParams } from 'react-router';
import InventoryInfo from '../Components/InventoryInfo';
const SkeletonComponent = lazy(() => import('../../../Components/Skeleton'));
export interface IDetailInventoryTicketProps {}

export default function DetailInventoryTicket(
  props: IDetailInventoryTicketProps
) {
  const ticketId = useParams<{ ticketId: string }>().ticketId || '';
  // console.log('ticketId', ticketId);
  return (
    <Suspense fallback={<SkeletonComponent />}>
      <InventoryInfo ticketId={ticketId} />
    </Suspense>
  );
}
