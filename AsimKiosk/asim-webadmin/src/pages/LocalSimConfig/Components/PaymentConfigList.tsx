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
import localSimLogo from '../../../assets/img/logo.png';
import { IFormCreatePaymentConfig, IPaymentConfig } from '../../../interface/IPaymentConfig';
import AddPaymentConfig from './AddPaymentConfig';
import PaymentProfile from './LocalSimProfileActive';
import EditLocalSimConfig from './EditLocalSimConfig';
import { useAppDispatch } from '../../../apps/hooks';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { PaymentConfigApi } from '../../../service/PaymentConfig.service';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { TFromLocalSimConfig, TLocalSimConfig } from '../../../interface/TLocalSimApi';
import { LocalSimApi } from '../../../service/LocalSimApi.service';
const initLocalSimConfigValue = {
  userName: '',
  password: '',
  grantType: '',
  clientId: '',
  clientSecret: '',
  scope: '',
  realm: '',
  authUrl: '',
  bussUrl: '',
  id: '',
  status: '',
};
type PaymentConfigListProps = {
  LocalSimConfigList: TLocalSimConfig[];
  handleChangePaymentConfigStatus: (paymentConfigId: string, status: 'Active' | 'Delete') => void;
  handleTriggerRerender: () => void;
};
export default function LocalSimConfigList({
  LocalSimConfigList,
  handleChangePaymentConfigStatus,
  handleTriggerRerender,
}: PaymentConfigListProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('lng');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [localSimConfigShow, setLocalSimConfigShow] =
    useState<TLocalSimConfig>(initLocalSimConfigValue);
  const [editLocalSimConfig, setEditLocalSimConfig] = useState<{
    isEdit: boolean;
    LocalSimConfig?: TLocalSimConfig;
  }>({ isEdit: false });

  const onCancel = () => {
    setIsOpen(false);
  };
  const handleShowModalAddPaymentConfig = () => {
    setIsOpen(true);
  };
  const handleClosePaymentProfileShow = () => {
    setLocalSimConfigShow(initLocalSimConfigValue);
  };
  const handleShowPaymentProfile = (data: TLocalSimConfig) => {
    setLocalSimConfigShow(data);
  };

  const handleEditLocalSimConfig = async (id: string, values: TFromLocalSimConfig) => {
    try {
      dispatch(setLoading(true));
      await LocalSimApi.updateLocalSimConfig(id, values);
      setEditLocalSimConfig({ isEdit: false });
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
        {t('localSimApiConfig.localSimApiList')}
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
          {t('localSimApiConfig.btnAddLocalSimApi')}
        </Button>
      </div>
      <List
        size="large"
        pagination={false}
        dataSource={LocalSimConfigList}
        renderItem={(item) => (
          <List.Item className=" bg-white mb-2 rounded-lg shadow-sm bg-[#fff]" key={item.id}>
            <div className="w-full flex flex-col lg:flex-row items-center xl:justify-between justify-center gap-2 space-y-4 xl:space-y-0">
              <div className="flex flex-wrap items-center md:justify-start justify-center w-full gap-5">
                <Image
                  src={localSimLogo}
                  className="w-[100px] h-[100px]  flex-1 text-center p-2 object-scale-down"
                  preview={false}
                />
                <Divider type="vertical" className="h-24 text-center hidden sm:block" />
                <div className="flex  gap-4 flex-1 flex-wrap ">
                  <div className=" ">
                    <span className="font-medium text-lg">Client Id</span>
                    <p className="opacity-80 text-base ">{item?.clientId}</p>
                  </div>
                  <div className=" ">
                    <span className="font-medium text-lg">Realm</span>
                    <p className="opacity-80 text-base ">{item?.realm}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center flex-wrap xl:flex-nowrap   justify-center lg:justify-end gap-2 md:gap-4 w-fit ">
                {item.status.toLowerCase() == 'active' ? (
                  <Button
                    icon={<CheckOutlined />}
                    className=" flex items-center w-full p-5 justify-center text-white bg-successColor hover:bg-successColorHover"
                    type="primary"
                    shape="round"
                  >
                    {t('localSimApiConfig.Active')}
                  </Button>
                ) : (
                  <Button
                    icon={<DisconnectOutlined />}
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
                    setEditLocalSimConfig({
                      isEdit: true,
                      LocalSimConfig: item,
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
      {editLocalSimConfig.LocalSimConfig && (
        <EditLocalSimConfig
          isOpen={editLocalSimConfig.isEdit}
          onCancel={() => setEditLocalSimConfig({ isEdit: false })}
          LocalSimConfig={editLocalSimConfig.LocalSimConfig}
          handleEditLocalSimConfig={handleEditLocalSimConfig}
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
            <h4 className="font-semibold text-3xl text-center">
              {t('localSimApiConfig.localSimApiInfo')}
            </h4>
            <div className="bg-[rgba(0,0,0,0.08)] w-full h-[1px]"></div>
          </div>
        }
        open={localSimConfigShow.id ? true : false}
        centered
        onCancel={handleClosePaymentProfileShow}
        footer={null}
        width={800}
      >
        <PaymentProfile LocalSimConfig={localSimConfigShow} type="modal" />
      </Modal>
    </div>
  );
}
