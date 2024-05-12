import { AppstoreAddOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Form } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { TProduct } from '../../../interface';
import ItemList from './ItemList';
export interface ProductItemsProps {
  product: TProduct;
  editProductItem: () => void;
  addProduct: () => void;
}
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 24 },
};
export default function ProductItems({
  product,
  editProductItem,
  addProduct,
}: ProductItemsProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation('lng');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Divider
        className="text-base sm:text-xl md:text-2xl break-words font-semibold "
        style={{ color: `${product.colorCodePrimary}` }}
      >{`DANH SÁCH GÓI / THẺ `}</Divider>
      <>
        <div className="flex items-center sm:justify-start justify-center  gap-5">
          <Button
            className="text-base   flex items-center "
            type="primary"
            size="large"
            shape="round"
            icon={<AppstoreAddOutlined />}
            onClick={addProduct}
          >
            {t('product.DetailProduct.AddPackage')}
          </Button>
          <Button
            className="text-base  flex items-center "
            type="primary"
            size="large"
            shape="round"
            icon={<EditOutlined />}
            onClick={editProductItem}
          >
            {t('product.DetailProduct.UpdatePackage')}
          </Button>
        </div>
        <div className="flex justify-center items-start lg:gap-4 flex-wrap lg:flex-nowrap">
          <ItemList
            productContent={product.vietnameseContent.items}
            colorCodePrimary={product.colorCodePrimary}
            isVietNameseContent={true}
          />
          <ItemList
            productContent={product.englishContent.items}
            colorCodePrimary={product.colorCodePrimary}
            isVietNameseContent={false}
          />
        </div>
      </>
    </>
  );
}
