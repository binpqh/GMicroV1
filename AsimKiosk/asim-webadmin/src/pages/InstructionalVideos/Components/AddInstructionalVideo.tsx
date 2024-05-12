import { CheckOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../../apps/hooks';
import { TProductDropdown } from '../../../interface';
import { TAddInstructionVideo } from '../../../interface/TInstructionVideo';
import ProductApi from '../../../service/product.service';
import { showToastErrors } from '../../../utils';

const { Option } = Select;
export interface IAddInstructionalVideo {
  isModalOpen: boolean;
  handleCancel: () => void;
  handleAddVideo: (data: TAddInstructionVideo) => void;
}

export default function AddInstructionalVideo({
  isModalOpen,
  handleCancel,
  handleAddVideo,
}: IAddInstructionalVideo) {
  const [form] = Form.useForm();
  const { t } = useTranslation('lng');
  const dispatch = useAppDispatch();
  const [productList, setProductList] = useState<TProductDropdown[]>();

  const getProductDropdown = async () => {
    try {
      dispatch(setLoading(true));
      const response = await ProductApi.getProductDropdown();

      setProductList(response.data.data);
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log('failed to fetch getGroupIdList', error);

      dispatch(setLoading(false));
      showToastErrors(error.errors);
    }
  };
  useEffect(() => {
    getProductDropdown();
  }, []);

  const onFinish = (data: TAddInstructionVideo) => {
    console.log('Received values of form: ', data);
    handleAddVideo(data);
  };

  return (
    <>
      <Modal
        title={<h4 className="font-bold text-2xl text-center mb-5">THÊM VIDEO HƯỚNG DẪN</h4>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          name="validate_other"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full font-semibold text-base"
        >
          <Form.Item
            className="font-bold  "
            name="ProductType"
            label={`${t('kiosk.detail.externalInformation.productCode')}`}
            rules={[{ required: true }]}
            colon
          >
            {productList && (
              <Select
                placeholder={`${t('kiosk.detail.externalInformation.productCode')}`}
                virtual={false}
              >
                {productList.map((item) => (
                  <Option value={item.productCode} key={item.productCode}>
                    {item.productCode}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            label="Chọn Video"
            name="VideoFile"
            valuePropName="file"
            getValueFromEvent={(e) => {
              return e?.file;
            }}
            rules={[{ required: true }]}
          >
            <Upload.Dragger
              name="File"
              action={`${import.meta.env.VITE_BASE_URL_}/uploads/`}
              multiple
              accept="video/*"
              maxCount={1}
              listType="picture"
              // onPreview={handlePreview}
              beforeUpload={(file) => {
                // console.log({ file });
                return false;
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{t('UploadDragger.Title')}</p>
              <p className="ant-upload-hint">{t('UploadDragger.Desc')} Video (mp4,...)</p>
            </Upload.Dragger>
          </Form.Item>

          <div className="flex justify-end  items-center">
            <Button
              htmlType="submit"
              className="bg-green-500  py-0 px-4 flex items-center  "
              size="large"
              type="primary"
              shape="round"
              icon={<CheckOutlined />}
            >
              Lưu Thay Đổi
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
