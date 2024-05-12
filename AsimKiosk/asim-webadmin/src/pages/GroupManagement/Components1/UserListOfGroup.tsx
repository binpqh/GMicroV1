import { SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Input,
  InputRef,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { memo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
const { confirm, info } = Modal;

import { ColumnType, ColumnsType } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/es/table/interface';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../../apps/hooks';
import { TGroupUsers } from '../../../interface/IGroup';

type DataIndex = keyof TGroupUsers;
const { Option } = Select;
export interface DetailGroupProps {
  groupUserList: TGroupUsers[];
}

function UserListOfGroup({ groupUserList }: DetailGroupProps) {
  const { t } = useTranslation('lng');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  async function navigateFunction(url: string) {
    await navigate(url);
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<TGroupUsers> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{ padding: 8 }}
        onKeyDown={(e) => e.stopPropagation()}
        className="w-full"
      >
        <Input
          className="flex items-center justify-between"
          ref={searchInput}
          placeholder={`Nhập ${
            dataIndex === 'userName' ? 'Tên Tài Khoản' : 'Tên Người Dùng'
          }`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            danger
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
            size="small"
            style={{ width: 100 }}
          >
            {t('buttons.delete')}
          </Button>
          <Button
            // type="dashed"
            className="border-colorLink text-colorLink"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
            icon={<SearchOutlined className="align-middle" size={20} />}
            style={{ width: 100 }}
          >
            {t('buttons.filter')}
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{ color: filtered ? '#21c55d' : undefined, fontSize: '20px' }}
      />
    ),

    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => searchedColumn === dataIndex && text,
  });

  const columnsUserList: ColumnsType<TGroupUsers> = [
    {
      title: `${t('account.form.username')}`,
      dataIndex: 'userName',
      key: 'userName',
      ...getColumnSearchProps('userName'),
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Tên Người Dùng',
      dataIndex: 'fullName',
      key: 'fullName',
      ...getColumnSearchProps('fullName'),
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
        if (activeStatus.toLocaleLowerCase() === 'deleted') {
          color = 'volcano';
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

  return (
    <>
      <Divider
        orientation="center"
        className="px-3 font-bold text-2xl  text-inherit text-center  my-4"
      >
        {t('group.detail.groupUsers')}
      </Divider>

      <Table
        rowKey={(record) => record.id}
        columns={columnsUserList}
        dataSource={groupUserList}
        className="border-black "
        pagination={false}
      ></Table>
    </>
  );
}
export default memo(UserListOfGroup);
