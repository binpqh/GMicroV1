import { ExclamationCircleFilled, InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Divider, List, Modal } from 'antd';
import { Suspense, lazy, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { SignalRContext } from '../../Context';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../apps/hooks';
import { TProductAll } from '../../interface/IProduct';
import ProductApi from '../../service/product.service';
import { showToastErrors } from '../../utils/toast_errors';
const { confirm } = Modal;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 24 },
};
const SkeletonComponent = lazy(() => import('../../Components/Skeleton'));
export interface ProductManagement {}

export default function ProductManagement(props: ProductManagement) {
  const navigate = useNavigate();
  const { t } = useTranslation('lng');
  const { connection } = useContext(SignalRContext);
  const [productList, setProductList] = useState<TProductAll[]>();
  const [isRender, setIsRender] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const getAllProduct = async () => {
    try {
      dispatch(setLoading(true));
      const response = await ProductApi.getAll();
      console.log(response.data.data);
      setProductList(response.data.data);
    } catch (error: any) {
      showToastErrors(error.errors);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllProduct();
  }, [isRender]);

  const HandleSyncAdsAsync = () => {
    console.log('HandleSyncAdsAsync');
    toast.info('Đồng Bộ Quảng Cáo với Kiosk');
    // connection?.invoke('HandleSyncAdsAsync');
  };

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <div className=" bg-gray-100 min-h-min  ">
        <div className="flex items-center justify-center mb-3 flex-wrap lg:flex-nowrap">
          <h2 className="font-bold text-3xl w-full xl:w-full text-center lg:text-left ">
            Quản lý sản phẩm
          </h2>
          {/* <div className="flex w-full xl:w-3/5   justify-center lg:justify-end flex-wrap xl:flex-nowrap my-4 gap-5 ">
            <Button
              className="bg-green-500 hover:bg-green-400 py-0 px-7 flex items-center  "
              type="primary"
              size="large"
              shape="round"
              icon={<UploadOutlined />}
              onClick={() => {
                navigate('/productManagement/createProduct');
              }}
            >
              Tạo sản phẩm
            </Button>
          </div> */}
        </div>
        <List
          size="large"
          pagination={false}
          dataSource={productList}
          renderItem={(item) => (
            <List.Item
              className=" bg-colorBgContainer mb-2 rounded-lg shadow-sm flex flex-wrap gap-5  items-center md:flex-nowrap"
              key={item.id}
            >
              <div className="m-auto bg-primary rounded-lg">
                <img
                  src={item.productIcon}
                  alt=""
                  className=" h-[70px] w-[250px] xl:h-[100px] xl:w-[180px]  text-center p-3 object-scale-down"
                />
              </div>
              <div className="flex flex-wrap xl:flex-nowrap items-center justify-between w-full gap-2 md:gap-0  ">
                <div className="flex flex-wrap justify-center items-center w-full md:w-2/6">
                  <Divider
                    type="vertical"
                    className="h-24 text-center hidden
								md:block"
                  />
                  <List.Item.Meta
                    className="text-center md:text-left"
                    title={<p className="text-lg   font-semibold">{item?.productName}</p>}
                    description={item.productCode}
                  />
                </div>
                <div className=" w-full flex-wrap md:w-4/6  md:justify-end flex justify-center items-center gap-3">
                  <Button
                    className="  py-0 px-3 flex text-base items-center text-white min-w-[180px] justify-center "
                    type="primary"
                    size="large"
                    shape="round"
                    icon={<InfoCircleOutlined />}
                    onClick={() => {
                      navigate(`/productManagement/${item.productCode}`);
                    }}
                  >
                    {t('buttons.detail')}
                  </Button>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Suspense>
  );
}
