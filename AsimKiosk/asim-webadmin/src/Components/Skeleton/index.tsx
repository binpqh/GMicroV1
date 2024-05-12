import React, { memo } from 'react';
import { Skeleton, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const SkeletonComponent = () => (
  <div className="flex flex-col gap-5 justify-center items-center	">
    <Skeleton active paragraph={{ rows: 6 }} />
    <Skeleton active paragraph={{ rows: 6 }} />
    <Skeleton active paragraph={{ rows: 6 }} />
    <Skeleton active paragraph={{ rows: 6 }} />

  </div>
);

export default memo(SkeletonComponent);
