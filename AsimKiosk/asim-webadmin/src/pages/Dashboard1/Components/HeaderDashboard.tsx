import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';

import PartnerApi from '../../../service/Partner.service';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../../apps/hooks';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';

const SearchDetail = React.lazy(() => import('../../../Components/searchDetail/SearchDetail'));
const SearchInput = React.lazy(() => import('../../../Components/searchDetail/index1'));
const { confirm } = Modal;
export interface HeaderDashboard {}

export default function HeaderDashboard(props: HeaderDashboard) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleCleanCache = async () => {
    try {
      dispatch(setLoading(true));
      await PartnerApi.clearCache();
      dispatch(setLoading(false));
      toast.success('Xoá Cache Danh Sách Vé Thành Công !');
    } catch (error) {
      toast.success('Xoá Cache Danh Sách Vé Thất Bại !');
      console.log('error', error);
    }
  };

  const showDeleteConfirm = (title: string, desc: string) => {
    confirm({
      title: title,
      icon: <ExclamationCircleFilled style={{ fontSize: '22px', color: 'red' }} />,
      content: desc,
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      cancelButtonProps: { type: 'default' },
      autoFocusButton: 'cancel',
      onOk() {
        {
          handleCleanCache();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <div className="w-full flex justify-between items-center flex-wrap lg:flex-nowrap gap-3  sm:gap-5  ">
      <div className="w-full xl:w-2/5 flex justify-between flex-wrap items-center  gap-1 sm:gap-4  md:gap-5">
        <h1 className="font-bold text-2xl md:text-3xl">{t('dashboard.title')}</h1>
        <Button
          // danger
          className="bg-cyan-500 hover:bg-cyan-400 py-0 px-3 flex text-base items-center text-white  "
          size="large"
          shape="round"
          icon={<DeleteOutlined />}
          onClick={() => {
            showDeleteConfirm(
              `Xóa Cache Danh Sách Vé`,
              'Hành động này sẽ xoá vĩnh viễn Cache danh sách vé. Bạn chắc chắn muốn xoá ?'
            );
          }}
        >
          Xóa Cache Vé
        </Button>
      </div>
      <div className="w-full xl:w-4/6">
        {/* <SearchDetail numberGet={15} /> */}
        <SearchInput numberGet={15} placeholder={`Nhập mã đơn hàng`}></SearchInput>
      </div>
    </div>
  );
}
