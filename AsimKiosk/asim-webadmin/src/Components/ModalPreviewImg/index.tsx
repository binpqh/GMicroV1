import { Modal } from 'antd';
import { memo } from 'react';
import PdfViewer from '../PdfViewer';

const ModalPreviewImgComponent = ({
  previewOpen,
  previewTitle,
  previewImage,
  handleCancel,
  isPdf = false,
}: {
  previewOpen: boolean;
  previewTitle: string;
  previewImage: string;
  handleCancel: () => void;
  isPdf?: boolean;
}) => (
  <Modal
    open={previewOpen}
    title={previewTitle}
    footer={null}
    onCancel={handleCancel}
    width={isPdf ? 800 : 600}
    centered
  >
    {isPdf ? (
      <div className="h-[600px] 2xl:h-[800px] ">
        <PdfViewer fileUrl={previewImage} />
      </div>
    ) : (
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    )}
    {/* , backgroundColor: '#ccc', */}
  </Modal>
);

export default memo(ModalPreviewImgComponent);
