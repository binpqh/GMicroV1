import { Route, Routes } from 'react-router-dom';
import InventoryManagement from '../pages/InventoryManagement';
import DetailInventoryTicket from '../pages/InventoryManagement/DetailInventory';

export default function InventoryRouter() {
  return (
    <Routes>
      <Route path="/" element={<InventoryManagement />}></Route>

      <Route path="/:kioskId" element={<InventoryManagement />}></Route>

      <Route
        path="/ticket/:ticketId"
        element={<DetailInventoryTicket />}
      ></Route>
    </Routes>
  );
}
