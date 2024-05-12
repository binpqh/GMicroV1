import { lazy, memo, useState } from 'react';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../../apps/hooks';
import {
  TKioskListDropDown,
  TKioskListDropDownInventory,
} from '../../../interface';

import { CheckOutlined } from '@ant-design/icons';
import { Button, Form, Select, Typography } from 'antd';

import { toast } from 'react-toastify';

const ModalPreviewImgComponent = lazy(
  () => import('../../../Components/ModalPreviewImg')
);

import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import { ErrorListMaintenance } from '../../../Constant/ErrorListMaintenance';
import { TWarehouseTicketRequest } from '../../../interface/TInventory';
import InventoryApi from '../../../service/Inventory.service';
import { showToastErrors } from '../../../utils/toast_errors';
import { TCreateMaintenance } from '../../../interface/TMaintenance';
import MaintenanceApi from '../../../service/Maintenance.service';

const { Option } = Select;

const formItemLayout = {
  // labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

export interface IAddMaintenanceProps {
  handleRerender: () => void;
  handleCloseDrawer: () => void;
  kioskList: TKioskListDropDown[];
}

function AddMaintenance({
  handleRerender,
  handleCloseDrawer,
  kioskList,
}: IAddMaintenanceProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { dispensers } = form.getFieldsValue();
  const { t } = useTranslation('lng');

  const [currentKiosk, setCurrentKiosk] = useState<TKioskListDropDown>();

  const handleCreateTicket = async (values: TCreateMaintenance) => {
    console.log(values);
    try {
      dispatch(setLoading(true));
      const response = await MaintenanceApi.CreateMaintenance(values);
      handleRerender();
      handleCloseDrawer();
      toast.success('Thêm Ticket maintenance thành công');
      form.resetFields();
    } catch (error: any) {
      console.log(error);
      showToastErrors(error.errors);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onFinish = (values: TCreateMaintenance) => {
    console.log('Received values of form: ', values);

    handleCreateTicket(values);
  };

  return (
    <>
      {/* <h2 className="font-bold text-3xl w-full mb-4 text-center  ">
          Thêm sản phẩm
        </h2> */}

      <Form
        {...formItemLayout}
        labelWrap
        name="AddInventoryTicket"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        // validateMessages={validateMessages}
        className="w-full font-semibold text-base"
      >
        <Form.Item
          name="deviceId"
          label={`${t('inventoryManagement.detailTicket.form.ChoseKiosk')}`}
          rules={[{ required: true }]}
          colon
        >
          <Select
            placeholder={`${t(
              'inventoryManagement.detailTicket.form.ChoseKiosk'
            )}`}
            virtual={false}
          >
            {kioskList &&
              kioskList?.map((kiosk) => (
                <Option key={kiosk.deviceId} value={kiosk.deviceId}>
                  {kiosk.kioskName}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="errorCode"
          label={`${t('maintenance.detail.ChoseDeviceError')}`}
          rules={[{ required: true }]}
          colon
        >
          <Select
            placeholder={`${t(
              'maintenance.detail.ChoseDeviceError'
            )}`}
            virtual={false}
          >
            {ErrorListMaintenance?.map((error) => (
              <Option key={error.id} value={error.id}>
                {error.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          className="flex-1 "
          name="note"
          label={`${t('inventoryManagement.detailTicket.form.description')}`}
        >
          <TextArea
            rows={4}
            placeholder={`${t(
              'inventoryManagement.detailTicket.form.description'
            )}`}
          />
        </Form.Item>

        <Button
          htmlType="submit"
          className=" mt-4 py-0 px-4 flex items-center w-full justify-center "
          size="large"
          type="primary"
          shape="round"
          icon={<CheckOutlined />}
        >
          {t('maintenance.list.btnAdd')}
        </Button>
      </Form>
    </>
  );
}

export default memo(AddMaintenance);
