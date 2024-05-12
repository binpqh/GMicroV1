import {
  CheckOutlined,
  CloseOutlined,
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { RcFile } from 'antd/es/upload';
import { lazy, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../../apps/hooks';
import { TProduct, TProductItem, TUpdateProductItem } from '../../../interface';
import ProductApi from '../../../service/product.service';
import { getBase64, normFile } from '../../../utils/formattImg';
import { showToastErrors } from '../../../utils/toast_errors';
import AlertMess from '../../../Components/AlertMess/AlertMess';

const formItemLayout = {
  wrapperCol: { span: 24 },
};
const ModalPreviewImgComponent = lazy(
  () => import('../../../Components/ModalPreviewImg')
);
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 24 },
};

const initValueAddProductItem = [
  {
    'itemVietnamese.codeTitle': '',
    'itemVietnamese.note': '',
    codeItem: '',
    'itemVietnamese.price': 0,

    'itemVietnamese.description': [''],
    'itemEnglish.codeTitle': '',
    'itemEnglish.note': '',
    'itemEnglish.price': 0,

    'itemEnglish.description': [''],
  },
];

export interface IEditProductItemProps {
  productCode: string;
  productItem: TUpdateProductItem[];
  handleCloseDrawer: () => void;
  isEdit: boolean;
  handleTriggerRender: () => void;
}

