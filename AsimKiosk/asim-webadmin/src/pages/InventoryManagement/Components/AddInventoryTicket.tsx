import { lazy, memo, useState } from 'react';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../../apps/hooks';
import { TDispenser, TKioskListDropDownInventory } from '../../../interface';

import {
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  InboxOutlined,
  NodeExpandOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tag,
  Upload,
} from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

import { toast } from 'react-toastify';

const ModalPreviewImgComponent = lazy(
  () => import('../../../Components/ModalPreviewImg')
);

import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import AlertMess from '../../../Components/AlertMess/AlertMess';
import { TWarehouseTicketRequest } from '../../../interface/TInventory';
import InventoryApi from '../../../service/Inventory.service';
import { getBase64, normFile } from '../../../utils/formattImg';
import { showToastErrors } from '../../../utils/toast_errors';

const { Option } = Select;

const formItemLayout = {
  // labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

export interface IAddInventoryTicketProps {
  handleRerender: () => void;
  handleCloseDrawer: () => void;
  kioskList: TKioskListDropDownInventory[];
}
let rawCurrentKiosk: TKioskListDropDownInventory | undefined;
function AddInventoryTicket({
  handleRerender,
  handleCloseDrawer,
  kioskList,
}: IAddInventoryTicketProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { dispensers } = form.getFieldsValue();
  const { t } = useTranslation('lng');
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<any>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const [currentKiosk, setCurrentKiosk] =
    useState<TKioskListDropDownInventory>();

  const handleCreateTicket = async (values: TWarehouseTicketRequest) => {
    console.log(values);
    try {
      dispatch(setLoading(true));
      const response = await InventoryApi.createTicket(values);
      dispatch(setLoading(false));
      handleRerender();
      handleCloseDrawer();
      toast.success('Thêm Ticket thành công');
      form.resetFields();
    } catch (error: any) {
      console.log(error);
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };

  const onFinish = (values: TWarehouseTicketRequest) => {
    console.log('Received values of form: ', values);

    handleCreateTicket(values);
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    // preview when file is not pdf
    if (file.type !== 'application/pdf') {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }

      setPreviewImage(file.url || (file.preview as string));
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
      );
    }
  };

  const handleKioskChange = (valueId: any) => {
    // console.log(value);
    const currentKiosk = kioskList?.find((kiosk) => kiosk.deviceId === valueId);
    form.setFieldsValue({
      groupId: currentKiosk?.groupId,
      groupName: currentKiosk?.groupName,
    });
    setCurrentKiosk(currentKiosk);
    rawCurrentKiosk = currentKiosk;

    // when change Kiosk set fields dispensers : null
    const { dispensers } = form.getFieldsValue();
    console.log('handleKioskChange', dispensers);
    dispensers &&
      form.setFieldsValue({
        dispensers: null,
      });
  };

  const handleDispenserChange = (value: string, option: any) => {
    // get All Fields from Form to set dispenserSlot
    console.log('Value Change', value, option);
    const { dispensers } = form.getFieldsValue();

    const setFieldDispensers = dispensers.map((dispenser: TDispenser) => {
      if (dispenser && dispenser.itemCode === value) {
        return {
          ...dispenser,
          itemCode: value.slice(0, -2),
          dispenserSlot: option.key,

          // option.key is the dispenserSlot of current Kiosk
        };
      }
      return dispenser;
    });
    console.log('handleDispenserChange', setFieldDispensers);
    form.setFieldsValue({ dispensers: setFieldDispensers });

    const newDispenser = rawCurrentKiosk?.dispensers?.filter((dispenser) => {
      return (
        `${dispenser.itemCode}-${dispenser.dispenserSlot}` !== value &&
        setFieldDispensers.findIndex(
          (fieldDispenser: TDispenser) =>
            fieldDispenser &&
            Number(fieldDispenser.dispenserSlot) === dispenser.dispenserSlot
        ) === -1
      );
    });

    const newCurrentKiosk = {
      ...currentKiosk,
      dispensers: newDispenser ?? [],
      deviceId: currentKiosk?.deviceId || '',
      kioskName: currentKiosk?.kioskName ?? '',
      groupId: currentKiosk?.groupId ?? '',
      groupName: currentKiosk?.groupName ?? '',
    };
    // console.log(newDispenser);
    setCurrentKiosk(newCurrentKiosk);
  };

  const handleCloseFieldDispenser = () => {
    const { dispensers } = form.getFieldsValue();

    // filter current kiosk dispenser haven't chose yet
    const newDispenser = rawCurrentKiosk?.dispensers.filter(
      (item1) =>
        !dispensers.some(
          (item2: any) => item1.dispenserSlot.toString() === item2.dispenserSlot
        )
    );
    const newCurrentKiosk = {
      ...currentKiosk,
      dispensers: newDispenser ?? [],
      deviceId: currentKiosk?.deviceId || '',
      kioskName: currentKiosk?.kioskName ?? '',
      groupId: currentKiosk?.groupId ?? '',
      groupName: currentKiosk?.groupName ?? '',
    };
    setCurrentKiosk(newCurrentKiosk);
  };

  const CheckHasSerialNumbers = (fieldName: number) => {
    const { dispensers } = form.getFieldsValue();
    const newDispenser = rawCurrentKiosk?.dispensers.find(
      (dispenser) =>
        dispensers[fieldName]?.dispenserSlot ===
          dispenser.dispenserSlot.toString() &&
        dispensers[fieldName]?.itemCode === dispenser.itemCode
    );
    return newDispenser?.hasSerialNumbers ? true : false;
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
            onChange={handleKioskChange}
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

        <div className="flex justify-center items-start gap-4 flex-wrap lg:flex-nowrap">
          <Form.Item
            className="flex-1 "
            name="groupId"
            label="Id Group"
            rules={[{ required: true }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            className="flex-1 "
            name="groupName"
            label={`${t('inventoryManagement.detailTicket.form.groupName')}`}
            rules={[{ required: true }]}
          >
            <Input disabled={true} />
          </Form.Item>
        </div>

        <Form.Item
          className="flex-1 "
          name="description"
          label={`${t('inventoryManagement.detailTicket.form.description')}`}
        >
          <TextArea
            rows={2}
            placeholder={`${t(
              'inventoryManagement.detailTicket.form.description'
            )}`}
          />
        </Form.Item>

        <Form.Item
          label={`${t('inventoryManagement.detailTicket.form.ticketFile')}`}
          name="ticketFile"
          valuePropName="file"
          getValueFromEvent={normFile}
          // rules={[{ required: true }]}
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
              // console.log({ file });
              return false;
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{t('UploadDragger.Title')}</p>
            <p className="ant-upload-hint">
              {t('UploadDragger.Desc')} PNG, JPG, PDF
            </p>
          </Upload.Dragger>
        </Form.Item>
        {/* --------- have chose kiosk => Show ticket info------------- */}
        {currentKiosk && (
          <>
            <AlertMess
              type="info"
              message={`${t('inventoryManagement.AlertAddTicketMess')}`}
              showIcon={true}
            ></AlertMess>

            <Form.List
              name="dispensers"
              // label="description"
              rules={[
                {
                  validator: async (_, disp) => {
                    if (!disp || disp.length < 1) {
                      return Promise.reject(
                        new Error(
                          `${t(
                            'inventoryManagement.detailTicket.validate1Product'
                          )}`
                        )
                      );
                    }
                  },
                },
                {
                  validator: async (_, disp) => {
                    if (disp && disp.length > 4) {
                      return Promise.reject(
                        new Error(
                          `${t(
                            'inventoryManagement.detailTicket.validate4Product'
                          )}`
                        )
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  <div
                    className={`grid grid-rows-1 md:grid-flow-col gap-4 ${
                      fields.length > 0 && 'mt-4'
                    } `}
                  >
                    {fields.map((field) => (
                      <Card
                        className="bg-colorBgItem text-primary flex-1"
                        headStyle={{
                          fontSize: '18px',
                          lineHeight: '24px',
                          fontWeight: '600',
                          textAlign: 'center',
                          color: '#ff2f48',
                        }}
                        size="small"
                        title={`${t('inventoryManagement.detailTicket.info')} ${
                          field.name + 1
                        }`}
                        key={field.key}
                        extra={
                          <CloseOutlined
                            onClick={() => {
                              remove(field.name);
                              handleCloseFieldDispenser();
                            }}
                          />
                        }
                      >
                        <Form.Item
                          name={[field.name, 'itemCode']}
                          // label={`${t('register.form.groupId')}`}
                          label={`${t(
                            'inventoryManagement.detailTicket.productQuantities.itemCode'
                          )}`}
                          rules={[{ required: true }]}
                          colon
                        >
                          <Select
                            placeholder={`${t(
                              'inventoryManagement.detailTicket.productQuantities.itemCode'
                            )}`}
                            onChange={handleDispenserChange}
                          >
                            {currentKiosk &&
                              currentKiosk.dispensers?.map(
                                (dispenser) =>
                                  // chỉ lấy những khay thẻ nào full thẻ => để thêm tồn kho
                                  dispenser.spaceRemaining !== 0 && (
                                    <Option
                                      key={dispenser.dispenserSlot}
                                      value={`${dispenser.itemCode}-${dispenser.dispenserSlot}`}
                                    >
                                      {`${dispenser.itemCode} - ${t(
                                        'inventoryManagement.detailTicket.productQuantities.dispenserSlot'
                                      )} ${dispenser.dispenserSlot}`}
                                    </Option>
                                  )
                              )}
                          </Select>
                        </Form.Item>
                        <div className="flex justify-center items-start gap-4 flex-wrap lg:flex-nowrap w-full ">
                          <Form.Item
                            label={`${t(
                              'inventoryManagement.detailTicket.productQuantities.dispenserSlot'
                            )}`}
                            name={[field.name, 'dispenserSlot']}
                            rules={[{ required: true }]}
                            className="w-full"
                          >
                            <Input disabled={true} />
                          </Form.Item>
                          <Form.Item
                            className="w-full"
                            label={`${t(
                              'inventoryManagement.detailTicket.productQuantities.quantity'
                            )}`}
                            name={[field.name, 'quantity']}
                            rules={[
                              {
                                required: true,
                              },
                              {
                                validator(_, value) {
                                  const { dispensers } = form.getFieldsValue();

                                  const dispenserSlotValue =
                                    dispensers[field.name].dispenserSlot;
                                  const quantityValue =
                                    dispensers[field.name].quantity;

                                  const currentDispenser =
                                    rawCurrentKiosk?.dispensers.find(
                                      (dispenser) =>
                                        dispenser.dispenserSlot ===
                                        Number(dispenserSlotValue)
                                    );
                                  // console.log(
                                  //   'currentDispenser',
                                  //   quantityValue,

                                  //   currentDispenser
                                  // );

                                  if (
                                    // Check Space Remaining quantity card => valid when quantity input value is less than or equal to Space Remaining
                                    currentDispenser &&
                                    currentDispenser.spaceRemaining >=
                                      quantityValue
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      `
                                      ${
                                        currentDispenser
                                          ? `${t(
                                              'inventoryManagement.detailTicket.validateMess.maxCard'
                                            )} : ${
                                              currentDispenser.spaceRemaining
                                            } ${t(
                                              'inventoryManagement.detailTicket.validateMess.card'
                                            )} `
                                          : 'Vui lòng chọn khay thẻ'
                                      } `
                                    )
                                  );
                                },
                              },
                            ]}
                            // initialValue={5}
                          >
                            <InputNumber
                              min={1}
                              max={250}
                              className="w-full"
                              prefix={<NodeExpandOutlined />}
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                            />
                          </Form.Item>
                        </div>

                        {CheckHasSerialNumbers(field.name) && (
                          <>
                            <AlertMess
                              className="mb-3 w-full"
                              type="info"
                              message={`${t(
                                'inventoryManagement.detailTicket.productQuantities.AlertSimMess'
                              )}`}
                              showIcon={true}
                            ></AlertMess>

                            <Form.Item
                              label={`${t(
                                'inventoryManagement.detailTicket.productQuantities.from'
                              )}`}
                              name={[field.name, 'from']}
                              className=" flex-1"
                              rules={[
                                { required: true },
                                // {
                                //   validator(_, value) {
                                //     const { dispensers } =
                                //       form.getFieldsValue();

                                //     const toValue = dispensers[field.name].to;
                                //     const quantityValue =
                                //       dispensers[field.name].quantity;

                                //     if (
                                //       value >= 0 &&
                                //       toValue >= 0 &&
                                //       quantityValue &&
                                //       toValue - value + 1 === quantityValue
                                //     ) {
                                //       return Promise.resolve();
                                //     }

                                //     return Promise.reject(
                                //       new Error(
                                //         'Tổng hiệu của 2 trường đó phải bằng Quantity'
                                //       )
                                //     );
                                //   },
                                // },
                              ]}
                              // initialValue={0}
                            >
                              <InputNumber
                                className=" w-full"
                                prefix={<NodeExpandOutlined />}
                                // formatter={(value) =>
                                //   `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                // }
                                // parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                              />
                            </Form.Item>
                            <Form.Item
                              label={`${t(
                                'inventoryManagement.detailTicket.productQuantities.to'
                              )}`}
                              name={[field.name, 'to']}
                              className="flex-1"
                              rules={[
                                { required: true },
                                {
                                  validator(_, value) {
                                    const { dispensers } =
                                      form.getFieldsValue();

                                    const fromValue =
                                      dispensers[field.name].from;
                                    const quantityValue =
                                      dispensers[field.name].quantity;

                                    if (
                                      value >= 0 &&
                                      fromValue >= 0 &&
                                      quantityValue &&
                                      value - fromValue + 1 === quantityValue
                                    ) {
                                      return Promise.resolve();
                                    }

                                    return Promise.reject(
                                      new Error(
                                        `${t(
                                          'inventoryManagement.detailTicket.validateMess.SerialTo'
                                        )} `
                                      )
                                    );
                                  },
                                },
                              ]}
                              // initialValue={4}
                            >
                              <InputNumber
                                className="w-full"
                                prefix={<NodeExpandOutlined />}
                                // formatter={(value) =>
                                //   `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                // }
                                // parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                              />
                            </Form.Item>
                          </>
                        )}
                      </Card>
                    ))}
                  </div>
                  {fields.length < 4 && (
                    <Form.Item className=" mt-4">
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: '100%' }}
                        icon={<PlusOutlined />}
                        className="text-base md:text-md"
                      >
                        {t('inventoryManagement.detailTicket.btnAddInfo')}
                      </Button>
                    </Form.Item>
                  )}
                  {errors.length > 0 && (
                    <Tag
                      icon={<CloseCircleOutlined />}
                      color="error"
                      className="w-full flex  text-base "
                    >
                      <Form.ErrorList errors={errors} />
                    </Tag>
                  )}
                </>
              )}
            </Form.List>
          </>
        )}

        <Button
          htmlType="submit"
          className=" mt-4 py-0 px-4 flex items-center w-full justify-center "
          size="large"
          type="primary"
          shape="round"
          icon={<CheckOutlined />}
        >
          {t('inventoryManagement.AddTicket')}
        </Button>
      </Form>
      {previewOpen && (
        <ModalPreviewImgComponent
          previewOpen={previewOpen}
          previewTitle={previewTitle}
          handleCancel={handleCancel}
          previewImage={previewImage}
        />
      )}
    </>
  );
}

export default memo(AddInventoryTicket);
