import React from 'react';
import { Route, Routes } from 'react-router-dom';
const LocalSimConfig = React.lazy(() => import('../pages/LocalSimConfig'));

export default function LocalSimApiRouter() {
  return (
    <Routes>
      <Route path="/" element={<LocalSimConfig />}></Route>
    </Routes>
  );
}
