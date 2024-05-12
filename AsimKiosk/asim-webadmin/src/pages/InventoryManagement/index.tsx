import { green } from '@ant-design/colors';
import {
  ExclamationCircleFilled,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Input, InputRef, Layout, Modal, Progress, Space } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { ColumnsType } from 'antd/es/table';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import moment from 'moment';
import queryString from 'query-string';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../apps/hooks';
import { TKioskListDropDownInventory } from '../../interface';
import { TInventory } from '../../interface/TInventory';
import InventoryApi from '../../service/Inventory.service';
import { showToastErrors } from '../../utils/toast_errors';
import AddInventoryTicket from './Components/AddInventoryTicket';
import ContentInventory from './LayoutInventory/ContentInventory';
import SiderKiosk from './LayoutInventory/SiderKiosk';
const SkeletonComponent = lazy(() => import('../../Components/Skeleton/index'));
const DrawerComponents = lazy(() => import('../../Components/Drawer/index'));
const { confirm } = Modal;

type DataIndex = keyof TInventory;
const twoColors = { '0%': '#108ee9', '100%': '#87d068' };

export interface IInventoryManagementProps {}

export default function InventoryManagement(props: IInventoryManagementProps) {
  const kioskId = useParams<{ kioskId: string }>().kioskId || '';
  // console.log('kioskId', kioskId);

  const dispatch = useAppDispatch();

  const { t } = useTranslation('lng');
  const [openAddTicket, setOpenAddTicket] = useState(false);
  const [isRender, setIsRender] = useState<boolean>(false);

  const [kioskList, setKioskList] = useState<TKioskListDropDownInventory[]>();
  const [currentKiosk, setCurrentKiosk] =
    useState<TKioskListDropDownInventory>();
  const [inventoryTicketList, setInventoryTicketList] =
    useState<TInventory[]>();

  const [total, setToTal] = useState<number>(0);
  const [filter, setFilter] = useState({
    page: 1,
    pageSize: 10,
  });

  async function getAllInventoryList() {
    try {
      const params = queryString.stringify(filter);
      dispatch(setLoading(true));
      const response = await InventoryApi.getAllInventoryList(
        currentKiosk!.deviceId,
        params
      );

      const newData = response.data.data.items.map((item, index) => ({
        ...item,
        index: index + 1,
      }));

      setInventoryTicketList(newData);
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
      const response = await InventoryApi.getKioskInventories();
      // console.log('setKioskList', response.data.data);
      setKioskList(response.data.data);

      if (kioskId) {
        const currentKiosk = response.data.data.find(
          (kiosk) => kiosk.deviceId === kioskId
        );
        setCurrentKiosk(currentKiosk);
      } else {
        setCurrentKiosk(response.data.data[0]);
      }

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
    currentKiosk && getAllInventoryList();
  }, [isRender, filter.page, filter.pageSize, currentKiosk]);

  const showDeleteConfirm = (title: string, desc: string, id: string) => {
    confirm({
      title: title,
      icon: (
        <ExclamationCircleFilled style={{ fontSize: '22px', color: 'red' }} />
      ),
      content: desc,
      okType: 'danger',
      cancelButtonProps: { type: 'default' },
      autoFocusButton: 'cancel',
      onOk() {
        {
          //delete kiosk
          // handleDeleteKiosk(id);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setFilter({
      ...filter,
      page: page,
      pageSize: pageSize,
    });
  };
  const handleOpenDrawer = () => {
    setOpenAddTicket(true);
  };
  const handleCloseDrawer = () => {
    setOpenAddTicket(false);
  };

  const handleKioskChange = (deviceId: string) => {
    if (deviceId) {
      const currentKiosk = kioskList?.find(
        (kiosk) => kiosk.deviceId === deviceId
      );
      setCurrentKiosk(currentKiosk);
    }
  };

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <Layout className="w-full h-full flex-wrap ">
        <div className="w-full md:w-1/4 lg:w-1/5 2xl:w-1/6 h-fit  md:h-full ">
          {kioskList && (
            <SiderKiosk
              kioskList={kioskList}
              handleKioskChange={handleKioskChange}
              kioskId={kioskId}
            />
          )}
        </div>

        <Layout
          className={`site-layout  transition-all	 ease-linear duration-[10] w-full  md:w-3/4 lg:w-4/5 2xl:w-5/6`}
        >
          <Content className="my-0   ml-3 xl:ml-4 ">
            <h2 className="font-bold text-3xl  text-inherit mb-2 text-center">
              {t('inventoryManagement.title')}
            </h2>

            {inventoryTicketList && currentKiosk && (
              <ContentInventory
                handleOpenDrawer={handleOpenDrawer}
                currentKiosk={currentKiosk}
                inventoryTicketList={inventoryTicketList}
                filter={filter}
                total={total}
                handlePageChange={handlePageChange}
              />
            )}
          </Content>
        </Layout>
      </Layout>

      {/* -------- Add Inventory ticket--------- */}

      <DrawerComponents
        title={`${t('inventoryManagement.AddTicket')}`}
        openDrawer={openAddTicket}
        handleCloseDrawer={handleCloseDrawer}
        children={
          <>
            {kioskList && (
              <AddInventoryTicket
                kioskList={kioskList}
                handleRerender={() => setIsRender(!isRender)}
                handleCloseDrawer={handleCloseDrawer}
              />
            )}
          </>
        }
        width={window.innerWidth >= 1024 ? '85%' : '100%'}
      />
    </Suspense>
  );
}
