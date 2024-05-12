import {
  CheckOutlined,
  EditOutlined,
  IssuesCloseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Select, Space, Tag } from 'antd';
import { Suspense, lazy, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';

const { confirm, info } = Modal;

import { useTranslation } from 'react-i18next';

import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import DrawerComponents from '../../../Components/Drawer/index';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { TClient } from '../../../interface';
import { TGroup } from '../../../interface/IGroup';
import ClientApi from '../../../service/Client.service';
import GroupApi from '../../../service/Group.service';
import KioskListOfGroup from '../Components1/KiosListOfGroup';
import UserListOfGroup from '../Components1/UserListOfGroup';
import UserOfGroup from '../Components1/UserOfGroup';

const SkeletonComponent = lazy(() => import('../../../Components/Skeleton'));
// const UserListOfGroup = lazy(() => import('../Components/UserListOfGroup'));
// const UserOfGroup = lazy(() => import('../Components/UserOfGroup'));
// const KioskListOfGroup = lazy(() => import('../Components/KiosListOfGroup'));

const { Option } = Select;
export interface DetailGroupProps {}

const formItemLayout = {
  // labelCol: { span: 5 },
  wrapperCol: { span: 24 },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DetailGroup({}: DetailGroupProps) {
  const groupId = useParams<{ groupId: string }>().groupId || '';
  const { t } = useTranslation('lng');
  // const dispatch = useAppDispatch();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  // isUserOfGroup === true ? add user to group : remove user from group
  const [isUserOfGroup, setIsUserOfGroup] = useState<boolean>(true);

  const [group, setGroup] = useState<TGroup>();
  const [edit, setEdit] = useState<boolean>(false);

  const [isRender, setIsRender] = useState<boolean>(false);

  const [kioskList, setKioskList] = useState<TClient[]>();

  const [totalKioskList, setToTalKioskList] = useState<number>(0);

  const [filterKioskList, setFilterKioskList] = useState({
    page: 1,
    pageSize: 5,
  });

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };
  const handlePageChange = (page: number, pageSize: number) => {
    console.log(page, pageSize);
    setFilterKioskList({
      ...filterKioskList,
      page: page,
      pageSize: pageSize,
    });
  };

  const getDetailGroup = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GroupApi.getGroupById(groupId);
      // console.log(response.data);
      setGroup(response.data.data);
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));

      toast.error(`${error}`);
      console.log('failed to fetch DetailGroup', error);
    }
  };

  const handleUpdateDetailGroup = async (data: { groupName: string; activeStatus: string }) => {
    // console.log('Received values of form: ', data);
    try {
      const response = await GroupApi.updateDetailGroup(groupId, data);
      toast.success(`${t('group.update.messageSuccess')}`);
      setIsRender(!isRender);
    } catch (error) {
      console.log('failed to fetch productList', error);
      toast.error(`${t('group.update.messageError')}`);
    }
  };

  const getKioskListByGroupId = async () => {
    try {
      const params = queryString.stringify(filterKioskList);
      // dispatch(setLoading(true));
      const response = await ClientApi.getKioskByGroupId(groupId, params);
      console.log(response.data.data);
      setKioskList(response.data.data.items);
      setToTalKioskList(response.data.data.totalCount);
      // dispatch(setLoading(false));
    } catch (error: any) {
      // dispatch(setLoading(false));
      toast.error(`${error}`);
      console.log('failed to fetch kiosk', error);
    }
  };
  useEffect(() => {
    getKioskListByGroupId();
  }, [filterKioskList]);

  useEffect(() => {
    getDetailGroup();
  }, [isRender]);

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <h2 className="font-bold text-3xl  text-inherit text-center  my-2">
        {t('group.detail.title')}
      </h2>
      <div className=" bg-gray-100 w-full flex flex-wrap xl:flex-nowrap gap-4 ">
        <Card
          className=" w-full  xl:w-2/6 "
          title={t('group.detail.info')}
          headStyle={{
            fontSize: '20px',
            lineHeight: '26px',
            fontWeight: '600',
            textAlign: 'center',
          }}
          actions={[
            <EditOutlined style={{ fontSize: '22px' }} key="edit" onClick={() => setEdit(true)} />,
            <SettingOutlined
              style={{ fontSize: '22px' }}
              key="setting"
              onClick={() => setEdit(false)}
            />,
          ]}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex  gap-3 xl:gap-2">
              <p className=" font-semibold text-base w-2/6">{t('group.detail.groupName')}</p>
              <p className=" font-[700] text-base w-4/6 break-words">{group?.groupName}</p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base w-2/6 ">{t('group.detail.kioskCount')}</p>
              <p className=" font-[700] text-base w-4/6  ">{group?.kioskCount}</p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base w-2/6 ">{t('group.detail.userCount')}</p>
              <p className=" font-[700] text-base w-4/6  ">{group?.userCount}</p>
            </div>
            <div className="w-full flex   gap-3 xl:gap-2">
              <p className=" font-semibold text-base  w-2/6 ">{t('group.detail.status')}</p>
              <p className=" font-[700] text-base w-4/6  ">
                <Tag
                  className="m-0"
                  color={group?.status.toLocaleLowerCase() === 'inactive' ? 'red' : 'blue'}
                  key={'isOnline'}
                >
                  {group?.status.toUpperCase()}
                </Tag>
              </p>
            </div>
          </div>
        </Card>
        {edit === false && (
          <Card
            className="w-full  xl:w-4/6  "
            title={`Chức năng`}
            headStyle={{
              fontSize: '20px',
              lineHeight: '26px',
              fontWeight: '600',
              textAlign: 'center',
            }}
            // bodyStyle={{height: "100%"}}
          >
            <Space size={24} wrap className="items-start w-full justify-center ">
              <Button
                className="bg-infoColor  hover:bg-infoColorHover min-w-[300px] 2xl:min-w-[350px] "
                type="primary"
                size="large"
                shape="round"
                icon={<IssuesCloseOutlined />}
                onClick={() => {
                  handleOpenDrawer();
                  setIsUserOfGroup(true);
                }}
              >
                {t('group.update.addUserToGroup')}
              </Button>
              <Button
                className="min-w-[300px] 2xl:min-w-[350px] "
                type="primary"
                danger
                size="large"
                shape="round"
                icon={<IssuesCloseOutlined />}
                onClick={() => {
                  handleOpenDrawer();
                  setIsUserOfGroup(false);
                }}
              >
                {t('group.update.removeUserFromGroup')}
              </Button>
            </Space>
          </Card>
        )}
        {edit === true && (
          <Card
            className="w-full  xl:w-4/6  "
            title={`${t('group.update.title')}`}
            headStyle={{
              fontSize: '20px',
              lineHeight: '26px',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            <Form
              name="validate_other"
              {...formItemLayout}
              layout="horizontal"
              labelWrap
              onFinish={handleUpdateDetailGroup}
              className="w-full font-semibold text-base p-0 "
            >
              <Form.Item
                initialValue={group?.groupName}
                className="font-bold  "
                label={`${t('group.update.form.name')}`}
                name="groupName"
                rules={[{ required: true }]}
              >
                <Input className="font-normal" />
              </Form.Item>
              <Form.Item
                initialValue={group?.status}
                name="activeStatus"
                label={`${t('group.update.form.status')}`}
                rules={[{ required: true }]}
              >
                <Select placeholder={`${t('group.update.form.status')}`} allowClear>
                  <Option value={'Active'} key={'Active'}>
                    Active
                  </Option>
                  <Option value={'Inactive'} key={'Inactive'}>
                    Inactive
                  </Option>
                </Select>
              </Form.Item>
              <div className="gap-3  clear-right float-right max-h-8 ">
                <Form.Item>
                  <Button
                    htmlType="submit"
                    className="bg-green-500 hover:bg-green-400 flex  items-center px-5 py-4"
                    size="large"
                    type="primary"
                    shape="round"
                    icon={<CheckOutlined />}
                  >
                    {t('group.update.btnSave')}
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Card>
        )}
      </div>

      {/* ---------------- List User Of Group----------------- */}
      {group?.groupUsers && <UserListOfGroup groupUserList={group?.groupUsers}></UserListOfGroup>}

      {/* ---------------- List Kiosk Of Group----------------- */}
      {kioskList && (
        <KioskListOfGroup
          groupKioskList={kioskList}
          handlePageChange={handlePageChange}
          filterKioskList={filterKioskList}
          totalKioskList={totalKioskList}
        />
      )}
      {/* ---------------- Add or  UserOfGroup----------------- */}
      <DrawerComponents
        title={
          isUserOfGroup
            ? `${t('group.update.addUserToGroup')}`
            : `${t('group.update.removeUserFromGroup')}`
        }
        openDrawer={openDrawer}
        handleCloseDrawer={handleCloseDrawer}
        children={
          <UserOfGroup
            isUserOfGroup={isUserOfGroup}
            groupId={groupId}
            handleRerender={() => setIsRender(!isRender)}
            handleCloseDrawer={handleCloseDrawer}
          />
        }
        width={window.innerWidth >= 1024 ? '70%' : '100%'}
      />
    </Suspense>
  );
}
