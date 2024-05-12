import { green } from '@ant-design/colors';
import {
  CloseOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  InboxOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  ChromeOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Divider,
  Form,
  List,
  Modal,
  Progress,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Upload,
  UploadFile,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import type { RcFile } from 'antd/es/upload';
import moment from 'moment';
import { lazy, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../../apps/hooks';
import {
  TChangeTicketDispenserStatusRequest,
  TGetTicketInventory,
  TUpdateWarehouseTicketRequest,
} from '../../../interface/TInventory';
import InventoryApi from '../../../service/Inventory.service';
import { getBase64, normFile } from '../../../utils/formattImg';
import { CompletionNumberStatus, CompletionStingStatus } from '../../../Constant/CompletionStatus';
import { showToastErrors } from '../../../utils/toast_errors';
import PdfViewer from '../../../Components/PdfViewer';
const { confirm } = Modal;
const ModalPreviewImgComponent = lazy(() => import('../../../Components/ModalPreviewImg'));
const { Option } = Select;
export interface InventoryInfoProps {
  ticketId: string;
}
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

function InventoryInfo({ ticketId }: InventoryInfoProps) {
  const { t } = useTranslation('lng');
  const dispatch = useAppDispatch();
  const [urlFile, setUrlFile] = useState<string>('');
  const navigate = useNavigate();
  const [inventoryTicket, setInventoryTicket] = useState<TGetTicketInventory>();
  const [isEdit, setIsEdit] = useState<'Completed' | 'Update' | 'Action'>('Action');
  const [isRender, setIsRender] = useState<boolean>(false);

  const [previewImg, setPreviewImg] = useState<{
    previewOpen: boolean;
    previewImage: any;
    previewTitle: any;
    isPdf: boolean;
  }>({
    previewOpen: false,
    isPdf: false,
    previewImage: '',
    previewTitle: '',
  });

  const getInventoryTicket = async () => {
    try {
      dispatch(setLoading(true));
      const response = await InventoryApi.getTicket(ticketId);
      console.log(response.data);

      setInventoryTicket(response.data.data);
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log('failed to fetch kiosk', error);
      dispatch(setLoading(false));
      showToastErrors(error.errors);
    }
  };

  const changeStatusTicket = async (slot: number[], status: number, VerificationImage?: any) => {
    try {
      dispatch(setLoading(true));
      const data: TChangeTicketDispenserStatusRequest = {
        status: status,
        verificationImage: VerificationImage,
      };
      await InventoryApi.changeStatusTicket(ticketId, slot, data);
      setIsEdit('Action');
      setIsRender(!isRender);
      toast.success(`${t('inventoryManagement.detailTicket.ChangeStatusTicket.messageSuccess')}`);
    } catch (error: any) {
      dispatch(setLoading(false));
      console.log('failed to delete connection', error);
      showToastErrors(error.errors);
      toast.error(`${t('inventoryManagement.detailTicket.ChangeStatusTicket.messageError')}`);
    }
  };

  const handleDeleteTicket = async () => {
    try {
      await InventoryApi.DeleteTicket(ticketId);
      toast.success('Xoá ticket Thành Công');
      navigate(`/inventory/${inventoryTicket?.deviceId}`);
    } catch (error: any) {
      showToastErrors(error.errors);
      console.log('failed to delete connection', error);
      toast.error('Xoá ticket Thất Bại');
    }
  };

  const handleConfirmCompletion = (data: { slot: number[]; verificationImage: UploadFile }) => {
    data.slot &&
      data.verificationImage &&
      showConfirmNotify(
        `${t('inventoryManagement.detailTicket.ChangeStatusTicket.completedTitle')}`,
        `${t('inventoryManagement.detailTicket.ChangeStatusTicket.completedMess')} `,
        CompletionStingStatus.Completed,
        data.slot,
        data.verificationImage
      );
  };

  const showConfirmNotify = (
    title: string,
    desc: string,
    options:
      | CompletionStingStatus.Pending
      | CompletionStingStatus.Disabled
      | CompletionStingStatus.Completed,
    slot: number[],
    VerificationImage?: any
  ) => {
    confirm({
      title: title,
      icon: <ExclamationCircleFilled style={{ fontSize: '22px', color: 'red' }} />,
      content: desc,
      okType: 'danger',
      cancelButtonProps: { type: 'default' },
      onOk() {
        {
          // when CompletionStatus === Pending => changeStatusTicket to Disabled
          options === CompletionStingStatus.Pending &&
            changeStatusTicket(slot, CompletionNumberStatus.Disabled);
          // when CompletionStatus === Disabled => changeStatusTicket to Pending
          options === CompletionStingStatus.Disabled &&
            changeStatusTicket(slot, CompletionNumberStatus.Pending);
          // when Finished ticket => changeStatusTicket to Completed
          options === CompletionStingStatus.Completed &&
            changeStatusTicket(
              slot,
              CompletionNumberStatus.Completed,
              VerificationImage //  verification img when Finished ticket
            );
        }
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  };

  const handleUpdateDetailTicket = async (
    data: Pick<TUpdateWarehouseTicketRequest, 'description' | 'ticketFile'>
  ) => {
    console.log('Received values of form: ', data);
    try {
      await InventoryApi.updateTicket(ticketId, data);
      toast.success(`${t('inventoryManagement.detailTicket.messageUpdateSuccess')}`);
      setIsEdit('Action');
      setIsRender(!isRender);
    } catch (error: any) {
      showToastErrors(error.errors);
      console.log('failed to fetch productList', error);
      toast.error(`${t('inventoryManagement.detailTicket.messageUpdateError')}`);
    }
  };

  const getFileURL = (data: any) => {
    console.log(data.data);
    const fileURL = window.URL.createObjectURL(
      new Blob([data.data], {
        type: data.headers['content-type'],
      })
    );
    console.log('fileURL', fileURL);
    return setPreviewImg({
      isPdf: true,
      previewOpen: true,
      previewImage: fileURL,
      previewTitle: 'AuthenticDocument',
    });
  };

  const getInventoryTicketFile = async (documentKey: string) => {
    try {
      dispatch(setLoading(true));
      const response = await InventoryApi.getTicketFile(documentKey);
      console.log(response);
      getFileURL(response);
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log('failed to fetch', error);
      dispatch(setLoading(false));
      // showToastErrors(error.errors);

      let decoder = new TextDecoder('UTF-8');
      let mess = decoder.decode(error);
      let object = JSON.parse(mess);
      if (object.code === 500) {
        toast.error(`Lỗi server:${object.desc}`);
      } else {
        toast.error(`${object.desc}`);
      }
    }
  };

  const handleViewAuthenticDocument = () => {
    console.log(inventoryTicket?.imageKey, inventoryTicket?.documentKey);
    // AuthenticDocument sẽ có dạng img hoặc pdf
    if (inventoryTicket?.imageKey) {
      setPreviewImg({
        isPdf: false,
        previewOpen: true,
        previewImage: inventoryTicket?.imageKey,
        previewTitle: 'AuthenticDocument',
      });
    } else {
      inventoryTicket?.documentKey && getInventoryTicketFile(inventoryTicket.documentKey);
    }
  };

  useEffect(() => {
    ticketId && getInventoryTicket();
  }, [isRender, ticketId]);

  const handleCancel = () => setPreviewImg({ ...previewImg, previewOpen: false });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImg({
      isPdf: false,
      previewOpen: true,
      previewImage: file.url || (file.preview as string),
      previewTitle: file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    });
  };

  return (
    <>
      <h2 className="font-bold text-3xl  text-inherit text-center  my-2">
        {t('inventoryManagement.detailTicket.title')}
      </h2>
      <div className=" bg-gray-100 w-full flex flex-wrap xl:flex-nowrap gap-4 ">
        <Card
          className=" w-full  xl:w-3/6 "
          title={t('inventoryManagement.detailTicket.info')}
          headStyle={{
            fontSize: '20px',
            lineHeight: '26px',
            fontWeight: '600',
            textAlign: 'center',
          }}
          actions={[
            <EditOutlined
              style={{ fontSize: '22px' }}
              key="Update"
              onClick={() => setIsEdit('Update')}
            />,
            <SettingOutlined
              style={{ fontSize: '22px' }}
              key="Action"
              onClick={() => setIsEdit('Action')}
            />,
          ]}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex  gap-3 xl:gap-2">
              <p className=" font-semibold text-base w-2/6">
                {t('inventoryManagement.detailTicket.form.kioskName')}
              </p>
              <p className=" font-[700] text-base w-4/6 break-words">
                {inventoryTicket?.kioskName}
              </p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base w-2/6 ">
                {t('inventoryManagement.detailTicket.form.groupName')}
              </p>
              <p className=" font-[700] text-base w-4/6  ">{inventoryTicket?.groupName}</p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base  w-2/6">
                {t('inventoryManagement.detailTicket.form.creatorName')}
              </p>
              <p className=" font-[700] text-base w-4/6  ">{inventoryTicket?.creatorName}</p>
            </div>

            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base  w-2/6">
                {t('inventoryManagement.detailTicket.form.progress')}
              </p>
              <div className=" font-[700] text-base w-4/6  ">
                <Progress
                  steps={inventoryTicket?.dispenserCount}
                  percent={inventoryTicket?.completionProgress}
                  size={[20, 30]}
                  strokeColor={green[5]}
                />
              </div>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base  w-2/6">
                {t('inventoryManagement.detailTicket.form.description')}
              </p>
              <p className=" font-[700] text-base w-4/6  ">{inventoryTicket?.description}</p>
            </div>

            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base  w-2/6">
                {t('inventoryManagement.detailTicket.form.createdAt')}
              </p>
              <p className=" font-[700] text-base w-4/6  ">
                {moment(inventoryTicket?.createdAt).format('DD/MM/YYYY : h:mm A')}
              </p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base  w-2/6">
                {t('inventoryManagement.detailTicket.form.ticketFile')}
              </p>
              {inventoryTicket?.imageKey || inventoryTicket?.documentKey ? (
                <a
                  className=" font-[700] text-base w-4/6  "
                  onClick={() => handleViewAuthenticDocument()}
                >
                  click here to view
                </a>
              ) : (
                <p className=" font-[700] text-base w-4/6  ">Không có</p>
              )}
            </div>
          </div>
        </Card>
        {isEdit === 'Action' && (
          <Card
            className="w-full  xl:w-3/6  "
            title={`${t('buttons.action')}`}
            headStyle={{
              fontSize: '20px',
              lineHeight: '26px',
              fontWeight: '600',
              textAlign: 'center',
            }}
            // bodyStyle={{height: "100%"}}
          >
            <Space
              size={20}
              wrap
              direction="horizontal"
              className=" items-center w-full justify-center "
            >
              <Button
                className=" bg-successColor hover:bg-successColorHover flex items-center min-w-[300px] 2xl:min-w-[350px] justify-center  "
                type="primary"
                size="large"
                shape="round"
                icon={<ChromeOutlined />}
                onClick={() => {
                  setIsEdit('Completed');
                }}
              >
                {t('inventoryManagement.detailTicket.ChangeStatusTicket.completedTitle')}
              </Button>
              {/* isDelete when inventoryTicket has completionProgress === 0  */}
              {inventoryTicket?.completionProgress === 0 && (
                <Button
                  className=" flex items-center min-w-[300px] 2xl:min-w-[350px] justify-center  "
                  danger
                  size="large"
                  shape="round"
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteTicket}
                >
                  Delete Ticket
                </Button>
              )}
            </Space>
          </Card>
        )}
        {isEdit === 'Update' && (
          <Card
            className="w-full  xl:w-3/6 "
            title={`${t('inventoryManagement.detailTicket.UpdateInfo')}`}
            headStyle={{
              fontSize: '20px',
              lineHeight: '26px',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            <Form
              name="IsEditUpdate"
              // {...formItemLayout}
              layout="vertical"
              labelWrap
              onFinish={handleUpdateDetailTicket}
              className="w-full font-semibold text-base p-0 "
            >
              <Form.Item
                initialValue={inventoryTicket?.description}
                className="font-bold  "
                label={`${t('inventoryManagement.detailTicket.form.description')}`}
                name="description"
              >
                <TextArea
                  className="font-normal"
                  rows={1}
                  placeholder={`${t('inventoryManagement.detailTicket.form.description')}`}
                />
              </Form.Item>
              <Form.Item
                label={`${t('inventoryManagement.detailTicket.form.ticketFile')}`}
                name="ticketFile"
                valuePropName="file"
                getValueFromEvent={normFile}
                rules={[
                  { required: false },
                  {
                    validator(_, file) {
                      // If haven't file or have file and file[0] === undefined => Don't validate
                      if (!file || (file && !file[0])) return Promise.resolve();
                      // If have file => check file size <= 28MB
                      if (file) {
                        const isLt28M = file[0].size / 1024 / 1024 <= 28;
                        // => true => pass validation
                        if (isLt28M) return Promise.resolve();
                        // => false thought error message
                        return Promise.reject(new Error('File tải lên có kích thước tối đa 28MB'));
                      }
                    },
                  },
                ]}
              >
                <Upload.Dragger
                  name="File"
                  action={`${import.meta.env.VITE_BASE_URL_}/uploads/`}
                  multiple
                  accept="image/*,.pdf"
                  maxCount={1}
                  listType="picture"
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    return false;
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">{t('UploadDragger.Title')}</p>
                  <p className="ant-upload-hint">{t('UploadDragger.Desc')} PNG, JPG, PDF</p>
                </Upload.Dragger>
              </Form.Item>

              <div className="gap-3 clear-right float-right  ">
                {/* <Form.Item> */}
                <Button
                  htmlType="submit"
                  className="bg-green-500 hover:bg-green-400 flex  items-center "
                  size="large"
                  type="primary"
                  shape="round"
                  icon={<CheckOutlined />}
                >
                  {t('buttons.saveChanges')}
                </Button>
                {/* </Form.Item> */}
              </div>
            </Form>
          </Card>
        )}
        {isEdit === 'Completed' && (
          <Card
            className="w-full  xl:w-3/6 "
            title={`${t('inventoryManagement.detailTicket.ChangeStatusTicket.completedTitle')}`}
            headStyle={{
              fontSize: '20px',
              lineHeight: '26px',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            <Form
              name="IsEditCompleted"
              layout="vertical"
              labelWrap
              onFinish={handleConfirmCompletion}
              className="w-full font-semibold text-base p-0 "
            >
              <Form.Item
                name="slot"
                label={`
                ${t('inventoryManagement.detailTicket.productQuantities.dispenserSlot')}
               `}
                rules={[{ required: true }]}
                colon
              >
                <Select
                  placeholder={`
                  ${t('inventoryManagement.detailTicket.productQuantities.dispenserSlot')} ...
                 `}
                  virtual={false}
                  mode="multiple"
                  allowClear
                >
                  {inventoryTicket &&
                    inventoryTicket.productQuantities
                      .filter((item) => item.completionState === CompletionStingStatus.Pending)
                      .map((product) => (
                        <Option key={product.dispenserSlot} value={product.dispenserSlot}>
                          {t('inventoryManagement.detailTicket.productQuantities.dispenserSlot')}{' '}
                          {product.dispenserSlot}
                        </Option>
                      ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={`${t(
                  'inventoryManagement.detailTicket.productQuantities.confirmationImageKey'
                )}`}
                name="verificationImage"
                valuePropName="file"
                getValueFromEvent={normFile}
                rules={[
                  { required: true },
                  {
                    validator(_, file) {
                      // If haven't file or have file and file[0] === undefined => Don't validate
                      if (!file || (file && !file[0])) return Promise.resolve();
                      // If have file => check file size <= 28MB
                      if (file) {
                        const isLt28M = file[0].size / 1024 / 1024 <= 28;
                        // => true => pass validation
                        if (isLt28M) return Promise.resolve();
                        // => false thought error message
                        return Promise.reject(new Error('File tải lên có kích thước tối đa 28MB'));
                      }
                    },
                  },
                ]}
              >
                <Upload.Dragger
                  name="File"
                  multiple
                  accept="image/*"
                  maxCount={1}
                  listType="picture"
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    return false;
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">{t('UploadDragger.Title')}</p>
                  <p className="ant-upload-hint">{t('UploadDragger.Desc')} PNG, JPG</p>
                </Upload.Dragger>
              </Form.Item>

              <div className="gap-3 clear-right float-right  ">
                {/* <Form.Item> */}
                <Button
                  htmlType="submit"
                  className="bg-green-500 hover:bg-green-400 flex  items-center "
                  size="large"
                  type="primary"
                  shape="round"
                  icon={<CheckOutlined />}
                >
                  {t('buttons.confirm')}
                </Button>
                {/* </Form.Item> */}
              </div>
            </Form>
          </Card>
        )}
      </div>
      <Divider
        orientation="center"
        className="px-3 font-bold text-2xl  text-inherit text-center  my-4"
      >
        {t('inventoryManagement.detailTicket.info')}
      </Divider>

      <List
        className="w-full mt-4 "
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 4,
          xxl: 4,
        }}
        dataSource={inventoryTicket?.productQuantities}
        renderItem={(item, index) => (
          <List.Item>
            <Card
              className={`${
                item.completionState === CompletionStingStatus.Disabled && 'contrast-75 '
              }`}
              headStyle={{
                fontSize: '16px',
                lineHeight: '26px',
                fontWeight: '600',
              }}
              hoverable
              title={`${t('inventoryManagement.detailTicket.info')} ${index + 1}`}
              actions={[
                <>
                  {item.confirmationImage && (
                    <Tooltip
                      title={`${t(
                        'inventoryManagement.detailTicket.productQuantities.confirmationImageKey'
                      )}`}
                      color={'green'}
                      key={item.confirmationImage}
                      placement="bottom"
                      className="px-20 "
                    >
                      <EyeOutlined
                        style={{ fontSize: '20px' }}
                        key="setting"
                        onClick={() => {
                          setPreviewImg({
                            isPdf: false,
                            previewOpen: true,
                            previewImage: item.confirmationImage ?? '',
                            previewTitle: `
                            ${t(
                              'inventoryManagement.detailTicket.productQuantities.dispenserSlot'
                            )}: ${item.dispenserSlot} - ${t(
                              'inventoryManagement.detailTicket.productQuantities.assigneeName'
                            )}: ${item.assignee}`,
                          });
                        }}
                      />
                    </Tooltip>
                  )}
                </>,
              ]}
              extra={
                <Switch
                  // loading
                  disabled={item.completionState === CompletionStingStatus.Completed}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={item.completionState !== CompletionStingStatus.Disabled}
                  onChange={(checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => {
                    console.log(checked, event);
                    showConfirmNotify(
                      `${t('inventoryManagement.detailTicket.ChangeStatusTicket.title')} ${
                        index + 1
                      }`,
                      ` ${
                        item.completionState === CompletionStingStatus.Disabled
                          ? t('inventoryManagement.detailTicket.ChangeStatusTicket.enabledMess')
                          : t('inventoryManagement.detailTicket.ChangeStatusTicket.DisabledMess')
                      }`,
                      item.completionState,
                      [item.dispenserSlot]
                    );
                  }}
                />
              }
            >
              <div className="flex flex-col items-center  ">
                <div className="w-full flex py-1">
                  <p className=" font-medium text-base  w-3/6 ">
                    {t('inventoryManagement.detailTicket.productQuantities.itemCode')}
                  </p>
                  <p className=" font-medium text-base  w-3/6  break-words">{item.itemCode}</p>
                </div>

                <div className="w-full flex py-1 ">
                  <p className=" font-medium text-base  w-3/6  ">
                    {t('inventoryManagement.detailTicket.productQuantities.dispenserSlot')}:
                  </p>
                  <p className=" font-medium text-base  w-3/6   ">{item.dispenserSlot}</p>
                </div>
                <div className="w-full flex py-1 ">
                  <p className=" font-medium text-base  w-3/6  ">
                    {t('inventoryManagement.detailTicket.productQuantities.quantity')}:
                  </p>
                  <p className=" font-medium text-base  w-3/6   ">{item.quantity}</p>
                </div>
                {item.from?.toString() && (
                  <div className="w-full flex py-1 ">
                    <p className=" font-medium text-base  w-3/6  ">
                      {t('inventoryManagement.detailTicket.productQuantities.from')}:
                    </p>
                    <p className=" font-medium text-base  w-3/6   ">{item.from}</p>
                  </div>
                )}
                {item.to?.toString() && (
                  <div className="w-full flex py-1 ">
                    <p className=" font-medium text-base  w-3/6  ">
                      {t('inventoryManagement.detailTicket.productQuantities.to')}:
                    </p>
                    <p className=" font-medium text-base  w-3/6   ">{item.to}</p>
                  </div>
                )}

                <div className="w-full flex py-1 ">
                  <p className=" font-medium text-base  w-3/6  ">
                    {t('inventoryManagement.detailTicket.productQuantities.assigneeName')}:
                  </p>
                  <p className=" font-medium text-base  w-3/6   ">{item.assignee}</p>
                </div>

                <div className="w-full flex py-1 ">
                  <p className=" font-medium text-base  w-3/6  ">{t('kiosk.detail.form.status')}</p>
                  <p className=" font-medium text-base  w-3/6  ">
                    <Tag
                      className="m-0"
                      color={
                        item.completionState === CompletionStingStatus.Completed
                          ? 'success'
                          : item.completionState === CompletionStingStatus.Pending
                          ? 'warning'
                          : 'error'
                      }
                      icon={
                        item.completionState === CompletionStingStatus.Completed ? (
                          <CheckCircleOutlined />
                        ) : item.completionState === CompletionStingStatus.Pending ? (
                          <SyncOutlined spin />
                        ) : (
                          <CloseCircleOutlined />
                        )
                      }
                      key={'isOnline'}
                    >
                      {item.completionState.toUpperCase()}
                    </Tag>
                  </p>
                </div>
                {item.finishedAt && (
                  <div className="w-full flex py-1 ">
                    <p className=" font-medium text-base  w-3/6  ">
                      {t('inventoryManagement.detailTicket.productQuantities.finishedAt')}:
                    </p>
                    <p className=" font-medium text-base  w-3/6">
                      {moment(item.finishedAt).format('DD/MM/YYYY : h:mm A')}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </List.Item>
        )}
      />

      {previewImg.previewOpen && (
        <ModalPreviewImgComponent
          isPdf={previewImg.isPdf}
          previewOpen={previewImg.previewOpen}
          previewTitle={previewImg.previewTitle}
          handleCancel={handleCancel}
          previewImage={previewImg.previewImage}
        />
      )}
    </>
  );
}
export default memo(InventoryInfo);
