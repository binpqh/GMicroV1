import { memo, useEffect, useState } from 'react';
import {
  InfoCircleOutlined,
  UserDeleteOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { useAppDispatch } from '../../../apps/hooks';
import { TGroupUsers } from '../../../interface/IGroup';
import queryString from 'query-string';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import UserApi from '../../../service/User.service';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import GroupApi from '../../../service/Group.service';

export interface IUserOfGroupProps {
  // groupUserList: TGroupUsers[];
  handleCloseDrawer: () => void;
  handleRerender: () => void;
  isUserOfGroup: boolean;
  groupId: string;
}

function UserOfGroup({
  isUserOfGroup,
  groupId,
  handleRerender,
  handleCloseDrawer,
}: IUserOfGroupProps) {
  const { t } = useTranslation('lng');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [UserList, setUserList] = useState<TGroupUsers[]>();
  const [size, setSize] = useState<number>(10);
  const [pagination, setPagination] = useState<number>(1);
  const [total, setToTal] = useState<number>();
  const [filter, setFilter] = useState({
    page: pagination,
    pageSize: size,
  });

  async function navigateFunction(url: string) {
    await navigate(url);
  }
  const columnsUserList: ColumnsType<TGroupUsers> = [
    {
      title: `${t('account.form.username')}`,
      dataIndex: 'userName',
      key: 'userName',
      // ...getColumnSearchProps('userName'),
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Tên Người Dùng',
      dataIndex: 'fullName',
      key: 'fullName',
      // ...getColumnSearchProps('fullName'),
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Quyền',
      dataIndex: 'role',
      key: 'role',
      render: (text) => <p>{text}</p>,
    },

    {
      title: 'Tình trạng',
      dataIndex: 'activeStatus',
      render: (_, { activeStatus }) => {
        let color = '';

        if (activeStatus.toLocaleLowerCase() === 'inactive') {
          color = 'red';
        }
        if (activeStatus.toLocaleLowerCase() === 'active') {
          color = 'blue';
        }

        return (
          <Tag color={color} key={'activeStatus'} className="font-semibold ">
            {activeStatus.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="bg-cyan-500 hover:bg-cyan-600   flex items-center  "
            size="middle"
            type="primary"
            shape="round"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              const id = record.id;
              navigateFunction(`/account/${id}`);
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<TGroupUsers> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  const getUsersNoGroup = async () => {
    try {
      const params = queryString.stringify(filter);
      dispatch(setLoading(true));
      const response = await UserApi.getUsersNoGroup(params);
      // console.log(response.data.data);
      setUserList(response.data.data.items);
      setToTal(response.data.data.totalCount);
      dispatch(setLoading(false));
    } catch (error) {
      console.log('failed to fetch getUsersNoGroup', error);
      dispatch(setLoading(false));
    }
  };

  const getUsersInGroup = async () => {
    try {
      const params = queryString.stringify(filter);
      dispatch(setLoading(true));
      const response = await UserApi.getUsersInGroup(groupId, params);
      // console.log(response.data.data);
      setUserList(response.data.data.items);
      setToTal(response.data.data.totalCount);
      dispatch(setLoading(false));
    } catch (error) {
      console.log('failed to fetch getUsersInGroup', error);
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    isUserOfGroup ? getUsersNoGroup() : getUsersInGroup();
  }, [filter, isUserOfGroup]);

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [isUserOfGroup]);

  const handlePageChange = (page: number, pageSize: number) => {
    console.log(page, pageSize);
    setFilter({
      ...filter,
      page: page,
      pageSize: pageSize,
    });

    setSize(pageSize);
    setPagination(size !== pageSize ? 1 : page);
  };

  const removeUsersFromGroup = async (arrayUsersId: React.Key[]) => {
    try {
      dispatch(setLoading(true));
      const response = await GroupApi.removeUsersFromGroup(
        groupId,
        arrayUsersId
      );
      console.log(response.data.data);

      const newUserList = UserList?.filter(
        (user) => !arrayUsersId.includes(user.id)
      );
      console.log(newUserList);
      setUserList(newUserList);
      handleRerender();
      handleCloseDrawer();
      dispatch(setLoading(false));
    } catch (error) {
      console.log('failed to removeUsersFromGroup', error);
      dispatch(setLoading(false));
    }
  };

  const addUserToGroup = async (arrayUsersId: React.Key[]) => {
    try {
      dispatch(setLoading(true));
      const response = await GroupApi.addUserToGroup(groupId, arrayUsersId);

      const newUserList = UserList?.filter(
        (user) => !arrayUsersId.includes(user.id)
      );
      console.log('newUserList', newUserList);
      setUserList(newUserList);
      handleRerender();
      handleCloseDrawer();
      dispatch(setLoading(false));
    } catch (error) {
      console.log('failed to addUserToGroup', error);
      dispatch(setLoading(false));
    }
  };
  return (
    <>
      <Button
        className=" min-w-[150px] 2xl:min-w-[250px] float-right mb-5"
        type="primary"
        size="large"
        shape="round"
        disabled={selectedRowKeys.length === 0}
        danger={!isUserOfGroup}
        icon={isUserOfGroup ? <UserAddOutlined /> : <UserDeleteOutlined />}
        onClick={() => {
          console.log(selectedRowKeys);
          isUserOfGroup
            ? addUserToGroup(selectedRowKeys)
            : removeUsersFromGroup(selectedRowKeys);
        }}
      >
        {isUserOfGroup
          ? `${t('group.update.addUserToGroup')}`
          : `${t('group.update.removeUserFromGroup')}`}
      </Button>

      <Table
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        columns={columnsUserList}
        dataSource={UserList}
        pagination={{
          onChange: (page, pageSize) => handlePageChange(page, pageSize),
          position: ['bottomCenter'],
          defaultCurrent: 2,
          showSizeChanger: true,
          pageSizeOptions: ['10', '15', '20', '25', '30'],
          current: pagination,
          pageSize: size,
          total: total,
        }}
      ></Table>
    </>
  );
}
export default memo(UserOfGroup);
