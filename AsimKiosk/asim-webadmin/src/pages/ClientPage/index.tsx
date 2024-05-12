import {
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Input, InputRef, Modal, Space, Table, Tag } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/es/table/interface';
import { lazy, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { SignalRContext, SingalListner } from '../../Context';

import { useAppDispatch } from '../../apps/hooks';
import { TClient, THubReceiveKiosksOnline } from '../../interface';
import ClientApi from '../../service/Client.service';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { CurrentKioskState, StatusEnumString } from '../../Constant/Status';

const Forbidden = lazy(() => import('../../CoreUI/Forbidden'));
const { confirm } = Modal;
type DataIndex = keyof TClient;
let rawData: TClient[] = [];
export interface ClientPage {}

export default function ClientPage(props: ClientPage) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('lng');

  const { connection } = useContext(SignalRContext);
  const [isRender, setIsRender] = useState<boolean>(false);
  const [kioskList, setKioskList] = useState<TClient[]>([]);
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  async function getClientAsync() {
    try {
      dispatch(setLoading(true));
      const response = await ClientApi.getAll();

      rawData = response.data.data;
      setKioskList(
        response.data.data.map((kiosk: any) => ({
          ...kiosk,
          state: 'Offline',
        }))
      );
      // console.log('logAPI', response.data.data);

      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));

      toast.error(`${error}`);
      console.log('failed to fetch productList', error);
    }
  }

  const handleSyncKioskList = () => {
    connection!.commandReceived = (res: any) => {
      const KiosksOnline: THubReceiveKiosksOnline[] = res;
      console.log('go on baby', KiosksOnline);
      // Mặc định trạng thái "State" của kiosk là Offline
      rawData = rawData.map((kiosk: any) => ({
        ...kiosk,
        state: 'Offline',
      }));
      let newData = [...rawData];
      console.log('111111', newData);

      for (let i = 0; i < KiosksOnline.length; i++) {
        const kioskDeviceId = KiosksOnline[i].DeviceId;
        // Kiểm tra xem kiosk.DeviceId có tồn tại trong danh sách data không
        const matchingDataIndex = newData.findIndex((item) => item.deviceId === kioskDeviceId);

        if (matchingDataIndex !== -1) {
          // Nếu tìm thấy, cập nhật trạng thái theo điều kiện
          newData[matchingDataIndex].name === ''
            ? // handle trường hợp bắn 2 kiosk mới lên 1 lúc => state 2 kiosk luôn là pending
              (newData[matchingDataIndex].state = KiosksOnline[i].IsApproved ? 'Online' : 'Pending')
            : // Nếu kiosk đã có trong DB thì cập nhật lại state cho Kiosk theo trạng thái state của HUB. và check thêm status của kiosk nếu là inactive thì state sẽ là ""
              console.log(CurrentKioskState(KiosksOnline[i].State));
          newData[matchingDataIndex].status.toLocaleLowerCase() ===
          StatusEnumString.Active.toLocaleLowerCase()
            ? (newData[matchingDataIndex].state = CurrentKioskState(KiosksOnline[i].State))
            : (newData[matchingDataIndex].state = '');
        } else {
          // Nếu không tìm thấy trong DB, khởi tạo 1 kiosk mới và chờ Approved
          newData.unshift({
            deviceId: kioskDeviceId,
            name: '',
            healthStatus: '',
            status: '',
            state: 'Pending',
            groupName: '',
          });
        }
      }
      console.log('22222', newData);
      setKioskList(newData);
    };
  };

  useEffect(() => {
    console.log('Get all Kiosk');
    getClientAsync().then(() => {
      connection && connection!.HubConnection?.invoke('KioskOnline');
    });
  }, [isRender]);

  useEffect(() => {
    // get Online kiosk list form HUB
    console.log('rendering 1');

    connection && handleSyncKioskList();
  }, [SingalListner.onChanged]);

  // const showDeleteConfirm = (title: string, desc: string, id: string) => {
  // 	confirm({
  // 		title: title,
  // 		icon: (
  // 			<ExclamationCircleFilled style={{ fontSize: "22px", color: "red" }} />
  // 		),
  // 		content: desc,
  // 		okText: "Xoá",
  // 		okType: "danger",
  // 		cancelText: "Huỷ",
  // 		cancelButtonProps: { type: "default" },
  // 		autoFocusButton: "cancel",
  // 		onOk() {
  // 			{
  // 				//delete kiosk
  // 				handleDeleteKiosk(id);
  // 			}
  // 		},
  // 		onCancel() {
  // 			console.log("Cancel");
  // 		},
  // 	});
  // };

  const approveKioskAsync = async (id: string) => {
    try {
      dispatch(setLoading(true));
      const response = await ClientApi.approveKioskAsync(id);
      console.log(response);
      if (response.data.status) {
        // window.location.reload();
        const resKiosk = response.data.data;
        let newDataKiosk = [...kioskList];
        console.log('111111111', newDataKiosk);

        const kiosk = newDataKiosk.find((kiosk) => kiosk.deviceId === response.data.data.deviceId);
        if (kiosk) {
          kiosk.deviceId = resKiosk.deviceId;
          kiosk.name = resKiosk.name;
          kiosk.status = resKiosk.status;
          kiosk.healthStatus = resKiosk.healthStatus;
          kiosk.state = 'Online';
        }
        console.log('22222222', newDataKiosk);
        setKioskList(newDataKiosk);
        rawData = newDataKiosk;
        toast.success(`success`);
      }
    } catch (err: any) {
      // console.log("Handle on api", err);
      const { errors } = err;
      // errors.map((el: any) => toast.error(`${el}`));
      let content = '';
      for (let key in errors) {
        if (errors.hasOwnProperty(key)) {
          let value = errors[key];
          content += value + '\n';
        }
      }
      toast.error(`${content}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<TClient> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()} className="w-full">
        <Input
          className="flex items-center justify-between"
          ref={searchInput}
          placeholder={`${i18n.language === 'vi' ? 'Nhập' : 'Enter'} ${
            dataIndex === 'name'
              ? t('kiosk.list.columns.name')
              : dataIndex === 'groupName'
              ? t('kiosk.list.columns.groupName')
              : t('kiosk.list.columns.deviceId')
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

  const columns: ColumnsType<TClient> = [
    {
      title: `${t('kiosk.list.columns.deviceId')}`,
      dataIndex: 'deviceId',
      key: 'deviceId',
      width: 95,
      fixed: 'left',
      ellipsis: true,
      ...getColumnSearchProps('deviceId'),
      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('kiosk.list.columns.name')}`,
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('kiosk.list.columns.groupName')}`,
      dataIndex: 'groupName',
      key: 'groupName',
      ...getColumnSearchProps('groupName'),
      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('kiosk.list.columns.status')}`,
      key: 'status',

      dataIndex: 'status',
      render: (_, { status }) => {
        let color = '';
        if (status.toLocaleLowerCase() === StatusEnumString.Inactive.toLocaleLowerCase()) {
          color = 'red';
        }
        if (status.toLocaleLowerCase() === StatusEnumString.Active.toLocaleLowerCase()) {
          color = 'blue';
        }
        return (
          <Tag color={color} key={'status'} className="font-[600]  ">
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: `${t('kiosk.list.columns.state')}`,
      key: 'state',
      dataIndex: 'state',
      render: (_, { state }) => {
        let color = '';
        if (state.toLowerCase() === StatusEnumString.Online.toLowerCase()) {
          color = 'green';
        }
        if (state.toLowerCase() === StatusEnumString.Locked.toLowerCase()) {
          color = 'red';
        }
        if (state.toLowerCase() === StatusEnumString.Busy.toLowerCase()) {
          color = 'processing';
        }
        if (state.toLowerCase() === StatusEnumString.Offline.toLowerCase()) {
          color = 'volcano';
        }
        if (state.toLowerCase() === StatusEnumString.Pending.toLowerCase()) {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={'state'} className="font-[600]  ">
            {state && state.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: `${t('kiosk.list.columns.healthStatus')}`,
      dataIndex: 'healthStatus',

      key: 'healthStatus',
    },
    {
      title: `${t('kiosk.list.columns.action')}`,
      key: 'action',
      // fixed: 'right',

      render: (_, record) => (
        <Space>
          {record.state !== 'Pending' && (
            <Button
              className="bg-cyan-500 hover:bg-cyan-600  justify-center  flex items-center  "
              size="middle"
              type="primary"
              shape="round"
              icon={<InfoCircleOutlined />}
              onClick={() => {
                // console.log(record);
                const id = record.deviceId;
                navigateFunction(`/client/${id}`);
              }}
            >
              {t('kiosk.list.btnAcction')}
            </Button>
          )}
          {record.state === 'Pending' && (
            <>
              <Button
                color="blue"
                shape="round"
                icon={<CheckOutlined />}
                onClick={() => {
                  const id = record.deviceId;
                  approveKioskAsync(id);
                }}
              >
                {t('kiosk.list.btnApproved')}
              </Button>
              <Button
                type="primary"
                shape="round"
                icon={<CloseOutlined />}
                onClick={() => {
                  const id = record.deviceId;
                  navigateFunction(`/client/${id}`);
                }}
              >
                {t('kiosk.list.btnReject')}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className=" bg-gray-100 min-h-min ">
        <h2 className="font-bold text-3xl  text-inherit  mt-2 text-center ">
          {t('kiosk.title')}
        </h2>

        <Table
          className="my-4"
          columns={columns}
          dataSource={kioskList}
          tableLayout={'auto'}
          scroll={{ x: 550 }}
          rowKey={(record) => record.deviceId}
          pagination={false}
          // antd site header height
          sticky={{ offsetHeader: 64 }}
        />
      </div>
    </>
  );
}
