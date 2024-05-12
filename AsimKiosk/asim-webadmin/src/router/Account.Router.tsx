import { Route, Routes } from 'react-router-dom';

import AccountPage from '../pages/Account';
import DetailAccount from '../pages/Account/component/DetailAccount';
import NotFound from '../CoreUI/NotFound';
export default function AccountRouter() {
  return (
    <Routes>
      <Route path="/" element={<AccountPage />}></Route>
      <Route path="/:userId" element={<DetailAccount />}></Route>
    </Routes>
  );
}
