import { Button, Form, Modal, Upload } from 'antd';

import { CheckOutlined, InboxOutlined } from '@ant-design/icons';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../apps/hooks';
import {
  IMAGE_MAX_HEIGHT,
  IMAGE_MAX_WIDTH,
  checkImageDimension,
  getBase64,
} from '../../../utils/formattImg';


interface MyFormValues {
  images: UploadFile[];
}
export interface IAddBannerProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  handleAddBanner: (data: UploadFile[]) => void;
}

export default function AddBanner({
  isModalOpen,
  handleCancel,
  handleAddBanner,
}: IAddBannerProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('lng');
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<any>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isError, setIsError] = useState(true);

  const handleUpload = () => {
    // console.log(fileList);
    fileList.length > 0 && handleAddBanner(fileList);
  };

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

  const UploadDraggerProps: UploadProps = {
    onChange(info) {
      const { status } = info.file;
      // console.log(status, info);
      // console.log(
      //   'item.error',
      //   info.fileList.some((item) => item.error)
      // );
      const isError = info.fileList.some((item) => item.error);

      setIsError(isError);
      setFileList(info.fileList);
    },
  };

  return (
    <>
      <Modal
        title={
          <h4 className="font-bold text-2xl text-center mb-5">
            {t('UIKiosk.banner.addBanner.title')}
          </h4>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Upload.Dragger
          {...UploadDraggerProps}
          name="File"
          action={`${import.meta.env.VITE_BASE_URL_}/uploads/`}
          multiple
          listType="picture"
          onPreview={handlePreview}

          accept="image/*"
          beforeUpload={checkImageDimension}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t('UploadDragger.Title')}</p>
          <p className="ant-upload-hint">
            {t('UploadDragger.DescImgMultiple')} PNG, JPG
          </p>
          <p className="ant-upload-hint">
            {`${t(
              'UploadDragger.SubDescImg'
            )} ${IMAGE_MAX_WIDTH}x${IMAGE_MAX_HEIGHT}px`}
          </p>
        </Upload.Dragger>

        <div className="flex justify-end  items-center mt-5">
          <Button
            className="bg-green-500  py-0 px-4 flex items-center  "
            size="large"
            type="primary"
            shape="round"
            icon={<CheckOutlined />}
            onClick={handleUpload}
            disabled={isError || fileList.length === 0}
          >
            {t('UIKiosk.banner.addBanner.btnUpload')}
          </Button>
        </div>
      </Modal>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
      >
        <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
}