function EditProductItem({
  productCode,
  productItem,
  handleCloseDrawer,
  isEdit,
  handleTriggerRender,
}: IEditProductItemProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('lng');

  const [previewImg, setPreviewImg] = useState<{
    previewOpen: boolean;
    previewImage: any;
    previewTitle: any;
  }>({
    previewOpen: false,
    previewImage: '',
    previewTitle: '',
  });

  const handleCancel = () =>
    setPreviewImg({ ...previewImg, previewOpen: false });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImg({
      previewOpen: true,
      previewImage: file.url || (file.preview as string),
      previewTitle:
        file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    });
  };

  const handleUpdateProductItem = async (data: any) => {
    try {
      console.log('add Product');
      dispatch(setLoading(true));
      const response = await ProductApi.UpdateProductItem(data, productCode);
      toast.success('Cập nhật Gói / Thẻ Thành Công');
      // form.resetFields();
      handleTriggerRender();
      handleCloseDrawer();
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log(error);
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };
  const handleAddProductItem = async (data: any) => {
    try {
      dispatch(setLoading(true));
      const response = await ProductApi.AddProductItem(data, productCode);
      toast.success('Thêm Gói / Thẻ Thành Công');
      form.resetFields();
      handleTriggerRender();
      handleCloseDrawer();
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log(error);
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    isEdit ? handleUpdateProductItem(values) : handleAddProductItem(values);
  };
  useEffect(() => {
    //reset form when product is updated
    // console.log('reset From');
    isEdit && form.resetFields();
  }, []);
  return (
    <div>
      <Form
        {...formItemLayout}
        labelWrap
        name="EditProductItem"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="w-full font-semibold text-base "
      >
        <div className="flex justify-center items-start gap-5 flex-wrap lg:flex-nowrap">
          {productItem && (
            <Card
              className="w-full  "
              title={`VietNamese`}
              headStyle={{
                fontSize: '20px',
                lineHeight: '26px',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              <Form.List
                name="items"
                initialValue={isEdit ? productItem : initValueAddProductItem}
                // check if isEdit set init value for edit item else set default add item
                rules={[
                  {
                    validator: async (_, items) => {
                      if (!isEdit && items.length < 1) {
                        return Promise.reject(
                          new Error('Ít nhất phải tạo 1 Gói / Thẻ ')
                        );
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <div
                    style={{
                      display: 'flex',
                      rowGap: 16,
                      flexDirection: 'column',
                    }}
                  >
                    {fields.map((field) => (
                      <Card
                        className="bg-colorBgItem text-primary"
                        headStyle={{
                          fontSize: '18px',
                          lineHeight: '24px',
                          fontWeight: '600',
                          textAlign: 'center',
                          color: '#ff2f48',
                        }}
                        size="small"
                        title={
                          isEdit
                            ? `Cập nhật Gói / Thẻ ${field.name + 1}`
                            : `Thêm Gói / Thẻ ${field.name + 1}`
                        }
                        key={field.key}
                        extra={
                          <>
                            {!isEdit && (
                              <CloseOutlined
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            )}
                          </>
                        }
                      >
                        <div className="flex justify-center items-start gap-4 flex-wrap lg:flex-nowrap">
                          <Form.Item
                            className="w-full"
                            label="Mã tiêu đề "
                            name={[field.name, 'itemVietnamese.codeTitle']}
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            className="w-full"
                            label="Mã Gói / Thẻ"
                            name={[field.name, 'codeItem']}
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            className="w-full"
                            label="Giá (VND)"
                            name={[field.name, 'itemVietnamese.price']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              className="w-full"
                              addonAfter={'VNĐ'}
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                              parser={(value) =>
                                value!.replace(/\$\s?|(,*)/g, '')
                              }
                            />
                          </Form.Item>
                        </div>

                        <Form.Item
                          label="Ghi Chú"
                          name={[field.name, 'itemVietnamese.note']}
                        >
                          <TextArea rows={3} />
                        </Form.Item>
                        <Form.Item
                          label="Hình Gói / Thẻ"
                          name={[field.name, 'itemVietnamese.itemIcon']}
                          rules={[{ required: true }]}
                          getValueFromEvent={normFile}
                          valuePropName="File"
                        >
                          <Upload.Dragger
                            name="File"
                            action={`${
                              import.meta.env.VITE_BASE_URL_
                            }/uploads/`}
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
                            <p className="ant-upload-text">
                              {t('UploadDragger.Title')}
                            </p>
                            <p className="ant-upload-hint">
                              {t('UploadDragger.Desc')} PNG, JPG
                            </p>
                          </Upload.Dragger>
                        </Form.Item>

                        <Form.Item label="Mô tả" className="mb-0">
                          <Form.List
                            name={[field.name, 'itemVietnamese.description']}
                            rules={[
                              {
                                validator: async (_, desc) => {
                                  if (desc && desc.length > 4) {
                                    return Promise.reject(
                                      new Error('Tối đa được tạo 4 description')
                                    );
                                  }
                                },
                              },
                            ]}
                          >
                            {(fields, { add, remove }, { errors }) => (
                              <>
                                {fields.map((field, index) => (
                                  <Form.Item
                                    {...formItemLayoutWithOutLabel}
                                    // label={index === 0 ? 'Description' : ''}
                                    required={false}
                                    key={field.key}
                                  >
                                    <Form.Item
                                      {...field}
                                      validateTrigger={['onChange', 'onBlur']}
                                      rules={[
                                        {
                                          required: true,
                                          whitespace: true,
                                          message:
                                            'Vui lòng nhập mô tả hoặc xóa trường này.',
                                        },
                                      ]}
                                      noStyle
                                    >
                                      <Input
                                        placeholder="Nhập mô tả"
                                        className="w-5/6 lg:w-[80%] xl:w-[85%]"
                                      />
                                    </Form.Item>

                                    <MinusCircleOutlined
                                      className="dynamic-delete-button px-4 hover:text-colorError "
                                      onClick={() => remove(field.name)}
                                    />
                                  </Form.Item>
                                ))}
                                <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '100%' }}
                                    icon={<PlusOutlined />}
                                  >
                                    Thêm mô tả
                                  </Button>

                                  <Form.ErrorList errors={errors} />
                                </Form.Item>
                              </>
                            )}
                          </Form.List>
                        </Form.Item>
                      </Card>
                    ))}
                    {!isEdit && (
                      <>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          style={{ width: '100%' }}
                          icon={<PlusOutlined />}
                        >
                          Thêm Gói / Thẻ
                        </Button>
                        <Form.ErrorList
                          className="text-errorColor text-base font-semibold text-center"
                          errors={errors}
                        />
                      </>
                    )}
                  </div>
                )}
              </Form.List>
            </Card>
          )}
          {productItem && (
            <Card
              className="w-full  "
              title={`English`}
              headStyle={{
                fontSize: '20px',
                lineHeight: '26px',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              <Form.List
                name="items"
                rules={[
                  {
                    validator: async (_, items) => {
                      if (!isEdit && items.length < 1) {
                        return Promise.reject(
                          new Error('At least 1 Pack / Card must be created ')
                        );
                      }
                    },
                  },
                ]}
                // initialValue={isEdit ? productItem : [0]}
                // check if isEdit set init value for edit item else set default add item
              >
                {(fields, { add, remove }, { errors }) => (
                  <div
                    style={{
                      display: 'flex',
                      rowGap: 16,
                      flexDirection: 'column',
                    }}
                  >
                    {fields.map((field) => (
                      <Card
                        className="bg-colorBgItem text-primary"
                        headStyle={{
                          fontSize: '18px',
                          lineHeight: '24px',
                          fontWeight: '600',
                          textAlign: 'center',
                          color: '#ff2f48',
                        }}
                        size="small"
                        title={
                          isEdit
                            ? `Update Pack / Card ${field.name + 1}`
                            : `Add Pack / Card ${field.name + 1}`
                        }
                        key={field.key}
                        extra={
                          <>
                            {!isEdit && (
                              <CloseOutlined
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            )}
                          </>
                        }
                      >
                        <div className="flex justify-center items-start gap-4 flex-wrap lg:flex-nowrap">
                          <Form.Item
                            className="w-full"
                            label="Code Title "
                            name={[field.name, 'itemEnglish.codeTitle']}
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            className="w-full"
                            label="Code Pack/Card"
                            name={[field.name, 'codeItem']}
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            className="w-full"
                            label="Price ($)"
                            name={[field.name, 'itemEnglish.price']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              className="w-full"
                              addonBefore={'$'}
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                              parser={(value) =>
                                value!.replace(/\$\s?|(,*)/g, '')
                              }
                            />
                          </Form.Item>
                        </div>

                        <Form.Item
                          label="Note"
                          name={[field.name, 'itemEnglish.note']}
                        >
                          <TextArea rows={3} />
                        </Form.Item>
                        <Form.Item
                          label="Package Image"
                          name={[field.name, 'itemEnglish.itemIcon']}
                          rules={[{ required: true }]}
                          getValueFromEvent={normFile}
                          valuePropName="File"
                        >
                          <Upload.Dragger
                            name="File"
                            action={`${
                              import.meta.env.VITE_BASE_URL_
                            }/uploads/`}
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
                            <p className="ant-upload-text">
                              {t('UploadDragger.Title')}
                            </p>
                            <p className="ant-upload-hint">
                              {t('UploadDragger.Desc')} PNG, JPG
                            </p>
                          </Upload.Dragger>
                        </Form.Item>

                        <Form.Item label="Description" className="mb-0">
                          <Form.List
                            name={[field.name, 'itemEnglish.description']}
                            rules={[
                              {
                                validator: async (_, desc) => {
                                  if (desc && desc.length > 4) {
                                    return Promise.reject(
                                      new Error('Tối đa được tạo 4 description')
                                    );
                                  }
                                },
                              },
                            ]}
                          >
                            {(fields, { add, remove }, { errors }) => (
                              <>
                                {fields.map((field, index) => (
                                  <Form.Item
                                    {...formItemLayoutWithOutLabel}
                                    // label={index === 0 ? 'Description' : ''}
                                    required={false}
                                    key={field.key}
                                  >
                                    <Form.Item
                                      {...field}
                                      validateTrigger={['onChange', 'onBlur']}
                                      rules={[
                                        {
                                          required: true,
                                          whitespace: true,
                                          message:
                                            'Vui lòng nhập mô tả hoặc xóa trường này.',
                                        },
                                      ]}
                                      noStyle
                                    >
                                      <Input
                                        placeholder="Nhập mô tả"
                                        className="w-5/6 lg:w-[80%] xl:w-[85%]"
                                      />
                                    </Form.Item>

                                    <MinusCircleOutlined
                                      className="dynamic-delete-button px-4 hover:text-colorError "
                                      onClick={() => remove(field.name)}
                                    />
                                  </Form.Item>
                                ))}
                                <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '100%' }}
                                    icon={<PlusOutlined />}
                                  >
                                    Add Description
                                  </Button>

                                  <Form.ErrorList errors={errors} />
                                </Form.Item>
                              </>
                            )}
                          </Form.List>
                        </Form.Item>
                      </Card>
                    ))}
                    {!isEdit && (
                      <>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          style={{ width: '100%' }}
                          icon={<PlusOutlined />}
                        >
                          Add Pack / Card
                        </Button>
                        <Form.ErrorList
                          className="text-errorColor text-base font-semibold text-center"
                          errors={errors}
                        />
                      </>
                    )}
                  </div>
                )}
              </Form.List>
            </Card>
          )}
        </div>
        {/* <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item> */}
        <Button
          htmlType="submit"
          className=" mt-4 py-0 px-4 flex items-center w-full justify-center "
          size="large"
          type="primary"
          shape="round"
          icon={<CheckOutlined />}
        >
          {isEdit
            ? t('product.DetailProduct.UpdatePackage')
            : t('product.DetailProduct.AddPackage')}
        </Button>
      </Form>

      {previewImg.previewOpen && (
        <ModalPreviewImgComponent
          previewOpen={previewImg.previewOpen}
          previewTitle={previewImg.previewTitle}
          handleCancel={handleCancel}
          previewImage={previewImg.previewImage}
        />
      )}
    </div>
  );
}

export default memo(EditProductItem);
