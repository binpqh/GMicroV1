import {
  CheckOutlined,
  DeleteOutlined,
  DisconnectOutlined,
  ExclamationCircleFilled,
  HistoryOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Divider, Image, List, Modal, RadioChangeEvent, Tooltip, UploadFile } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { StatusEnum } from '../../Constant/Status';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../apps/hooks';
import { TBanner } from '../../interface/Tbanner';
import BannerKioskApi from '../../service/BannerKiosk.service';
import AddBanner from './Components/AddBanner';
import PriorityBanner from './Components/PriorityBanner';
import { showToastErrors } from '../../utils/toast_errors';

const { confirm } = Modal;

const contentStyle = {
  background: 'gray',
};
let priorityIndex: number;
// let setPriorityList: any = [];
export interface IBannerKiosk {}

export default function BannerKiosk(props: IBannerKiosk) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('lng');
  const [bannerList, setBannerList] = useState<TBanner[]>();
  const [isRender, setIsRender] = useState<boolean>(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalPriorityOpen, setIsModalPriorityOpen] = useState<boolean>(false);
  const [value, setValue] = useState<boolean>(true);

  const [priorityList, setPriorityList] = useState<any>([]);
  const typingTimeoutRef = useRef<any>(null);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    getAllBanners();
  }, [isRender]);

  const HandleSyncAdsAsync = () => {
    console.log('HandleSyncAdsAsync');
    toast.info('Đồng Bộ Quảng Cáo với Kiosk');
    // connection?.invoke('HandleSyncAdsAsync');
  };

  async function getAllBanners() {
    try {
      dispatch(setLoading(true));
      const response = await BannerKioskApi.getAll();
      console.log(response.data);
      const newBannerList = response.data.data.map((item: TBanner) => ({
        ...item,
        id: item.priority, // for DraggableImg
      }));
      console.log(newBannerList);
      setBannerList(newBannerList);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));

      console.log('', error);
    }
  }

  // const priority = useMemo(() => {
  //   const index = bannerList?.length || 0;
  //   priorityIndex = index + 1;
  // }, [bannerList]);

  const changeStatusKiosk = async (imgKey: string, status: number) => {
    try {
      dispatch(setLoading(true));
      const imgKeyString = imgKey.substring(imgKey.lastIndexOf('/') + 1);

      const response = await BannerKioskApi.changeStatusBanners(imgKeyString, status);

      setIsRender(!isRender);
      toast.success(`${t('kiosk.ChangeStatusKiosk.messageSuccess')}`);
    } catch (error: any) {
      dispatch(setLoading(false));
      console.log('failed to delete connection', error);
      // toast.error(`${t('kiosk.ChangeStatusKiosk.messageError')}`);
      showToastErrors(error.errors);
      // toast.error(`${error}`);
    }
  };

  const showConfirmNotify = (
    title: string,
    desc: string,
    options: 'Active' | 'InActive' | 'Delete',
    imgKey: string
  ) => {
    confirm({
      title: title,
      icon: <ExclamationCircleFilled style={{ fontSize: '22px', color: 'red' }} />,
      content: desc,
      okType: 'danger',
      cancelButtonProps: { type: 'default' },

      onOk() {
        {
          options === 'Active' && changeStatusKiosk(imgKey, StatusEnum.Active);
          options === 'InActive' && changeStatusKiosk(imgKey, StatusEnum.Inactive);
          options === 'Delete' && changeStatusKiosk(imgKey, StatusEnum.Deleted);
        }
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  };

  const handleCloseModalAddOpen = () => {
    setIsModalAddOpen(false);
  };
  const handleClosePriorityOpen = () => {
    setIsModalPriorityOpen(false);
  };
  const handleValueChange = (id: string, value: any) => {
    const value1 = +value;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      const pro = {
        id: id,
        priority: value1,
      };
      console.log(pro);

      const item = priorityList.find((p: any) => p.id === id);
      if (item === undefined) {
        setPriorityList((pre: any) => [...pre, pro]);
        console.log('BASE', priorityList);
      } else {
        item.priority = value1;
        console.log('item', item);
        console.log('NEW', priorityList);
      }
    }, 500);
  };

  const handleChangePriorityBanner = async (
    bannerList: Pick<TBanner, 'imageKey' | 'priority'>[]
  ) => {
    try {
      dispatch(setLoading(true));
      console.log(bannerList);
      // get imgkey from URL
      const newBannerList = bannerList.map((item) => ({
        ...item,
        imageKey: item.imageKey.substring(item.imageKey.lastIndexOf('/') + 1),
      }));

      const response = await BannerKioskApi.changePriorityBanners(newBannerList);
      console.log(response);
      setIsRender(!isRender);
      handleClosePriorityOpen();
      dispatch(setLoading(false));
      toast.success('Sắp Xếp banner thành công');
    } catch (error: any) {
      console.log(error);
      // toast.error(`${error}`);
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };
  const handleAddBanner = async (data: UploadFile[]) => {
    try {
      dispatch(setLoading(true));
      const res = await BannerKioskApi.addBannerKiosk(data);
      console.log(res.data);
      setIsRender(!isRender);
      handleCloseModalAddOpen();
      toast.success('Add Banner thành công');
    } catch (error: any) {
      // console.log(error);
      showToastErrors(error.errors);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <>
      <div className=" bg-gray-100 min-h-min  ">
        {isModalAddOpen && (
          <AddBanner
            isModalOpen={isModalAddOpen}
            handleCancel={handleCloseModalAddOpen}
            handleAddBanner={handleAddBanner}
          />
        )}
        {isModalPriorityOpen && bannerList && (
          <PriorityBanner
            isModalOpen={isModalPriorityOpen}
            handleCancel={handleClosePriorityOpen}
            bannerList={bannerList}
            handleChangePriorityBanner={handleChangePriorityBanner}
          />
        )}
        <div className="flex items-center justify-between mb-3 flex-wrap xl:flex-nowrap">
          <h2 className="font-bold text-3xl w-full xl:w-3/5 text-center xl:text-left ">
            {t('UIKiosk.banner.title')}
          </h2>
          <div className="flex w-full xl:w-3/5   justify-center xl:justify-end flex-wrap xl:flex-nowrap my-4 gap-5 ">
            <Button
              className="bg-infoColor hover:bg-infoColorHover py-0 px-7 flex items-center  "
              type="primary"
              size="large"
              shape="round"
              icon={<HistoryOutlined />}
              onClick={() => {
                setIsModalPriorityOpen(true);
                setPriorityList([]);
              }}
            >
              {t('UIKiosk.banner.PriorityBanner.title')}
            </Button>
            <Button
              className=" py-0 px-7 flex items-center  "
              type="primary"
              size="large"
              shape="round"
              icon={<UploadOutlined />}
              onClick={() => {
                setIsModalAddOpen(true);
              }}
            >
              {t('UIKiosk.banner.addBanner.btnUpload')}
            </Button>
          </div>
        </div>
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) =>
              console.log(`current index: ${current}, prev index: ${prev}`),
          }}
        >
          <List
            size="large"
            pagination={false}
            dataSource={bannerList}
            renderItem={(item) => (
              <List.Item
                className=" bg-colorBgContainer mb-2 rounded-lg shadow-sm flex flex-wrap gap-5  items-center md:flex-nowrap"
                key={item.imageKey}
              >
                <div className="m-auto w-1/2 sm:w-1/3 md:w-1/6 xl:w-1/12  ">
                  <Image
                    width={'100%'}
                    src={`${item?.imageKey}`}
                    className={`${!item?.isActive && 'grayscale'}`}
                  />
                </div>
                <div className="flex flex-wrap xl:flex-nowrap items-center justify-between w-full gap-2 md:gap-0  ">
                  <div className="flex flex-wrap justify-center items-center w-full md:w-2/6">
                    <Divider
                      type="vertical"
                      className="h-32 text-center hidden
								md:block"
                    />
                    <List.Item.Meta
                      className="text-center md:text-left"
                      title={
                        <p className="text-lg   font-semibold">
                          {item?.imageKey.substring(item?.imageKey.lastIndexOf('/') + 1)}
                        </p>
                      }
                      description={item?.priority}
                    />
                  </div>
                  <div className=" w-full flex-wrap md:w-4/6  md:justify-end flex justify-center items-center gap-3">
                    <Tooltip
                      title={
                        <p className="text-base">
                          {item?.isActive
                            ? `${t('UIKiosk.banner.enabledMess')}`
                            : `${t('UIKiosk.banner.disabledMess')}`}
                        </p>
                      }
                      color={!item?.isActive ? '#f59e0b' : '#00b96b'}
                      key={item.imageKey}
                      placement="bottom"
                      className="px-10 "
                    >
                      <Button
                        className={`${
                          item?.isActive
                            ? 'bg-successColor hover:bg-successColorHover'
                            : 'bg-warningColor hover:bg-warningColorHover'
                        }  px-4 text-base   py-0  flex items-center min-w-[180px] justify-center `}
                        size="large"
                        type="primary"
                        shape="round"
                        onClick={() => {
                          showConfirmNotify(
                            item?.isActive
                              ? `${t('buttons.disabled')} ${item.imageKey}`
                              : `${t('buttons.enabled')} ${item.imageKey}`,
                            item?.isActive
                              ? `${t('UIKiosk.banner.ChangeStatusKiosk.DisabledMess')}`
                              : `${t('UIKiosk.banner.ChangeStatusKiosk.enabledMess')}`,
                            item?.isActive ? 'InActive' : 'Active',
                            item?.imageKey
                          );
                        }}
                        icon={
                          item?.isActive ? (
                            <CheckOutlined />
                          ) : (
                            // <PauseCircleOutlined />
                            <DisconnectOutlined />
                          )
                        }
                      >
                        {item?.isActive
                          ? t('UIKiosk.banner.enabled')
                          : t('UIKiosk.banner.disabled')}
                      </Button>
                    </Tooltip>

                    <Button
                      danger
                      className="  py-0 px-3 flex text-base items-center text-white min-w-[180px] justify-center "
                      type="primary"
                      size="large"
                      shape="round"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        // deleteConnection(kioskId);
                        showConfirmNotify(
                          `${t('buttons.delete')} ${item.imageKey}`,
                          `${t('UIKiosk.banner.ChangeStatusKiosk.DeleteMess')}`,
                          'Delete',
                          item?.imageKey
                        );
                      }}
                    >
                      {t('buttons.delete')}
                    </Button>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Image.PreviewGroup>
      </div>
    </>
  );
}
