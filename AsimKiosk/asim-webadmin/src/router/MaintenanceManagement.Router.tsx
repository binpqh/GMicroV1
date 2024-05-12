import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import MaintenanceManagement from '../pages/MaintenanceManagement';

export default function MaintenanceManagementRouter() {
  return (
    <Routes>
      <Route path="/" element={<MaintenanceManagement />}></Route>
    </Routes>
  );
}
