import { Route, Routes } from 'react-router-dom';

import CameraManagement from '../pages/CameraManagement';

export default function CameraRouter() {
  return (
    <Routes>
      <Route path="/" element={<CameraManagement />}></Route>
      {/* <Route path="/:ticketId" element={<DetailCameraTicket />}></Route> */}
    </Routes>
  );
}
