import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import DashBoard from '../pages/Dashboard1';

export default function DashboardRouter() {
  return (
    <Routes>
      <Route path="/" element={<DashBoard />}></Route>
    </Routes>
  );
}
