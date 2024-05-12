import { Route, Routes } from 'react-router-dom';

import LogApiPage from '../pages/LogAPI/index';
import DetailKioskLog from '../pages/LogAPI/Components/DetailKioskLog';
export default function LogAPIRouter() {
  return (
    <Routes>
      <Route path="/" element={<LogApiPage />}></Route>
      <Route path="/:deviceId" element={<DetailKioskLog />}></Route>
    </Routes>
  );
}
