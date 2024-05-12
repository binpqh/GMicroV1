import { EditOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table, Tag } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/es/table/interface';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { IAccount, IColumnsTypeAccount } from '../../interface';
import AccountApi from '../../service/Account.service';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { IPage } from '../../interface/IPage';
import CreateAccount from './component/CreateAccount';
import { getRole } from '../../apps/Feature/authSlice/authSlice';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { useAppSelector } from '../../apps/hooks';

type DataIndex = keyof IAccount;
const initPage = {
  page: 0,
  pageSize: 0,
  totalCount: 0,
  totalPage: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  items: [],
};

export default function AccountPage() {
  const { t, i18n } = useTranslation('lng');
  const role = useAppSelector(getRole);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchedColumn, setSearchedColumn] = useState('');
  const [createAccountModelVisible, setCreateAccountModelVisible] = useState(false);
  const [pageData, setPageData] = useState<IPage<IAccount>>(initPage);

  const [filter, setFilter] = useState({
    page: 1,
    pageSize: 10,
  });

  const handleSearch = (confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };
  function navigateFunction(url: string) {
    dispatch(setLoading(true));
    navigate(url);
    dispatch(setLoading(false));
  }

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IColumnsTypeAccount> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()} className="w-full">
        <Input
          className="flex items-center justify-between"
          placeholder={`Nhập ${dataIndex === 'userName' ? 'Tên Tài Khoản' : 'Tên Người Dùng'}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            danger
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              confirm({ closeDropdown: false });

              setSearchedColumn(dataIndex);
            }}
            size="small"
            style={{ width: 100 }}
          >
            Xoá
          </Button>
          <Button
            // type="dashed"
            className="border-teal-500 text-teal-500"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchedColumn(dataIndex);
            }}
            icon={<SearchOutlined className="align-middle" size={20} />}
            style={{ width: 100 }}
          >
            Lọc
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#21c55d' : undefined, fontSize: '20px' }} />
    ),

    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    render: (text) => searchedColumn === dataIndex && text,
  });

  const columns: ColumnsType<IColumnsTypeAccount> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (text) => <p>{text}</p>,
      fixed: 'left',
    },
    {
      title: `${t('account.form.username')}`,
      dataIndex: 'userName',
      key: 'userName',
      ...getColumnSearchProps('userName'),
      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('account.form.fullName')}`,
      dataIndex: 'fullName',
      key: 'fullName',
      ...getColumnSearchProps('fullName'),
      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('account.form.role')}`,
      dataIndex: 'role',
      key: 'role',
      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('account.form.groupId')}`,
      dataIndex: 'groupName',
      key: 'groupName',
      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('account.form.status')}`,
      dataIndex: 'activeStatus',
      render: (_, { activeStatus }) => {
        if (activeStatus == 'Active') {
          return (
            <Tag color={'blue'} key={'activeStatus'}>
              {activeStatus.toUpperCase()}
            </Tag>
          );
        }
        if (activeStatus == 'Inactive') {
          return (
            <Tag color={'error'} key={'activeStatus'}>
              {activeStatus.toUpperCase()}
            </Tag>
          );
        }
      },
    },
    {
      title: `${t('account.form.action')}`,
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
  const handlePageChange = (page: number, pageSize: number) => {
    setFilter({
      ...filter,
      page: page,
      pageSize: pageSize,
    });
  };

  const formatDataToColumnTypeData = (data: IAccount[]) => {
    if (!data) return [];
    return data.map((accountData, index) => {
      return { ...accountData, index: 1 + index };
    });
  };

  const getAccountData = async () => {
    try {
      dispatch(setLoading(true));
      const params = queryString.stringify(filter);

      const res = await AccountApi.getAllAccounts(params);
      setPageData(res.data);
      dispatch(setLoading(false));
    } catch (error: any) {
      //@ts-ignore
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };

  const handleCreateAccountVisible = () => {
    setCreateAccountModelVisible(!createAccountModelVisible);
  };

  useEffect(() => {
    getAccountData();
  }, [filter.page, filter.pageSize]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between my-4">
        <Button
          className="bg-green-500 flex items-center "
          type="primary"
          size="large"
          onClick={handleCreateAccountVisible}
        >
          <EditOutlined />
          {`${t('register.title')}`}
        </Button>
      </div>

      <h1 className="my-4 text-xl sm:text-4xl text-center font-semibold">
        {`${t('account.title')}`}
      </h1>

      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={formatDataToColumnTypeData(pageData.items)}
        className="border-black "
        pagination={{
          position: ['bottomCenter'],
          defaultCurrent: 1,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '15', '20'],
          onChange: handlePageChange,
          total: pageData?.totalCount,
          pageSize: pageData?.pageSize,
        }}
        scroll={{ x: 630 }}
      />
      {createAccountModelVisible && (
        <Modal
          title={
            <h4 className="font-bold text-2xl text-center mb-5 text-primary">
              {`${t('register.title').toUpperCase()}`}
            </h4>
          }
          open={createAccountModelVisible}
          onCancel={handleCreateAccountVisible}
          footer={null}
          centered={true}
        >
          <CreateAccount
            role={role as string}
            handleCreateAccountVisible={handleCreateAccountVisible}
          />
        </Modal>
      )}
    </div>
  );
}
