import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import DetailGroup from '../pages/GroupManagement/DetailGroup';
import GroupManagement from '../pages/GroupManagement/index1';

export default function GroupManagementRouter() {
  return (
    <Routes>
      <Route path="/" element={<GroupManagement />}></Route>
      <Route path="/:groupId" element={<DetailGroup />}></Route>
    </Routes>
  );
}
