import { Route, Routes } from 'react-router-dom';

import ReportPage from '../pages/ReportPage';
export default function ReportRouter() {
  return (
    <Routes>
      <Route path="/" element={<ReportPage />}></Route>
    </Routes>
  );
}
