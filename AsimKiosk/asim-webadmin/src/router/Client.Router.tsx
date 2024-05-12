import React from 'react';
import { Route, Routes } from 'react-router-dom';
const ClientPage = React.lazy(() => import('../pages/ClientPage'));
const DetailKiosk = React.lazy(
  () => import('../pages/ClientPage/Components/DetailKiosk/DetailKiosk')
);

export default function ClientRouter() {
  return (
    <Routes>
      <Route path="/" element={<ClientPage />}></Route>
      <Route path="/:kioskId" element={<DetailKiosk />}></Route>
    </Routes>
  );
}
