import { message } from 'antd';
import { RcFile } from 'antd/es/upload';

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// Check rules remove Files from getValueFromEvent
export const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export const IMAGE_MAX_WIDTH = 1080;
export const IMAGE_MAX_HEIGHT = 1920; //1864 => Banner export for DEV
// Check img size from beforeUpload of Upload Dragger
export const checkImageDimension = (file: RcFile): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', (event) => {
      const _loadedImageUrl = event.target?.result;
      const image = document.createElement('img');
      image.src = _loadedImageUrl as string;

      image.addEventListener('load', () => {
        const { width, height } = image;

        if (width !== IMAGE_MAX_WIDTH || height !== IMAGE_MAX_HEIGHT) {
          message.error(
            `Hình tải lên phải có kích thước ${IMAGE_MAX_WIDTH}x${IMAGE_MAX_HEIGHT}px`,
            5
          );
          resolve(true);
        }
        if (width === IMAGE_MAX_WIDTH && height === IMAGE_MAX_HEIGHT) {
          resolve(false);
        }
      });
    });
  });
};
