import {
  DeleteOutlined,
  DisconnectOutlined,
  ExclamationCircleFilled,
  PauseCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Divider, Form, List, Modal, RadioChangeEvent, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../apps/hooks';
import { StatusEnum, StatusEnumString } from '../../Constant/Status';
import { TAddInstructionVideo, TInstructionVideoRes } from '../../interface/TInstructionVideo';
import InstructionalVideoApi from '../../service/InstructionalVideo.service';
import { showToastErrors } from '../../utils';
import AddInstructionalVideo from './Components/AddInstructionalVideo';

const { confirm } = Modal;

export interface IInstructionalVideos {}

export default function InstructionalVideos(props: IInstructionalVideos) {
  const [form] = Form.useForm();
  const { t } = useTranslation('lng');
  const [instructionVideoList, setInstructionVideoList] = useState<TInstructionVideoRes[]>();
  const [isRender, setIsRender] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    getAllVideos();
  }, [isRender]);


  async function getAllVideos() {
    try {
      dispatch(setLoading(true));
      const response = await InstructionalVideoApi.getAll();
      console.log(response.data.data);
      setInstructionVideoList(response.data.data);
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));
      showToastErrors(error.errors);
    }
  }

  const handleDeleteVideos = async (id: string) => {
    try {
      dispatch(setLoading(true));
      const response = await InstructionalVideoApi.delete(id);
      dispatch(setLoading(false));

      setIsRender(!isRender);
      toast.success('Xoá Video Thành Công');
    } catch (error: any) {
      dispatch(setLoading(false));
      console.log('failed to delete connection', error);
      showToastErrors(error.errors);
    }
  };

  const changeStatusKiosk = async (videoId: string, status: number) => {
    try {
      dispatch(setLoading(true));
      const response = await InstructionalVideoApi.changePaymentConfigStatus(videoId, status);
      setIsRender(!isRender);
      toast.success(`${t('kiosk.ChangeStatusKiosk.messageSuccess')}`);
    } catch (error: any) {
      dispatch(setLoading(false));
      console.log('failed to delete connection', error);
      showToastErrors(error.errors);
    }
  };

  const showConfirmNotify = (
    title: string,
    desc: string,
    options: 'Active' | 'Delete',
    videoId: string
  ) => {
    confirm({
      title: title,
      icon: <ExclamationCircleFilled style={{ fontSize: '22px', color: 'red' }} />,
      content: desc,
      okType: 'danger',
      cancelButtonProps: { type: 'default' },

      onOk() {
        {
          options === 'Active' && changeStatusKiosk(videoId, StatusEnum.Active);
          options === 'Delete' && handleDeleteVideos(videoId);
        }
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddVideo = async (data: TAddInstructionVideo) => {
    try {
      dispatch(setLoading(true));
      const response = await InstructionalVideoApi.AddVideo(data);
      dispatch(setLoading(false));
      setIsRender(!isRender);
      handleCancel();
      toast.success('Thêm Video Thành Công');
      form.resetFields();
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className=" bg-gray-100 min-h-min  ">
        <div className="flex items-center justify-between mb-3 flex-wrap xl:flex-nowrap">
          <h2 className="font-bold text-3xl w-full xl:w-3/5 text-center xl:text-left ">
            Quản lý Quảng Cáo
          </h2>
          <div className="flex w-full xl:w-3/5   justify-end flex-wrap xl:flex-nowrap my-4 gap-5 ">
            <Button
              className="bg-green-500 hover:bg-green-400 py-0 px-7 flex items-center  "
              type="primary"
              size="large"
              shape="round"
              icon={<UploadOutlined />}
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Upload Quảng Cáo
            </Button>
          </div>
        </div>
        <List
          size="large"
          pagination={false}
          dataSource={instructionVideoList}
          renderItem={(item) => (
            <List.Item
              className=" bg-colorBgContainer mb-2 rounded-lg shadow-sm flex flex-wrap gap-5  items-center md:flex-nowrap"
              key={item.videoKey}
            >
              <div className="m-auto  ">
                <ReactPlayer width="260px" height="150px" controls url={item.videoUrl} />
              </div>
              <div className="flex flex-wrap xl:flex-nowrap items-center justify-between w-full gap-2 md:gap-0  ">
                <div className="flex flex-wrap justify-center items-center w-full md:w-2/6">
                  <Divider
                    type="vertical"
                    className="h-24 text-center hidden
								md:block"
                  />
                  <List.Item.Meta
                    className="text-center md:text-left text-ellipsis break-words"
                    title={<p className="text-lg   font-semibold">{item.productType}</p>}
                    description={item.videoKey}
                  />
                </div>
                <div className=" w-full flex-wrap md:w-4/6  md:justify-end flex justify-center items-center gap-3">
                  <Tooltip
                    title={
                      <p className="text-base">
                        {item?.status.toLocaleLowerCase() ===
                        StatusEnumString.Active.toLocaleLowerCase()
                          ? `${t('UIKiosk.banner.enabledMess')}`
                          : `${t('UIKiosk.banner.disabledMess')}`}
                      </p>
                    }
                    color={
                      item?.status.toLocaleLowerCase() ===
                      StatusEnumString.Active.toLocaleLowerCase()
                        ? '#00b96b'
                        : '#f59e0b'
                    }
                    key={item.videoKey}
                    placement="bottom"
                    className="px-10 "
                  >
                    {item.status.toLowerCase() === StatusEnumString.Active.toLocaleLowerCase() ? (
                      <Button
                        icon={<PauseCircleOutlined />}
                        className="  py-0 px-3 flex text-base items-center text-white min-w-[180px] justify-center text-white bg-successColor hover:bg-successColorHover"
                        type="primary"
                        size="large"
                        shape="round"
                      >
                        {t('UIKiosk.banner.enabled')}
                      </Button>
                    ) : (
                      <Button
                        icon={<DisconnectOutlined />}
                        className=" py-0 px-3 flex text-base items-center text-white min-w-[180px] justify-center  bg-warningColor hover:bg-warningColorHover"
                        type="primary"
                        size="large"
                        shape="round"
                        onClick={() => {
                          showConfirmNotify(
                            `${t('buttons.delete')} ${item.videoKey}`,
                            `${t('UIKiosk.banner.ChangeStatusKiosk.DeleteMess')}`,
                            'Active',
                            item?.id
                          );
                        }}
                      >
                        {t('UIKiosk.banner.disabled')}
                      </Button>
                    )}
                  </Tooltip>

                  <Button
                    danger
                    className="  py-0 px-3 flex text-base items-center text-white min-w-[180px] justify-center "
                    type="primary"
                    size="large"
                    shape="round"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      showConfirmNotify(
                        `${t('buttons.delete')} ${item.videoKey}`,
                        `${t('UIKiosk.banner.ChangeStatusKiosk.DeleteMess')}`,
                        'Delete',
                        item?.id
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
      </div>

      <AddInstructionalVideo
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleAddVideo={handleAddVideo}
      />
    </>
  );
}
