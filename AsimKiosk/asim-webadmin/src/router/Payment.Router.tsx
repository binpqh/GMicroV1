import React from 'react';
import { Route, Routes } from 'react-router-dom';
const Payment = React.lazy(() => import('../pages/Payment'));

export default function PaymentRouter() {
  return (
    <Routes>
      <Route path="/" element={<Payment />}></Route>
    </Routes>
  );
}
