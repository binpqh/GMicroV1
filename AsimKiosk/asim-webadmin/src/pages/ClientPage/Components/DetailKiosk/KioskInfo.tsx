import {
  CheckOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  FieldTimeOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  RedoOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, List, Modal, Select, Space, Tag, Tooltip } from 'antd';
import { lazy, memo, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { SignalRContext } from '../../../../Context';

const { confirm } = Modal;

import { useTranslation } from 'react-i18next';
import { ExternalDevices } from '../../../../Constant/externalDevices';

import { StatusEnum, StatusEnumString } from '../../../../Constant/Status';
import { setLoading } from '../../../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../../../apps/hooks';
import { TDetailKiosk, TExternalDevices } from '../../../../interface';
import { TGroup } from '../../../../interface/IGroup';
import ClientApi from '../../../../service/Client.service';
import GroupApi from '../../../../service/Group.service';
import EditPeripheral from './EditPeripheral';
import { showToastErrors } from '../../../../utils/toast_errors';
import ViewLogPeripheral from './ViewLogPeripheral';

const DrawerComponents = lazy(() => import('../../../../Components/Drawer'));

const { Option } = Select;
export interface KioskInfo {
  kioskId: string;
}
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function KioskInfo({ kioskId }: KioskInfo) {
  const { t } = useTranslation('lng');
  const dispatch = useAppDispatch();
  const { connection } = useContext(SignalRContext);
  const navigate = useNavigate();
  const [kiosk, setKiosk] = useState<TDetailKiosk>();
  const [edit, setEdit] = useState<boolean>(false);
  const [isEditPeripheral, setIsEditPeripheral] = useState<{
    isOpen: boolean;
    externalDevices?: TExternalDevices;
  }>({ isOpen: false });
  const [isRender, setIsRender] = useState<boolean>(false);
  const [groupList, setGroupList] = useState<Pick<TGroup, 'groupId' | 'groupName'>[]>();
  const [viewLogPeripheral, setViewLogPeripheral] = useState<{
    isOpenDrawer: boolean;
    typeLog?: string;
  }>({
    isOpenDrawer: false,
  });
  const handleRebootKiosk = () => {
    console.log('restart');
    console.log(connection, kioskId);
    connection && connection!.HubConnection?.invoke('InvokeReboot', kioskId);
    // sleep(800).then(() => {
    //   console.log('this ran after 1 second');
    //   setIsRender(!isRender);
    // });
  };

  const getKiosk = async () => {
    try {
      dispatch(setLoading(true));
      const response = await ClientApi.getKioskById(kioskId);
      // console.log(response.data);
      setKiosk(response.data.data);
      dispatch(setLoading(false));
    } catch (error: any) {
      showToastErrors(error.errors);
      console.log('failed to fetch kiosk', error);
      dispatch(setLoading(false));
    }
  };

  const getGroupList = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GroupApi.getGroupList();
      // console.log('setGroupList', response.data.data);
      setGroupList(response.data.data);
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log('failed to fetch getGroupIdList', error);
      dispatch(setLoading(false));
      showToastErrors(error.errors);
    }
  };
  const changeStatusKiosk = async (id: string, status: number) => {
    try {
      dispatch(setLoading(true));
      const response = await ClientApi.changeStatusKiosk(id, status);

      setIsRender(!isRender);
      toast.success(`${t('kiosk.ChangeStatusKiosk.messageSuccess')}`);
    } catch (error: any) {
      dispatch(setLoading(false));
      console.log('failed to delete connection', error);
      toast.error(`${t('kiosk.ChangeStatusKiosk.messageError')}`);
      showToastErrors(error.errors);
    }
  };
  const refreshKiosk = async () => {
    try {
      dispatch(setLoading(true));
      const response = await ClientApi.refreshKiosk(kioskId);

      setIsRender(!isRender);
      // toast.success(`${t('kiosk.ChangeStatusKiosk.messageSuccess')}`);
      toast.success(`Refresh kiosk thành công`);
    } catch (error: any) {
      dispatch(setLoading(false));
      console.log('failed to delete connection', error);
      // toast.error(`${t('kiosk.ChangeStatusKiosk.messageError')}`);
      showToastErrors(error.errors);
    }
  };
  const OpenLocker = async () => {
    try {
      dispatch(setLoading(true));
      const response = await ClientApi.OpenLocker(kioskId);

      setIsRender(!isRender);
      // toast.success(`${t('kiosk.ChangeStatusKiosk.messageSuccess')}`);
      toast.success(`OpenLocker kiosk thành công`);
    } catch (error: any) {
      dispatch(setLoading(false));
      console.log('failed to delete connection', error);
      // toast.error(`${t('kiosk.ChangeStatusKiosk.messageError')}`);
      showToastErrors(error.errors);
    }
  };

  const changeStatusPeripheral = async (peripheralId: string, status: number) => {
    try {
      dispatch(setLoading(true));
      const response = await ClientApi.changeStatusPeripheral(peripheralId, status, kioskId);
      setIsRender(!isRender);
      toast.success(`${t('kiosk.ChangeStatusKiosk.messagePeripheralSuccess')}`);
    } catch (error: any) {
      dispatch(setLoading(false));
      console.log('failed to delete connection', error);
      toast.error(`${t('kiosk.ChangeStatusKiosk.messagePeripheralError')}`);
      showToastErrors(error.errors);
    }
  };

  const showConfirmNotifyKioskStatus = (
    title: string,
    desc: string,
    options: 'Active' | 'InActive' | 'Reboot' | 'Refresh' | 'OpenLocker'
  ) => {
    confirm({
      title: title,
      icon: <ExclamationCircleFilled style={{ fontSize: '22px' }} />,
      content: desc,
      okType: 'danger',
      cancelButtonProps: { type: 'default' },

      onOk() {
        {
          options === 'Active' && kiosk && changeStatusKiosk(kiosk?.deviceId, StatusEnum.Active);

          options === 'InActive' &&
            kiosk &&
            changeStatusKiosk(kiosk?.deviceId, StatusEnum.Inactive);

          options === 'Reboot' && kioskId && handleRebootKiosk();
          options === 'Refresh' && kiosk && refreshKiosk();
          options === 'OpenLocker' && kiosk && OpenLocker();
        }
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  };

  const showConfirmNotifyPeripheralStatus = (
    peripheralId: string,
    title: string,
    desc: string,
    options: 'Active' | 'InActive'
  ) => {
    confirm({
      title: title,
      icon: <ExclamationCircleFilled style={{ fontSize: '22px', color: 'red' }} />,
      content: desc,
      okType: 'danger',
      cancelButtonProps: { type: 'default' },

      onOk() {
        {
          options === 'Active' && kiosk && changeStatusPeripheral(peripheralId, StatusEnum.Active);

          options === 'InActive' &&
            kiosk &&
            changeStatusPeripheral(peripheralId, StatusEnum.Inactive);
        }
      },
      onCancel() {},
    });
  };

  const handleUpdateDetailKiosk = async (
    data: Pick<TDetailKiosk, 'posCodeTerminal' | 'groupName' | 'name' | 'address'>
  ) => {
    // console.log('Received values of form: ', data);
    try {
      const response = await ClientApi.update(kioskId, data);
      toast.success(`${t('kiosk.update.messageSuccess')}`);
      setIsRender(!isRender);
    } catch (error: any) {
      console.log('failed to fetch productList', error);
      toast.error(`${t('kiosk.update.messageError')}`);
      showToastErrors(error.errors);
    }
  };

  const handleCloseModal = () => {
    setIsEditPeripheral({ ...isEditPeripheral, isOpen: false });
  };

  const handLeViewLogPeripheral = (typeLog: string) => {
    setViewLogPeripheral({
      isOpenDrawer: true,
      typeLog: typeLog,
    });
  };

  const handleCloseViewLog = () => {
    setViewLogPeripheral({
      isOpenDrawer: false,
    });
  };

  useEffect(() => {
    getKiosk();
  }, [isRender]);

  useEffect(() => {
    getGroupList();
  }, []);

  return (
    <>
      <h2 className="font-bold text-3xl  text-inherit text-center  my-2">
        {t('kiosk.detail.title')}
      </h2>
      <div className=" bg-gray-100 w-full flex flex-wrap xl:flex-nowrap gap-4 ">
        <Card
          className=" w-full  xl:w-3/6 "
          title={t('kiosk.detail.info')}
          headStyle={{
            fontSize: '20px',
            lineHeight: '26px',
            fontWeight: '600',
            textAlign: 'center',
          }}
          actions={[
            <EditOutlined style={{ fontSize: '22px' }} key="edit" onClick={() => setEdit(true)} />,
            <SettingOutlined
              style={{ fontSize: '22px' }}
              key="setting"
              onClick={() => setEdit(false)}
            />,
          ]}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex  gap-3 xl:gap-2">
              <p className=" font-semibold text-base w-2/6">{t('kiosk.detail.form.name')}</p>
              <p className=" font-[700] text-base w-4/6 break-words">{kiosk?.name}</p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base w-2/6 ">{t('kiosk.detail.form.deviceId')}</p>
              <p className=" font-[700] text-base w-4/6  ">{kiosk?.deviceId}</p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base  w-2/6 ">{t('kiosk.detail.form.status')}</p>
              <p className=" font-[700] text-base w-4/6  ">
                <Tag
                  className="m-0"
                  color={kiosk?.status.toLocaleLowerCase() === 'inactive' ? 'red' : 'blue'}
                  key={'isOnline'}
                >
                  {kiosk?.status.toUpperCase()}
                </Tag>
              </p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base  w-2/6">
                {t('kiosk.detail.form.healthStatus')}
              </p>
              <p className=" font-[700] text-base w-4/6  ">{kiosk?.healthStatus}</p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base  w-2/6">{t('kiosk.detail.form.address')}</p>
              <p className=" font-[700] text-base w-4/6  ">{kiosk?.address}</p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base  w-2/6">
                {t('kiosk.detail.form.posCodeTerminal')}
              </p>
              <p className=" font-[700] text-base w-4/6  ">{kiosk?.posCodeTerminal}</p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base  w-2/6">{t('kiosk.detail.form.groupId')}</p>
              <p className=" font-[700] text-base w-4/6  ">{kiosk?.groupName}</p>
            </div>
          </div>
        </Card>
        {edit === false && (
          <Card
            className="w-full  xl:w-3/6  "
            title={`${t('buttons.action')}`}
            headStyle={{
              fontSize: '20px',
              lineHeight: '26px',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            <Space size={20} direction="vertical" className=" items-center w-full justify-center ">
              <Button
                className=" flex items-center min-w-[300px] 2xl:min-w-[350px] justify-center  "
                type="primary"
                size="large"
                shape="round"
                icon={<FieldTimeOutlined />}
                onClick={() => {
                  showConfirmNotifyKioskStatus(
                    `Restart Kiosk ${kiosk?.name}  `,
                    `Hành động này sẽ Restart Kiosk ${kiosk?.name}. Bạn chắc chắn muốn Restart ?`,
                    'Reboot'
                  );
                }}
              >
                Reboot Kiosk
              </Button>
              <Button
                className=" flex items-center min-w-[300px] 2xl:min-w-[350px] justify-center  bg-infoColor hover:bg-infoColorHover "
                type="primary"
                size="large"
                shape="round"
                icon={<RedoOutlined />}
                onClick={() => {
                  showConfirmNotifyKioskStatus(
                    `Refresh Kiosk ${kiosk?.name}  `,
                    `Hành động này sẽ Refresh Kiosk ${kiosk?.name}. Bạn chắc chắn muốn Refresh ?`,
                    'Refresh'
                  );
                }}
              >
                Refresh Kiosk
              </Button>
              <Button
                className=" flex items-center min-w-[300px] 2xl:min-w-[350px] justify-center  bg-infoColor hover:bg-infoColorHover "
                type="primary"
                size="large"
                shape="round"
                icon={<UploadOutlined />}
                onClick={() => {
                  showConfirmNotifyKioskStatus(
                    `Open Locker Kiosk ${kiosk?.name}  `,
                    `Hành động này sẽ Open Locker Kiosk ${kiosk?.name}. Bạn chắc chắn muốn mở khoá từ không ?`,
                    'OpenLocker'
                  );
                }}
              >
                Open Locker
              </Button>
              {kiosk?.status.toLocaleLowerCase() === 'active' && (
                <Button
                  className="flex items-center min-w-[300px] 2xl:min-w-[350px] justify-center  bg-warningColor hover:bg-warningColorHover"
                  type={'primary'}
                  size="large"
                  shape="round"
                  icon={<PauseCircleOutlined />}
                  onClick={() => {
                    showConfirmNotifyKioskStatus(
                      `${t('buttons.disabled')} ${kiosk?.name}  `,
                      `${t('kiosk.ChangeStatusKiosk.DisabledMess')}`,
                      `InActive`
                    );
                  }}
                >
                  {t('buttons.disabled')}
                </Button>
              )}
              {kiosk?.status.toLocaleLowerCase() === 'inactive' && (
                <Button
                  className="flex items-center min-w-[300px] 2xl:min-w-[350px] justify-center
                      bg-successColor hover:bg-successColorHover"
                  type={'primary'}
                  size="large"
                  shape="round"
                  icon={<PlayCircleOutlined />}
                  onClick={() => {
                    showConfirmNotifyKioskStatus(
                      `${t('buttons.enabled')} Kiosk ${kiosk?.name}  `,
                      `${t('kiosk.ChangeStatusKiosk.enabledMess')}`,
                      'Active'
                    );
                  }}
                >
                  {t('buttons.enabled')}
                </Button>
              )}
            </Space>
          </Card>
        )}
        {edit === true && (
          <Card
            className="w-full  xl:w-3/6  "
            title={`${t('kiosk.update.title')}`}
            headStyle={{
              fontSize: '20px',
              lineHeight: '26px',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            <Form
              name="validate_other"
              {...formItemLayout}
              layout="horizontal"
              labelWrap
              onFinish={handleUpdateDetailKiosk}
              className="w-full font-semibold text-base p-0 "
            >
              <Form.Item
                initialValue={kiosk?.name}
                className="font-bold  "
                label={`${t('kiosk.update.form.name')}`}
                name="name"
                rules={[{ required: true }]}
              >
                <Input className="font-normal" />
              </Form.Item>
              <Form.Item
                initialValue={kiosk?.address}
                className="font-bold "
                label={`${t('kiosk.update.form.address')}`}
                name="address"
                rules={[{ required: true }]}
              >
                <Input className="font-normal" />
              </Form.Item>
              <Form.Item
                initialValue={kiosk?.posCodeTerminal}
                className="font-bold "
                label={`${t('kiosk.update.form.posCodeTerminal')}`}
                name="posCodeTerminal"
                rules={[{ required: true }]}
              >
                <Input className="font-normal" />
              </Form.Item>

              <Form.Item
                initialValue={kiosk?.groupId}
                name="groupId"
                label={`${t('kiosk.update.form.groupId')}`}
                rules={[{ required: true }]}
              >
                {groupList && (
                  <Select placeholder={`${t('kiosk.update.form.groupId')}`} allowClear>
                    {groupList.map((item) => (
                      <Option value={item.groupId} key={item.groupId}>
                        {item.groupName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <div className="gap-3  clear-right float-right max-h-8 ">
                <Form.Item>
                  <Button
                    htmlType="submit"
                    className="bg-green-500 hover:bg-green-400 flex  items-center px-5 py-4"
                    size="large"
                    type="primary"
                    shape="round"
                    icon={<CheckOutlined />}
                  >
                    {t('buttons.saveChanges')}
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Card>
        )}
      </div>

      <Divider
        orientation="center"
        className="px-3 font-bold text-2xl  text-inherit text-center  my-4"
      >
        {t('kiosk.detail.externalInformation.title')}
      </Divider>

      <List
        className="w-full my-4 "
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 4,
          xxl: 4,
        }}
        dataSource={kiosk?.externalDevices}
        renderItem={(item, index) => (
          <List.Item>
            <Card
              headStyle={{
                fontSize: '16px',
                lineHeight: '26px',
                fontWeight: '600',
                textAlign: 'center',
              }}
              hoverable
              title={`
              ${t(`kiosk.detail.externalInformation.${ExternalDevices(item.code)}`)}

              `}
              extra={
                <>
                  {['PRI', 'UPS', 'TEM'].includes(item.code.toUpperCase()) && (
                    <Tooltip
                      title={t('kiosk.detail.externalInformation.logPeripheral')}
                      color={'#00b96b'}
                      key={'#00b96b'}
                      placement="bottom"
                    >
                      <EyeOutlined
                        style={{ fontSize: '20px' }}
                        key="setting"
                        onClick={() => handLeViewLogPeripheral(ExternalDevices(item.code))}
                      />
                    </Tooltip>
                  )}
                </>
              }
              actions={[
                <EditOutlined
                  style={{ fontSize: '22px' }}
                  key="edit"
                  className={`${
                    item.status.toLocaleLowerCase() ===
                      StatusEnumString.Inactive.toLocaleLowerCase() &&
                    'grayscale cursor-not-allowed '
                  }`}
                  onClick={() => {
                    if (
                      item.status.toLocaleLowerCase() !==
                      StatusEnumString.Inactive.toLocaleLowerCase()
                    ) {
                      setIsEditPeripheral({
                        isOpen: true,
                        externalDevices: item,
                      });
                    }
                  }}
                />,
                <>
                  {item.status.toLocaleLowerCase() ===
                  StatusEnumString.Inactive.toLocaleLowerCase() ? (
                    <PlayCircleOutlined
                      style={{ fontSize: '22px' }}
                      key="edit"
                      onClick={() =>
                        showConfirmNotifyPeripheralStatus(
                          item.id,
                          `${t('buttons.enabled')}   ${t(
                            `kiosk.detail.externalInformation.${ExternalDevices(item.code)}`
                          )} `,
                          `${t('kiosk.ChangeStatusKiosk.enabledPeripheralMess')}`,
                          StatusEnumString.Active
                        )
                      }
                    />
                  ) : (
                    <PauseCircleOutlined
                      style={{ fontSize: '22px' }}
                      key="edit"
                      onClick={() =>
                        showConfirmNotifyPeripheralStatus(
                          item.id,
                          `${t('buttons.disabled')}   ${t(
                            `kiosk.detail.externalInformation.${ExternalDevices(item.code)}`
                          )} `,
                          `${t('kiosk.ChangeStatusKiosk.DisabledPeripheralMess')}`,
                          StatusEnumString.Inactive
                        )
                      }
                    />
                  )}
                </>,
              ]}
            >
              <div className="flex flex-col items-center  ">
                <div className="w-full flex py-1">
                  <p className=" font-medium text-base  w-3/6 ">
                    {t('kiosk.detail.externalInformation.deviceCode')}:
                  </p>
                  <p className=" font-medium text-base  w-3/6  break-words">{item.code}</p>
                </div>
                <div className="w-full flex py-1 ">
                  <p className=" font-medium text-base  w-3/6 ">
                    {t('kiosk.detail.externalInformation.deviceName')}:
                  </p>
                  <p className=" font-medium text-base  w-3/6  ">{item.name}</p>
                </div>

                {item.itemCode &&
                  item.productCode &&
                  ['DI1', 'DI2', 'DI3', 'DI4'].includes(item.code.toUpperCase()) && (
                    <>
                      <div className="w-full flex  py-1">
                        <p className=" font-medium text-base w-3/6 ">
                          {t('kiosk.detail.externalInformation.productCode')}:
                        </p>
                        <p className=" font-medium text-base w-3/6  ">{item.productCode}</p>
                      </div>
                      <div className="w-full flex  py-1">
                        <p className=" font-medium text-base w-3/6 ">
                          {t('kiosk.detail.externalInformation.itemCode')}:
                        </p>
                        <p className=" font-medium text-base w-3/6  ">{item.itemCode}</p>
                      </div>
                    </>
                  )}

                <div className="w-full flex py-1 ">
                  <p className=" font-medium text-base  w-3/6  ">
                    {t('kiosk.detail.externalInformation.devicePath')}:
                  </p>
                  <p className=" font-medium text-base  w-3/6   ">{item.path}</p>
                </div>

                <div className="w-full flex py-1 ">
                  <p className=" font-medium text-base  w-3/6  ">{t('kiosk.detail.form.status')}</p>
                  <p className=" font-medium text-base  w-3/6   ">
                    <Tag
                      className="m-0"
                      color={
                        item?.status.toLocaleLowerCase() ===
                        StatusEnumString.Inactive.toLocaleLowerCase()
                          ? 'red'
                          : 'blue'
                      }
                      key={'isOnline'}
                    >
                      {item.status.toUpperCase()}
                    </Tag>
                  </p>
                </div>
                <div className="w-full flex py-1 ">
                  <p className=" font-medium text-base  w-3/6  ">
                    {t('kiosk.detail.form.healthStatus')}
                  </p>
                  <p className=" font-medium text-base  w-3/6   ">{item.health}</p>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
      {isEditPeripheral.externalDevices && (
        <Modal
          open={isEditPeripheral.isOpen}
          title={
            <h4 className="font-bold text-xl text-center mb-5 text-primary">
              {t('kiosk.detail.externalInformation.editTitle')} -{' '}
              {t(
                `kiosk.detail.externalInformation.${ExternalDevices(
                  isEditPeripheral.externalDevices.code
                )}`
              )}
            </h4>
          }
          onCancel={handleCloseModal}
          centered
          footer={null}
        >
          <EditPeripheral
            isRender={isRender}
            externalDevices={isEditPeripheral.externalDevices}
            deviceId={kioskId}
            handleRerender={() => setIsRender(!isRender)}
            handleCloseModal={handleCloseModal}
          />
        </Modal>
      )}

      {/* -------- Add Inventory ticket--------- */}
      {viewLogPeripheral.typeLog && (
        <DrawerComponents
          key={viewLogPeripheral.typeLog + kioskId}
          title={`${t('kiosk.detail.externalInformation.logPeripheral')} - ${t(
            `kiosk.detail.externalInformation.${ExternalDevices(viewLogPeripheral.typeLog)}`
          )}`}
          openDrawer={viewLogPeripheral.isOpenDrawer}
          handleCloseDrawer={handleCloseViewLog}
          children={
            <ViewLogPeripheral
              logType={viewLogPeripheral.typeLog}
              kioskId={kioskId}
            ></ViewLogPeripheral>
          }
          width={window.innerWidth >= 1024 ? '70%' : '100%'}
        />
      )}
    </>
  );
}
export default memo(KioskInfo);
