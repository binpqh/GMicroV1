import { EditOutlined } from '@ant-design/icons';
import {
  Card,
  Col,
  ColorPicker,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Tooltip,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { TProduct } from '../../../interface';
import { normFile } from '../../../utils/formattImg';
import { useEffect } from 'react';
export interface ProductInfoProps {
  product: TProduct;
  editProductInfo: () => void;
}
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 24 },
};
export default function ProductInfo({
  product,
  editProductInfo,
}: ProductInfoProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation('lng');

  useEffect(() => {
    //reset form when product is updated to update fields
    form.resetFields();
  }, [product]);
  return (
    <>
      <Card
        className=" xl:mx-auto my-5 w-full  break-words "
        title={
          <p className=" text-base sm:text-xl md:text-2xl break-words font-semibold">
            {t('product.DetailProduct.title')}{' '}
            {product.productName.toUpperCase()}
          </p>
        }
        headStyle={{
          textAlign: 'center',
          padding: '0px',
        }}
        actions={[
          <Tooltip
            title={t('product.DetailProduct.UpdateProduct')}
            color={'#00b96b'}
            key={'#00b96b'}
            placement="bottom"
          >
            <Flex
              justify="center"
              align="center"
              gap="small"
              className="text-base font-medium"
              onClick={editProductInfo}
            >
              <EditOutlined style={{ fontSize: '25px' }} key="edit" />
              {t('product.DetailProduct.UpdateProduct')}
            </Flex>
          </Tooltip>,
        ]}
      >
        <Row gutter={[16, 16]} justify="space-around" align="middle">
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 8 }}
            className="text-base items-center flex"
          >
            <div className="w-1/3">
              {t('product.DetailProduct.ProductName')}:
            </div>
            <div className="w-2/3">{product.productName}</div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 8 }}
            className="text-base items-center flex"
          >
            <div className="w-1/3">
              {t('product.DetailProduct.ProductCode')}:
            </div>
            <div className="w-2/3">{product.productCode}</div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 8 }}
            className="text-base items-center flex"
          >
            <div className="w-1/3">{t('product.DetailProduct.HotLine')}:</div>
            <div className="w-2/3">{product.hotline}</div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 8 }}
            className="text-base items-center flex"
          >
            <div className="w-1/3">
              {t('product.DetailProduct.ColorCodePrimary')}:
            </div>
            <div className="w-2/3">
              <ColorPicker
                defaultValue={
                  product.colorCodePrimary && product.colorCodeSecondary
                }
                showText
                disabled
              />
            </div>
          </Col>

          {product.colorCodeSecondary && (
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
              className="text-base items-center flex"
            >
              <div className="w-1/3">
                {t('product.DetailProduct.ColorCodeSecondary')}:
              </div>
              <div className="w-2/3">
                <ColorPicker
                  defaultValue={
                    product.colorCodeSecondary && product.colorCodeSecondary
                  }
                  showText
                  disabled
                />
              </div>
            </Col>
          )}

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 8 }}
            className="text-base items-center flex"
          >
            <div className="w-1/3">
              {t('product.DetailProduct.ProductIcon')}:
            </div>
            <div className="w-2/3">
              <img
                src={`${product.productIcon}`}
                className={`h-[50px] w-[150px]   text-center p-3 object-scale-down  rounded-lg`}
                style={{ backgroundColor: `${product.colorCodePrimary}` }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Form
        labelWrap
        name="ProductInfo"
        form={form}
        layout="vertical"
        className="w-full font-semibold text-base "
      >
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
              <Input readOnly={true} />
            </Form.Item>

            <Form.Item
              className="mb-0 "
              label={t('product.ProductHeading.productImg')}
              name="vietnameseContent.ProductPreviewImage"
              valuePropName="file"
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
            >
              <Image
                width={'100%'}
                src={`${product.vietnameseContent.previewImage}`}
              />
              {/* <Upload.Dragger
                  name="File"
                  action={`${import.meta.env.VITE_BASE_URL_}/uploads/`}
                  multiple
                  listType="picture"
                  // onPreview={handlePreview}
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
                </Upload.Dragger> */}
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
                          // extra={
                          //   <CloseOutlined
                          //     onClick={() => {
                          //       remove(field.name);
                          //     }}
                          //   />
                          // }
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
                            <Input readOnly={true} />
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
                            <Input readOnly={true} />
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
                                          // className="w-5/6 lg:w-[80%] xl:w-[85%]"
                                          className="w-full"
                                          readOnly={true}
                                        />
                                      </Form.Item>

                                      {/* <MinusCircleOutlined
                                      className="dynamic-delete-button px-4 hover:text-colorError "
                                      onClick={() => remove(field.name)}
                                    /> */}
                                    </Form.Item>
                                  ))}
                                  {/* <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '100%' }}
                                    icon={<PlusOutlined />}
                                  >
                                    Add Description
                                  </Button>

                                  <Form.ErrorList errors={errors} />
                                </Form.Item> */}
                                </>
                              )}
                            </Form.List>
                          </Form.Item>
                        </Card>
                      ))}
                      {/* {fields.length < 1 && (
                      <Button type="dashed" onClick={() => add()} block>
                        + Add Information
                      </Button>
                    )} */}
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
              <Input readOnly={true} />
            </Form.Item>

            <Form.Item
              className="mb-0 "
              label="Product Image"
              name="englishContent.ProductPreviewImage"
              valuePropName="file"
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
            >
              <Image
                width={'100%'}
                src={`${product.englishContent.previewImage}`}
              />
              {/* <Upload.Dragger
                  name="File"
                  action={`${import.meta.env.VITE_BASE_URL_}/uploads/`}
                  multiple
                  listType="picture"
                  // onPreview={handlePreview}
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
                </Upload.Dragger> */}
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
                          // extra={
                          //   <CloseOutlined
                          //     onClick={() => {
                          //       remove(field.name);
                          //     }}
                          //   />
                          // }
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
                            <Input readOnly={true} />
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
                            <Input readOnly={true} />
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
                                          // className="w-5/6 lg:w-[80%] xl:w-[85%]"
                                          className="w-full"
                                          readOnly={true}
                                        />
                                      </Form.Item>

                                      {/* <MinusCircleOutlined
                                      className="dynamic-delete-button px-4 hover:text-colorError "
                                      onClick={() => remove(field.name)}
                                    /> */}
                                    </Form.Item>
                                  ))}
                                  {/* <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '100%' }}
                                    icon={<PlusOutlined />}
                                  >
                                    Add Description
                                  </Button>

                                  <Form.ErrorList errors={errors} />
                                </Form.Item> */}
                                </>
                              )}
                            </Form.List>
                          </Form.Item>
                        </Card>
                      ))}
                      {/* {fields.length < 1 && (
                      <Button type="dashed" onClick={() => add()} block>
                        + Add Information
                      </Button>
                    )} */}
                    </div>
                  )}
                </Form.List>
              )}
          </Card>
        </div>
      </Form>
    </>
  );
}
