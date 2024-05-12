import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router';
const DrawerComponents = React.lazy(() => import('../../../Components/Drawer'));
const ProductInfo = React.lazy(() => import('./ProductInfo'));
const ProductItems = React.lazy(() => import('./ProductItems'));
const EditProductInfo = React.lazy(() => import('./EditProductInfo'));
const EditProductItem = React.lazy(() => import('./EditProductItem'));
const SkeletonComponent = React.lazy(
  () => import('../../../Components/Skeleton')
);
import { useAppDispatch } from '../../../apps/hooks';
import {
  IProductItemAdd,
  TProduct,
  TProductItem,
  TUpdateProductItem,
  TUpdateProductItemEN,
  TUpdateProductItemVI,
} from '../../../interface';
import { useTranslation } from 'react-i18next';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import ProductApi from '../../../service/product.service';
import { showToastErrors } from '../../../utils/toast_errors';

export interface DetailProductProps {}

export default function DetailProduct(props: DetailProductProps) {
  const productCode = useParams<{ productCode: string }>().productCode || '';
  const { t } = useTranslation('lng');
  const dispatch = useAppDispatch();
  const [isRender, setIsRender] = useState<boolean>(true);
  const [product, setProduct] = useState<TProduct>();
  const [productItem, setProductItem] = useState<TUpdateProductItem[]>();

  const [isEdit, setIsEdit] = useState({
    editProductInfo: false,
    editProductItem: false,
    addProduct: false,
  });

  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

  const handleChangeProductItemLanguage = (product: TProduct) => {
    // Hàm dùng để map 2 trường product.vietnameseContent.items và product.englishContent.items thành 1 mảng dùng để chỉnh sửa product item
    if (product) {
      // check have product
      let productLanguageVI: TUpdateProductItemVI[];
      let productLanguageEN: TUpdateProductItemEN[];

      productLanguageVI = product.vietnameseContent.items.map(
        (item: TProductItem) => ({
          'itemVietnamese.codeTitle': item.codeTitle,
          'itemVietnamese.note': item.note,
          codeItem: item.codeItem,
          'itemVietnamese.price': item.price,
          // 'itemVietnamese.itemIcon': item.iconItem, // hình
          'itemVietnamese.description': item.description,
          'itemVietnamese.id': item.id,
        })
      );
      productLanguageEN = product.englishContent.items.map(
        (item: TProductItem) => ({
          'itemEnglish.codeTitle': item.codeTitle,
          'itemEnglish.note': item.note,
          codeItem: item.codeItem,
          'itemEnglish.price': item.price,
          // 'itemEnglish.itemIcon': item.iconItem, // hình
          'itemEnglish.description': item.description,
          'itemEnglish.id': item.id,
        })
      );
      const mergedData: TUpdateProductItem[] = productLanguageVI.map(
        (itemVI) => {
          const correspondingItemEN = productLanguageEN.find(
            (iTemEN) => iTemEN.codeItem === itemVI.codeItem
          );
          return {
            ...itemVI,
            ...correspondingItemEN,
          };
        }
      );
      // Update state or perform further actions with mergedData
      mergedData && setProductItem(mergedData);
    }
  };

  const getDetailProduct = async () => {
    try {
      dispatch(setLoading(true));
      const response = await ProductApi.getProductByProductCode(productCode);
      // console.log(response.data.data);
      handleChangeProductItemLanguage(response.data.data);
      setProduct(response.data.data);
    } catch (error: any) {
      console.log('failed to fetch productList', error);
      showToastErrors(error.errors);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    console.log('usf DetailProduct');
    productCode && getDetailProduct();
  }, [productCode, isRender]);

  const handleTriggerRender = () => {
    setIsRender(!isRender);
  };

  const handleCloseDrawer = () => {
    // close Drawer and trigger render
    setIsOpenDrawer(!isOpenDrawer);
  };
  return (
    <Suspense fallback={<SkeletonComponent />}>
      {product && (
        <ProductInfo
          product={product}
          editProductInfo={() => {
            setIsEdit({
              editProductItem: false,
              editProductInfo: true,
              addProduct: false,
            });
            setIsOpenDrawer(true);
          }}
        />
      )}
      {product && (
        <ProductItems
          product={product}
          editProductItem={() => {
            setIsEdit({
              editProductItem: true,
              editProductInfo: false,
              addProduct: false,
            });
            setIsOpenDrawer(true);
          }}
          addProduct={() => {
            setIsEdit({
              editProductItem: false,
              editProductInfo: false,
              addProduct: true,
            });
            setIsOpenDrawer(true);
          }}
        />
      )}

      <DrawerComponents
        title={
          product && isEdit.editProductInfo
            ? `${t('product.DetailProduct.UpdateProduct')}`
            : product && isEdit.editProductItem
            ? `${t('product.DetailProduct.UpdatePackage')}`
            : `${t('product.DetailProduct.AddPackage')}`
        }
        openDrawer={isOpenDrawer}
        handleCloseDrawer={handleCloseDrawer}
        children={
          <>
            {/* Edit Product Info */}
            {product && isEdit.editProductInfo && (
              <EditProductInfo
                handleCloseDrawer={handleCloseDrawer}
                productCode={productCode}
                product={product}
                handleTriggerRender={handleTriggerRender}
              ></EditProductInfo>
            )}

            {/* Edit ProductItem */}
            {productItem && isEdit.editProductItem && (
              <EditProductItem
                handleCloseDrawer={handleCloseDrawer}
                handleTriggerRender={handleTriggerRender}
                productCode={productCode}
                productItem={productItem}
                isEdit={isEdit.editProductItem}
              ></EditProductItem>
            )}

            {/* Add ProductItem */}
            {productItem && isEdit.addProduct && (
              <EditProductItem
                handleCloseDrawer={handleCloseDrawer}
                handleTriggerRender={handleTriggerRender}
                productCode={productCode}
                productItem={productItem}
                isEdit={isEdit.editProductItem}
              ></EditProductItem>
            )}
          </>
        }
        width={window.innerWidth >= 1024 ? '80%' : '100%'}
      />
    </Suspense>
  );
}
