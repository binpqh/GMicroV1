import React from 'react';

const BodyDashboard = React.lazy(() => import('./Components/BodyDashboard'));
const HeaderDashboard = React.lazy(
  () => import('./Components/HeaderDashboard')
);

export interface DashBoard {}

export default function DashBoard(props: DashBoard) {
  return (
    <div className=" ">
      <HeaderDashboard />
      <BodyDashboard />
    </div>
  );
}
