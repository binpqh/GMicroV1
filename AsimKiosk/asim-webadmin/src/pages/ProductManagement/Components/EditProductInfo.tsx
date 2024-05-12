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
  Checkbox,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import { lazy, memo, useEffect, useState } from 'react';
import { normFile, getBase64 } from '../../../utils/formattImg';
import { useAppDispatch } from '../../../apps/hooks';
import { TProduct } from '../../../interface';
import { useTranslation } from 'react-i18next';
import { RcFile } from 'antd/es/upload';
import ProductApi from '../../../service/product.service';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { showToastErrors } from '../../../utils/toast_errors';
import { toast } from 'react-toastify';
const { confirm } = Modal;
const formItemLayout = {
  // labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};
const ModalPreviewImgComponent = lazy(
  () => import('../../../Components/ModalPreviewImg')
);
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 24 },
};

export interface IEditProductInfoProps {
  productCode: string;
  product: TProduct;
  handleCloseDrawer: () => void;
  handleTriggerRender: () => void;
}

function EditProductInfo({
  productCode,
  product,
  handleCloseDrawer,
  handleTriggerRender,
}: IEditProductInfoProps) {
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

  const handleEditProduct = async (data: any) => {
    try {
      dispatch(setLoading(true));
      const response = await ProductApi.UpdateProduct(data, productCode);
      toast.success('Cập nhật sản phẩm Thành Công');
      handleTriggerRender();
      handleCloseDrawer();
      dispatch(setLoading(false));
      // form.resetFields();
    } catch (error: any) {
      console.log(error);
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);

    handleEditProduct(values);
  };

  useEffect(() => {
    //reset form when product is updated
    // console.log('reset From');
    form.resetFields();
  }, []);
  return (
    <div>
      <Form
        {...formItemLayout}
        labelWrap
        name="EditProductInfo"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="w-full font-semibold text-base px-4"
      >
        <Form.Item
          name="productName"
          label={t('product.DetailProduct.ProductName')}
          rules={[{ required: true }]}
          initialValue={product.productName}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item
          className="flex-1 "
          name="productCode"
          label={t('product.DetailProduct.ProductCode')}
          rules={[{ required: true }]}
          initialValue={product.productCode}
        >
          <Input />
        </Form.Item> */}

        <div className="flex justify-center items-start gap-4 flex-wrap lg:flex-nowrap">
          <Form.Item
            className="flex-1 "
            name="hotline"
            label={t('product.DetailProduct.HotLine')}
            rules={[{ required: true }]}
            initialValue={product.hotline}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            className="flex-1 "
            name="colorCodePrimary"
            label={t('product.DetailProduct.ColorCodePrimary')}
            rules={[{ required: true }]}
            initialValue={product.colorCodePrimary}
            getValueFromEvent={(color) => {
              // console.log(color, color.toHexString());
              return color.toHexString();
            }}
          >
            <ColorPicker showText allowClear format={'hex'} />
          </Form.Item>
          {product.colorCodeSecondary && (
            <Form.Item
              className="flex-1 "
              name="colorCodeSecondary"
              label={t('product.DetailProduct.ColorCodeSecondary')}
              initialValue={product.colorCodeSecondary}
              getValueFromEvent={(color) => {
                // console.log(color, color.toHexString());
                return color.toHexString();
              }}
            >
              <ColorPicker showText allowClear format={'hex'} />
            </Form.Item>
          )}

          <Form.Item
            name="isRequireSerialNumber"
            label={t('product.DetailProduct.isRequireSerialNumber')}
            valuePropName="checked"
            initialValue={product.isRequireSerialNumber}
          >
            <Checkbox>
              {t('product.DetailProduct.isRequireSerialNumber')}
            </Checkbox>
          </Form.Item>
        </div>
        <Form.Item
          label={t('product.DetailProduct.ProductIcon')}
          name="productIcon"
          valuePropName="file"
          getValueFromEvent={normFile}
          rules={[{ required: true }]}
        >
          <Upload.Dragger
            name="File"
            action={`${import.meta.env.VITE_BASE_URL_}/uploads/`}
            multiple
            accept="image/*"
            maxCount={1}
            listType="picture"
            onPreview={handlePreview}
            beforeUpload={(file) => {
              console.log({ file });
              return false;
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{t('UploadDragger.Title')}</p>
            <p className="ant-upload-hint">
              {t('UploadDragger.Desc')} PNG, JPG
            </p>
          </Upload.Dragger>
        </Form.Item>
        {/* ---------------------- */}

        <div className="flex justify-center items-start gap-4 flex-wrap lg:flex-nowrap">
          <Card
            className="w-full  "
            title={`Vietnamese`}
            headStyle={{
              fontSize: '20px',
              lineHeight: '26px',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            <Form.Item
              name="vietnameseContent.Title"
              label={t('product.ProductHeading.title')}
              initialValue={product.vietnameseContent.productTitle}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t('product.ProductHeading.productImg')}
              name="vietnameseContent.ProductPreviewImage"
              valuePropName="file"
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
            >
              <Upload.Dragger
                name="File"
                action={`${import.meta.env.VITE_BASE_URL_}/uploads/`}
                multiple
                listType="picture"
                onPreview={handlePreview}
                accept="image/*"
                maxCount={1}
                beforeUpload={(file) => {
                  console.log({ file });
                  return false;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">{t('UploadDragger.Title')}</p>
                <p className="ant-upload-hint">
                  {t('UploadDragger.Desc')} PNG, JPG
                </p>
              </Upload.Dragger>
            </Form.Item>

            {product.vietnameseContent.heading.heading &&
              product.vietnameseContent.heading.subHeading &&
              product.vietnameseContent.heading.description && (
                <Form.List
                  name="Information"
                  initialValue={[0]} // check have  product.vietnameseContent setInitialValue for fields
                >
                  {(fields, { add, remove }) => (
                    <div
                      style={{
                        display: 'flex',
                        rowGap: 16,
                        flexDirection: 'column',
                      }}
                    >
                      {fields.map((field) => (
                        <Card
                          headStyle={{
                            fontSize: '18px',
                            lineHeight: '24px',
                            fontWeight: '600',
                            textAlign: 'center',
                            color: '#ff2f48',
                          }}
                          className="bg-colorBgItem"
                          size="small"
                          title={t('product.ProductHeading.InfoHeading')}
                          key={field.key}
                          extra={
                            <CloseOutlined
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          }
                        >
                          <Form.Item
                            label={t('product.ProductHeading.Heading')}
                            initialValue={
                              product.vietnameseContent.heading.heading
                            }
                            name={[field.name, 'vietnameseContent.Heading']}
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'vietnameseContent.SubHeading']}
                            label={t('product.ProductHeading.SubHeading')}
                            initialValue={
                              product.vietnameseContent.heading.subHeading
                            }
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            label={t('product.ProductHeading.Description')}
                            className="mb-0"
                          >
                            <Form.List
                              name={[
                                field.name,
                                'vietnameseContent.Description',
                              ]}
                              rules={[
                                {
                                  validator: async (_, desc) => {
                                    if (!desc || desc.length < 1) {
                                      return Promise.reject(
                                        new Error(
                                          'Ít nhất phải có 1 description'
                                        )
                                      );
                                    }
                                    if (desc && desc.length > 4) {
                                      return Promise.reject(
                                        new Error(
                                          'Tối đa được tạo 4 description'
                                        )
                                      );
                                    }
                                  },
                                },
                              ]}
                              initialValue={
                                product.vietnameseContent.heading.description
                              }
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
                      {fields.length < 1 && (
                        <Button type="dashed" onClick={() => add()} block>
                          + Mô tả sản phẩm
                        </Button>
                      )}
                    </div>
                  )}
                </Form.List>
              )}
          </Card>

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
            <Form.Item
              name="englishContent.Title"
              label="Title"
              initialValue={product.englishContent.productTitle}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Product Image"
              name="englishContent.ProductPreviewImage"
              valuePropName="file"
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
            >
              <Upload.Dragger
                name="File"
                action={`${import.meta.env.VITE_BASE_URL_}/uploads/`}
                multiple
                listType="picture"
                onPreview={handlePreview}
                accept="image/*"
                maxCount={1}
                beforeUpload={(file) => {
                  console.log({ file });
                  return false;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">{t('UploadDragger.Title')}</p>
                <p className="ant-upload-hint">
                  {t('UploadDragger.Desc')} PNG, JPG
                </p>
              </Upload.Dragger>
            </Form.Item>

            {product.englishContent.heading.heading &&
              product.englishContent.heading.subHeading &&
              product.englishContent.heading.description && (
                <Form.List name="Information">
                  {(fields, { add, remove }) => (
                    <div
                      style={{
                        display: 'flex',
                        rowGap: 16,
                        flexDirection: 'column',
                      }}
                    >
                      {fields.map((field) => (
                        <Card
                          headStyle={{
                            fontSize: '18px',
                            lineHeight: '24px',
                            fontWeight: '600',
                            textAlign: 'center',
                            color: '#ff2f48',
                          }}
                          className="bg-colorBgItem"
                          size="small"
                          title={`Product Information Heading`}
                          key={field.key}
                          extra={
                            <CloseOutlined
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          }
                        >
                          <Form.Item
                            label="Heading"
                            initialValue={
                              product.englishContent.heading.heading
                            }
                            name={[field.name, 'englishContent.Heading']}
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'englishContent.SubHeading']}
                            label="SubHeading"
                            initialValue={
                              product.englishContent.heading.subHeading
                            }
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item label="Description" className="mb-0">
                            <Form.List
                              name={[field.name, 'englishContent.Description']}
                              rules={[
                                {
                                  validator: async (_, desc) => {
                                    if (!desc || desc.length < 1) {
                                      return Promise.reject(
                                        new Error(
                                          'Ít nhất phải có 1 description'
                                        )
                                      );
                                    }
                                    if (desc && desc.length > 4) {
                                      return Promise.reject(
                                        new Error(
                                          'Tối đa được tạo 4 description'
                                        )
                                      );
                                    }
                                  },
                                },
                              ]}
                              initialValue={
                                product.englishContent.heading.description
                              }
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
                      {fields.length < 1 && (
                        <Button type="dashed" onClick={() => add()} block>
                          + Add Product Information Heading
                        </Button>
                      )}
                    </div>
                  )}
                </Form.List>
              )}
          </Card>
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
          {t('product.DetailProduct.UpdateProduct')}
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

export default memo(EditProductInfo);
