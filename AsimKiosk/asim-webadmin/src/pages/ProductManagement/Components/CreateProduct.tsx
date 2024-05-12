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
  theme,
} from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { lazy, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { SignalRContext } from '../../../Context';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../../apps/hooks';
import { IAddProduct } from '../../../interface/IProduct';
import ProductApi from '../../../service/product.service';
import { getBase64, normFile } from '../../../utils/formattImg';
import { showToastErrors } from '../../../utils/toast_errors';
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

export interface CreateProductProps {}

export default function CreateProduct(props: CreateProductProps) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const { connection } = useContext(SignalRContext);

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<any>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [isRender, setIsRender] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleCreateProduct = async (data: IAddProduct) => {
    try {
      dispatch(setLoading(true));
      const response = await ProductApi.CreateProduct(data);
      dispatch(setLoading(false));
      setIsRender(!isRender);

      toast.success('Thêm Product Thành Công');
      form.resetFields();
    } catch (error: any) {
      console.log(error);
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };

  const onFinish = (values: IAddProduct) => {
    console.log('Received values of form: ', values);

    handleCreateProduct(values);
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    );
  };

  return (
    <>
      <div className=" bg-colorBgContainer min-h-min p-3  rounded-lg">
        <h2 className="font-bold text-3xl w-full mb-4 text-center  ">
          Thêm sản phẩm
        </h2>

        <Form
          {...formItemLayout}
          labelWrap
          name="CreateProduct"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full font-semibold text-base px-4"
        >
          <Form.Item
            name="productName"
            label="ProductName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <div className="flex justify-center items-start gap-4 flex-wrap lg:flex-nowrap">
            <Form.Item
              className="flex-1 "
              name="productCode"
              label="ProductCode"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="flex justify-center items-start gap-4 flex-wrap lg:flex-nowrap">
            <Form.Item
              className="flex-1 "
              name="hotline"
              label="Hotline"
              rules={[{ required: true }]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              className="flex-1 "
              name="colorCodePrimary"
              label="ColorCodePrimary"
              rules={[{ required: true }]}
              getValueFromEvent={(color) => {
                // console.log(color, color.toHexString());
                return color.toHexString();
              }}
            >
              <ColorPicker showText allowClear format={'hex'} />
            </Form.Item>
            <Form.Item
              className="flex-1 "
              name="colorCodeSecondary"
              label="ColorCodeSecondary"
              getValueFromEvent={(color) => {
                // console.log(color, color.toHexString());
                return color.toHexString();
              }}
            >
              <ColorPicker showText allowClear format={'hex'} />
            </Form.Item>

            <Form.Item
              label="IsRequireSerialNumber"
              name="isRequireSerialNumber"
              valuePropName="checked"
            >
              <Checkbox>Require Serial Number</Checkbox>
            </Form.Item>
          </div>
          <Form.Item
            label="ProductIcon"
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
              <p className="ant-upload-text">
                Nhấp hoặc kéo tệp vào khu vực này để tải lên
              </p>
              {/* <p className="ant-upload-hint">
                  Hỗ trợ tải lên một video và có đuôi file là: .mp4, .webm,
                  .3gp, .mov
                </p> */}
            </Upload.Dragger>
          </Form.Item>
          {/* ---------------------- */}

          <div className="flex justify-center items-start gap-4 flex-wrap lg:flex-nowrap">
            <Card
              className="w-full  m-auto "
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
                label="Title"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

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
                        title={`Information Heading`}
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
                          label="SubHeading"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item label="Description">
                          <Form.List
                            name={[field.name, 'vietnameseContent.Description']}
                            rules={[
                              {
                                validator: async (_, desc) => {
                                  if (!desc || desc.length < 1) {
                                    return Promise.reject(
                                      new Error('Ít nhất phải có 1 description')
                                    );
                                  }
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
                    {fields.length < 1 && (
                      <Button type="dashed" onClick={() => add()} block>
                        + Add Information
                      </Button>
                    )}
                  </div>
                )}
              </Form.List>

              <Form.Item
                label="ProductImage"
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
                  <p className="ant-upload-text">
                    Nhấp hoặc kéo tệp vào khu vực này để tải lên
                  </p>
                  {/* <p className="ant-upload-hint">
          Hỗ trợ tải lên một video và có đuôi file là: .mp4, .webm,
          .3gp, .mov
        </p> */}
                </Upload.Dragger>
              </Form.Item>

              <Form.List name="items">
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
                        className="bg-colorBgItem text-primary"
                        headStyle={{
                          fontSize: '18px',
                          lineHeight: '24px',
                          fontWeight: '600',
                          textAlign: 'center',
                          color: '#ff2f48',
                        }}
                        size="small"
                        title={`ITEM ${field.name + 1}`}
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
                          label="codeTitle"
                          name={[field.name, 'itemVietnamese.codeTitle']}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="codeItem"
                          name={[field.name, 'codeItem']}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="Price VND"
                          name={[field.name, 'itemVietnamese.price']}
                        >
                          <InputNumber
                            className="w-full"
                            prefix={'VNĐ'}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value) =>
                              value!.replace(/\$\s?|(,*)/g, '')
                            }
                            // onChange={onChange}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Note"
                          name={[field.name, 'itemVietnamese.note']}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="itemIcon"
                          name={[field.name, 'itemVietnamese.itemIcon']}
                          valuePropName="file"
                          getValueFromEvent={normFile}
                          rules={[{ required: true }]}
                        >
                          <Upload.Dragger
                            name="File"
                            action={`${
                              import.meta.env.VITE_BASE_URL_
                            }/uploads/`}
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
                            <p className="ant-upload-text">
                              Nhấp hoặc kéo tệp vào khu vực này để tải lên
                            </p>
                          </Upload.Dragger>
                        </Form.Item>

                        <Form.Item label="Description">
                          <Form.List
                            name={[field.name, 'itemVietnamese.description']}
                            // label="description"
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

                    <Button type="dashed" onClick={() => add()} block>
                      + Add Item
                    </Button>
                  </div>
                )}
              </Form.List>
            </Card>
            <Card
              className="w-full  m-auto "
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
                rules={[{ required: true, message: '${label} là bắt buộc!' }]}
              >
                <Input />
              </Form.Item>

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
                        title={`Information Heading`}
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
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item label="Description">
                          <Form.List
                            name={[field.name, 'englishContent.Description']}
                            rules={[
                              {
                                validator: async (_, desc) => {
                                  if (!desc || desc.length < 1) {
                                    return Promise.reject(
                                      new Error('Ít nhất phải có 1 description')
                                    );
                                  }
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
                    {fields.length < 1 && (
                      <Button type="dashed" onClick={() => add()} block>
                        + Add Information
                      </Button>
                    )}
                  </div>
                )}
              </Form.List>

              <Form.Item
                label="ProductImage"
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
                  <p className="ant-upload-text">
                    Nhấp hoặc kéo tệp vào khu vực này để tải lên
                  </p>
                  {/* <p className="ant-upload-hint">
          Hỗ trợ tải lên một video và có đuôi file là: .mp4, .webm,
          .3gp, .mov
        </p> */}
                </Upload.Dragger>
              </Form.Item>

              <Form.List name="items">
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
                        title={`ITEM ${field.name + 1}`}
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
                          label="codeTitle"
                          name={[field.name, 'itemEnglish.codeTitle']}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="codeItem"
                          name={[field.name, 'codeItem']}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          label="Price USD"
                          name={[field.name, 'itemEnglish.price']}
                        >
                          <InputNumber
                            className="w-full"
                            prefix={'$'}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value) =>
                              value!.replace(/\$\s?|(,*)/g, '')
                            }
                            // onChange={onChange}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Note"
                          name={[field.name, 'itemEnglish.note']}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="itemIcon"
                          name={[field.name, 'englishContent.itemIcon']}
                          valuePropName="file"
                          getValueFromEvent={normFile}
                          rules={[{ required: true }]}
                        >
                          <Upload.Dragger
                            name="File"
                            action={`${
                              import.meta.env.VITE_BASE_URL_
                            }/uploads/`}
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
                            <p className="ant-upload-text">
                              Nhấp hoặc kéo tệp vào khu vực này để tải lên
                            </p>
                          </Upload.Dragger>
                        </Form.Item>

                        <Form.Item label="Description">
                          <Form.List
                            name={[field.name, 'itemEnglish.description']}
                            // label="description"
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

                    <Button type="dashed" onClick={() => add()} block>
                      + Add Item
                    </Button>
                  </div>
                )}
              </Form.List>
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
            Thêm Sản Phẩm
          </Button>
        </Form>
      </div>
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
