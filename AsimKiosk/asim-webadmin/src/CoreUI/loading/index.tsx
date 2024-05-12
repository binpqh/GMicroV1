import { Spin } from 'antd';
import { useState } from 'react';
import './loading.scss';
export default function Loading() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [open, setOpen] = useState(true);
  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="h-full fixed overscroll-y-none  bg-[rgba(17,17,17,0.7)] z-[100000000] inset-0 flex  ">
      <Spin
        size="large"
        className="loading  w-full opacity-100 my-auto  "
        // tip="Loading..."
        // fullscreen
      ></Spin>
    </div>
  );
}
