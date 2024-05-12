import {
  AppstoreAddOutlined,
  DeleteOutlined,
  DisconnectOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { Button, Divider, Image, List, Modal } from 'antd';
import { useState } from 'react';
import paymentConfigImg from '../../../assets/img/payment-config.webp';
import { IFormCreatePaymentConfig, IPaymentConfig } from '../../../interface/IPaymentConfig';
import AddPaymentConfig from './AddPaymentConfig';
import PaymentProfile from './PaymentProfile';
import EditPaymentConfig from './EditPaymentConfig';
import { useAppDispatch } from '../../../apps/hooks';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { PaymentConfigApi } from '../../../service/PaymentConfig.service';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
const initPaymentConfig = {
  id: '',
  keySecret: '',
  merchantCode: '',
  channelCode: '',
  urlDomain: {
    paymentConfig: '',
    paymentGateway: '',
  },
  customerEmail: '',
  customerName: '',
  customerMobile: '',
  ipnUrl: '',
  redirectUrl: '',
  status: '',
  shopId: '',
};
type PaymentConfigListProps = {
  paymentConfigList: IPaymentConfig[];
  handleChangePaymentConfigStatus: (
    paymentConfigId: string,
    status: 'Active' | 'InActive' | 'Delete'
  ) => void;
  handleTriggerRerender: () => void;
};
export default function PaymentConfigList({
  paymentConfigList,
  handleChangePaymentConfigStatus,
  handleTriggerRerender,
}: PaymentConfigListProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('lng');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [paymentProfileShow, setPaymentProfileShow] = useState<IPaymentConfig>(initPaymentConfig);
  const [editPaymentConfig, setEditPaymentConfig] = useState<{
    isEdit: boolean;
    paymentConfig?: IPaymentConfig;
  }>({ isEdit: false });

  const onCancel = () => {
    setIsOpen(false);
  };
  const handleShowModalAddPaymentConfig = () => {
    setIsOpen(true);
  };
  const handleClosePaymentProfileShow = () => {
    setPaymentProfileShow(initPaymentConfig);
  };
  const handleShowPaymentProfile = (data: IPaymentConfig) => {
    setPaymentProfileShow(data);
  };

  const handleEditPaymentConfig = async (id: string, values: IFormCreatePaymentConfig) => {
    try {
      dispatch(setLoading(true));
      await PaymentConfigApi.updatePaymentConfig(id, values);
      setEditPaymentConfig({ isEdit: false });
      handleTriggerRerender();
      toast.success('Chỉnh sửa cấu hình thanh toán thành công');
    } catch (error) {
      //@ts-ignore
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="mt-10">
      <Divider className="text-md lg:text-3xl break-words font-semibold mb-5">
        {t('paymentHub.paymentHubList')}
      </Divider>

      <div className="flex flex-wrap items-center justify-start my-6 gap-5">
        <Button
          className="text-base bg-green-500 hover:bg-green-400  flex items-center "
          type="primary"
          size="large"
          shape="round"
          icon={<AppstoreAddOutlined />}
          onClick={handleShowModalAddPaymentConfig}
        >
          {t('paymentHub.btnAddPaymentHub')}
        </Button>
      </div>
      <List
        size="large"
        pagination={false}
        dataSource={paymentConfigList}
        renderItem={(item) => (
          <List.Item className=" bg-white mb-2 rounded-lg shadow-sm bg-[#fff]" key={item.id}>
            <div className="w-full flex flex-col lg:flex-row items-center xl:justify-between justify-center gap-2 space-y-4 xl:space-y-0">
              <div className="flex flex-wrap items-center md:justify-start justify-center w-full gap-5">
                <Image
                  src={paymentConfigImg}
                  className="w-[100px] h-[100px] object-cover flex-1"
                  preview={false}
                />
                <Divider type="vertical" className="h-24 text-center hidden sm:block" />
                <div className="flex  gap-4 flex-1 flex-wrap ">
                  <div className=" ">
                    <span className="font-medium text-lg">Payment Config</span>
                    <p className="opacity-80 text-base ">{item?.urlDomain.paymentConfig}</p>
                  </div>
                  <div className=" ">
                    <span className="font-medium text-lg">Payment Gateway</span>
                    <p className="opacity-80 text-base ">{item?.urlDomain.paymentGateway}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center flex-wrap xl:flex-nowrap   justify-center lg:justify-end gap-2 md:gap-4 w-fit ">
                {item.status.toLowerCase() == 'active' ? (
                  <Button
                    icon={<DisconnectOutlined />}
                    className="flex items-center w-full p-5 justify-center text-white bg-warningColor hover:bg-warningColorHover"
                    type="primary"
                    shape="round"
                    onClick={() => {
                      handleChangePaymentConfigStatus(item.id, 'InActive');
                    }}
                  >
                    {t('buttons.disabled')}
                  </Button>
                ) : (
                  <Button
                    icon={<CheckOutlined />}
                    danger
                    className="flex items-center w-full  p-5  justify-center text-white  "
                    shape="round"
                    onClick={() => {
                      handleChangePaymentConfigStatus(item.id, 'Active');
                    }}
                  >
                    {t('buttons.enabled')}
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  danger
                  className="flex items-center w-full  p-5  justify-center text-white bg-lime-500 hover:bg-lime-400 "
                  shape="round"
                  onClick={() => {
                    handleChangePaymentConfigStatus(item.id, 'Delete');
                  }}
                >
                  {t('buttons.delete')}
                </Button>
                <Button
                  type="primary"
                  icon={<ExclamationCircleOutlined />}
                  className="flex items-center w-full  p-5  justify-center text-white bg-infoColor hover:bg-infoColorHover"
                  shape="round"
                  onClick={() => {
                    handleShowPaymentProfile(item);
                  }}
                >
                  {t('buttons.detail')}
                </Button>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  className="flex items-center w-full p-5  justify-center text-white  "
                  shape="round"
                  onClick={() => {
                    setEditPaymentConfig({
                      isEdit: true,
                      paymentConfig: item,
                    });
                  }}
                >
                  {t('buttons.edit')}
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />
      {editPaymentConfig.paymentConfig && (
        <EditPaymentConfig
          isOpen={editPaymentConfig.isEdit}
          onCancel={() => setEditPaymentConfig({ isEdit: false })}
          paymentConfig={editPaymentConfig.paymentConfig}
          handleEditPaymentConfig={handleEditPaymentConfig}
        />
      )}

      <AddPaymentConfig
        isOpen={isOpen}
        onCancel={onCancel}
        handleTriggerRerender={handleTriggerRerender}
      />
      <Modal
        title={
          <div className="flex flex-col space-y-5">
            <h4 className="font-semibold text-3xl text-center">{t('paymentHub.paymentHubInfo')}</h4>
            <div className="bg-[rgba(0,0,0,0.08)] w-full h-[1px]"></div>
          </div>
        }
        open={paymentProfileShow.id ? true : false}
        centered
        onCancel={handleClosePaymentProfileShow}
        footer={null}
        width={800}
      >
        <PaymentProfile paymentConfig={paymentProfileShow} type="modal" />
      </Modal>
    </div>
  );
}
