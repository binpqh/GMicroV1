import { Route, Routes } from 'react-router-dom';
import SelfInfo from '../pages/Self';

export default function SelfRouter() {
  return (
    <Routes>
      <Route path="/" element={<SelfInfo />}></Route>
    </Routes>
  );
}
