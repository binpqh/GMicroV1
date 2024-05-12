import { Layout, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { Suspense } from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { useAppSelector } from '../../apps/hooks';
import Forbidden from '../Forbidden';
import { isForbidden } from '../../apps/Feature/Forbiden403/forbidenSlice';

const FooterV1 = React.lazy(() => import('../FooterV1'));
const HeaderV1 = React.lazy(() => import('../HeaderV1'));
const SiderV1 = React.lazy(() => import('../SiderV1'));
const SkeletonComponent = React.lazy(
  () => import('../../Components/Skeleton/index')
);
export interface PageContentV1Props {}
export default function PageContentV1({}: PageContentV1Props) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // collapsedWidth={window.innerWidth > 1200 ? '80' : '60'}
  // width={window.innerWidth > 769 ? '250' : '0'}

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <SiderV1 collapsed1={collapsed} />
      <Layout
        className={`site-layout  transition-all	 ease-linear duration-[10]
        ${
          collapsed
            ? window.innerWidth > 1200
              ? 'ml-[80px]'
              : 'ml-[60px]'
            : window.innerWidth > 769
            ? 'ml-[250px]'
            : ''
        }
        `}
      >
        <HeaderV1 collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="my-0   mx-3 xl:mx-4  2xl:mx-5">
          <Outlet />
        </Content>
        <FooterV1 />
      </Layout>
    </Suspense>
  );
}
