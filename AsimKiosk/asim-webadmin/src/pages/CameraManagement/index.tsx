import { Layout, Modal } from 'antd';
import { Content } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { Suspense, lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../apps/hooks';
import { TKioskListDropDown } from '../../interface';
import { TInventory } from '../../interface/TInventory';
import ClientApi from '../../service/Client.service';
import { showToastErrors } from '../../utils/toast_errors';

import { TCamera } from '../../interface/TCamera';
import CameraApi from '../../service/Camera.service';
import ContentInventory from './LayoutCamera/ContentCamera';
import SiderKiosk from './LayoutCamera/SiderKiosk';
const SkeletonComponent = lazy(() => import('../../Components/Skeleton/index'));
const DrawerComponents = lazy(() => import('../../Components/Drawer/index'));
const { confirm } = Modal;
type DataIndex = keyof TInventory;

export interface ICameraManagementProps {}

export default function CameraManagement(props: ICameraManagementProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('lng');

  const [isRender, setIsRender] = useState<boolean>(false);

  const [kioskList, setKioskList] = useState<TKioskListDropDown[]>();
  const [currentKiosk, setCurrentKiosk] = useState<TKioskListDropDown>();
  const [cameraList, setCameraList] = useState<TCamera[]>();
  const [total, setToTal] = useState<number>(0);
  const [filter, setFilter] = useState({
    page: 1,
    pageSize: 4,
    from: dayjs().format('YYYY-MM-DD'),
    to: dayjs().format('YYYY-MM-DD'),
  });
  // console.log(filter);

  async function getAllCamera() {
    try {
      const params = queryString.stringify(filter);
      dispatch(setLoading(true));
      const response = await CameraApi.getAllVideos(currentKiosk!.deviceId, params);
      console.log(response);
      setCameraList(response.data.data.items);
      setToTal(response.data.data.totalCount);
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));
      console.log('failed to fetch productList', error);
      showToastErrors(error.errors);
    }
  }

  const handleGetKioskDropDown = async () => {
    try {
      dispatch(setLoading(true));
      const response = await ClientApi.getKioskDropDown();
      // console.log('setKioskList', response.data.data);
      setKioskList(response.data.data);
      setCurrentKiosk(response.data.data[0]);
      dispatch(setLoading(false));
    } catch (error: any) {
      showToastErrors(error.errors);
      console.log('failed to fetch getGroupIdList', error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    handleGetKioskDropDown();
  }, []);

  useEffect(() => {
    currentKiosk && getAllCamera();
  }, [isRender, filter.page, filter.pageSize, currentKiosk, filter.from, filter.to]);

  const handlePageChange = (page: number, pageSize: number) => {
    setFilter({
      ...filter,
      page: page,
      pageSize: pageSize,
    });
  };
  const handChangeFilterDays = (dateFrom: string, dateTo: string) => {
    setFilter({
      ...filter,
      page: 1,
      from: dateFrom,
      to: dateTo,
    });
  };

  const handleKioskChange = (deviceId: string) => {
    if (deviceId) {
      const currentKiosk = kioskList?.find((kiosk) => kiosk.deviceId === deviceId);
      setCurrentKiosk(currentKiosk);
    }
  };

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <Layout className="w-full h-full flex-wrap ">
        <div className="w-full md:w-1/4 lg:w-1/5 2xl:w-1/6 h-fit  md:h-full ">
          {kioskList && <SiderKiosk kioskList={kioskList} handleKioskChange={handleKioskChange} />}
        </div>

        <Layout
          className={`site-layout  transition-all	 ease-linear duration-[10] w-full  md:w-3/4 lg:w-4/5 2xl:w-5/6`}
        >
          <Content className="my-0   ml-3 xl:ml-4 ">
            <h2 className="font-bold text-3xl  text-inherit mb-2 text-center">
              {t('cameraManagement.title')}
            </h2>

            {currentKiosk && cameraList && (
              <ContentInventory
                handChangeFilterDays={handChangeFilterDays}
                cameraList={cameraList}
                currentKiosk={currentKiosk}
                filter={filter}
                total={total}
                handlePageChange={handlePageChange}
              />
            )}
          </Content>
        </Layout>
      </Layout>

      {/* -------- Add Inventory ticket--------- */}
    </Suspense>
  );
}
