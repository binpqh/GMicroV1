import React, { Suspense } from 'react';
import { useParams } from 'react-router';
import Loading from '../../../CoreUI/loading';
import AccountInfo from './AccountInfo';
// const AccountInfo = React.lazy(() => import('./AccountInfo'));

export interface DetailAccount {}
export default function DetailAccount(props: DetailAccount) {
  const userId = useParams<{ userId: string }>().userId || '';

  return (
    <Suspense fallback={<Loading />}>
      <AccountInfo userId={userId} />
    </Suspense>
  );
}
