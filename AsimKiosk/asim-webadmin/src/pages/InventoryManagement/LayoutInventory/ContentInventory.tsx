import { green } from '@ant-design/colors';
import {
  AppstoreAddOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  InputRef,
  List,
  Modal,
  Progress,
  Row,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import moment from 'moment';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../../apps/hooks';
import { TKioskListDropDownInventory } from '../../../interface';
import { TInventory } from '../../../interface/TInventory';
import AlertMess from '../../../Components/AlertMess/AlertMess';

const { confirm } = Modal;

type DataIndex = keyof TInventory;
const twoColors = { '0%': '#108ee9', '100%': '#87d068' };

export interface IContentInventoryProps {
  inventoryTicketList: TInventory[];
  currentKiosk: TKioskListDropDownInventory;
  filter: any;
  total: number;
  handlePageChange: (page: number, pageSize: number) => void;
  handleOpenDrawer: () => void;
}

export default function ContentInventory({
  currentKiosk,
  inventoryTicketList,
  filter,
  total,
  handlePageChange,
  handleOpenDrawer,
}: IContentInventoryProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('lng');

  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  async function navigateFunction(url: string) {
    await navigate(url);
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<TInventory> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()} className="w-full">
        <Input
          className="flex items-center justify-between"
          ref={searchInput}
          placeholder={`${i18n.language === 'vi' ? 'Nhập' : 'Enter'} ${
            dataIndex === 'kioskName'
              ? t('inventoryManagement.list.columns.kioskName')
              : dataIndex === 'groupName'
              ? t('inventoryManagement.list.columns.groupName')
              : t('inventoryManagement.list.columns.creatorName')
          }`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
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
            {t('buttons.cancel')}
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
      <SearchOutlined style={{ color: filtered ? '#21c55d' : undefined, fontSize: '20px' }} />
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

  const columns: ColumnsType<TInventory> = [
    {
      title: `${t('inventoryManagement.list.columns.STT')}`,
      dataIndex: 'index',
      key: 'index',
      width: 95,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: `${t('inventoryManagement.list.columns.kioskName')}`,
      dataIndex: 'kioskName',
      key: 'kioskName',
      ...getColumnSearchProps('kioskName'),
      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('inventoryManagement.list.columns.groupName')}`,
      dataIndex: 'groupName',
      key: 'groupName',
      ...getColumnSearchProps('groupName'),
      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('inventoryManagement.list.columns.createdAt')}`,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, { createdAt }) => {
        return <p>{moment(createdAt).format('DD/MM/YYYY')}</p>;
      },
    },
    {
      title: `${t('inventoryManagement.list.columns.progress')}`,
      key: 'completionProgress',
      dataIndex: 'completionProgress',
      render: (_, { completionProgress, dispenserCount }) => {
        return (
          <Progress
            steps={dispenserCount}
            percent={completionProgress}
            size={[20, 30]}
            strokeColor={green[5]}
          />
        );
      },
    },
    {
      title: `${t('inventoryManagement.list.columns.creatorName')}`,
      dataIndex: 'creatorName',
      key: 'creatorName',
      ...getColumnSearchProps('creatorName'),
      render: (text) => <p>{text}</p>,
    },

    {
      title: `${t('group.list.columns.action')}`,
      key: 'action',
      // fixed: 'right',

      render: (_, record) => (
        <Space>
          <Button
            size="middle"
            type="primary"
            shape="round"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              const id = record.id;
              navigateFunction(`/inventory/ticket/${id}`);
            }}
          >
            {t('group.list.btnAcction')}
          </Button>
          {/* {record.completionState === CompletionStatus.Pending && (
            <Button
              size="middle"
              // type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
              // onClick={() => {
              //   // console.log(record);
              //   const id = record.id;
              //   const name = record.groupName;
              //   showDeleteConfirm(
              //     `${t('group.list.DeleteConfirmTitle')} ${name}`,
              //     `${t('group.list.DeleteConfirmDesc')}`,
              //     id
              //   );
              // }}
            >
              {t('group.list.btnDelete')}
            </Button>
          )} */}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        className=" xl:mx-auto mb-4 w-full  break-words "
        title={
          <p className=" text-base md:text-xl break-words font-semibold">
            {t('kiosk.detail.info')}
          </p>
        }
        headStyle={{
          textAlign: 'center',
          padding: '0px',
        }}
      >
        <Row gutter={[16, 16]} justify="space-around" align="middle">
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            className="text-base items-center flex font-semibold  "
          >
            <div className="w-1/3  xl:w-1/4 2xl:w-1/5">{t('kiosk.detail.form.name')}:</div>
            <div className="w-1/2 sm:w-5/6 pl-5  break-word ">{currentKiosk.kioskName}</div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            className="text-base  items-center flex font-semibold"
          >
            <div className="w-1/3  xl:w-1/4 2xl:w-1/5 ">{t('kiosk.detail.form.deviceId')}:</div>
            <div className="w-1/2 2xl:w-3/4 pl-5 break-word  ">{currentKiosk.deviceId}</div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            className="text-base items-center flex font-semibold "
          >
            <div className="w-1/3  xl:w-1/4 2xl:w-1/5 ">{t('kiosk.detail.form.groupId')}:</div>
            <div className="w-1/2 2xl:w-3/4 pl-5 break-word ">{currentKiosk.groupName}</div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            className="text-base items-center flex font-semibold "
          >
            <div className="w-1/3  xl:w-1/4 2xl:w-1/5 ">{t('kiosk.detail.form.status')}:</div>
            <div className="w-1/2 2xl:w-3/4 pl-5 break-word ">
              {currentKiosk.status && (
                <Tag
                  className="m-0"
                  color={currentKiosk.status.toLocaleLowerCase() === 'inactive' ? 'red' : 'blue'}
                  key={'isOnline'}
                >
                  {currentKiosk.status.toUpperCase()}
                </Tag>
              )}
            </div>
          </Col>
        </Row>
      </Card>
      <Divider
        orientation="center"
        className="font-semibold  text-base md:text-xl  text-center word-break w-full "
      >
        {t('inventoryManagement.inventoryKioskInfo')}
      </Divider>
      {/* <AlertMess
        type="warning"
        message={`${t('inventoryManagement.AlertAddTicketMess')}`}
        showIcon={true}
      ></AlertMess> */}
      <List
        className="w-full mt-2 "
        grid={{
          gutter: 12,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 4,
          xxl: 4,
        }}
        dataSource={currentKiosk.dispensers}
        renderItem={(item, index) => (
          <List.Item>
            <Card
              headStyle={{
                fontSize: '16px',
                lineHeight: '26px',
                fontWeight: '600',
                textAlign: 'center',
              }}
              // hoverable
              title={`${t('inventoryManagement.dispenser')} ${index + 1}`}
              actions={[
                <Tooltip
                  title={`${t(
                    'inventoryManagement.list.KioskInventory.cleanErrorTray'
                  )}`}
                  color={'orange'}
                  key={item.dispenserSlot}
                  placement="bottom"
                  className="px-20 "
                >
                  <SyncOutlined style={{ fontSize: '22px' }} key="setting" onClick={() => {}} />
                </Tooltip>,
              ]}
            >
              <div className="flex flex-col items-center">
                <div className="w-full gap-2 flex py-1">
                  <p className=" font-medium text-base  w-4/6 ">
                    {t('inventoryManagement.list.KioskInventory.itemCode')}:
                  </p>
                  <p className=" font-medium text-base  w-2/6  break-words">{item.itemCode}</p>
                </div>
                <div className="w-full gap-2 flex py-1 ">
                  <p className=" font-medium text-base  w-4/6  ">
                    {t('inventoryManagement.list.KioskInventory.dispenserSlot')}:
                  </p>
                  <p className=" font-medium text-base  w-2/6 ">{item.dispenserSlot}</p>
                </div>
                <div className="w-full gap-2 flex py-1 ">
                  <p className=" font-medium text-base  w-4/6  ">
                    {t('inventoryManagement.list.KioskInventory.spaceRemaining')}:
                  </p>
                  <p className=" font-medium text-base  w-2/6   ">{item.spaceRemaining}</p>
                </div>
                <div className="w-full gap-2 flex py-1 ">
                  <p className=" font-medium text-base  w-4/6  ">
                    {t('inventoryManagement.list.KioskInventory.quantity')}:
                  </p>
                  <div className="w-2/6">
                    <Tag
                      // bordered={false}
                      color={`${item.isLow ? 'orange' : 'blue'}`}
                      className=" font-medium text-base    text-center "
                    >
                      {item.quantity}
                    </Tag>
                  </div>
                </div>
                <div className="w-full gap-2 flex py-1 ">
                  <p className=" font-medium text-base  w-4/6  ">
                    {t('inventoryManagement.list.KioskInventory.errorQuantity')}:
                  </p>
                  <div className="w-2/6">
                    <Tag
                      // bordered={false}
                      color={'red'}
                      className=" font-medium text-base    text-center "
                    >
                      {item.errorQuantity}
                    </Tag>
                  </div>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Divider
        orientation="center"
        className="font-semibold  text-base md:text-xl  text-center word-break w-full "
      >
        {t('inventoryManagement.ticketList')}
      </Divider>

      <Button
        type="primary"
        size="large"
        shape="round"
        icon={<AppstoreAddOutlined />}
        onClick={handleOpenDrawer}
        className="w-fit mb-4"
      >
        {t('inventoryManagement.AddTicket')}
      </Button>

      <Table
        columns={columns}
        dataSource={inventoryTicketList}
        tableLayout={'auto'}
        scroll={{ x: 500 }}
        rowKey={(record) => record.id}
        pagination={{
          position: ['bottomCenter'],
          defaultCurrent: 1,
          showSizeChanger: true,
          pageSizeOptions: ['10', '15', '20', '25'],
          onChange: handlePageChange,
          total: total,
          current: filter.page,
          pageSize: filter.pageSize,
        }}
      />
    </>
  );
}
