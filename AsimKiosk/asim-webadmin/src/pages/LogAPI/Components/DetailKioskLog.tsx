import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Descriptions, Modal, Space } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';

import type { RangePickerProps } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../../apps/hooks';
import { TKioskDetailLog, TKioskLog } from '../../../interface';
import LogApi from '../../../service/LogAPI.service';
import moment from 'moment';
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf('day');
};
export interface IDetailKioskLogProps {}

export default function DetailKioskLog(props: IDetailKioskLogProps) {
  const deviceId = useParams<{ deviceId: string }>().deviceId || '';
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('lng');

  const [isRender, setIsRender] = useState<boolean>(false);
  const [is403, setIs403] = useState<boolean>(false);

  const [kioskLogData, setKioskLogData] = useState<TKioskDetailLog[]>();
  const [modalDetailLog, setModalDetailLog] = useState<{
    isOpen: boolean;
    detailKioskLog?: TKioskDetailLog;
  }>({ isOpen: false });
  const [total, setToTal] = useState<number>();
  const [filter, setFilter] = useState({
    page: 1,
    pageSize: 10,
    from: dayjs().format('YYYY-MM-DD'),
    to: dayjs().format('YYYY-MM-DD'),
  });

  const handleCancel = () => {
    setModalDetailLog({ isOpen: false });
  };

  async function getAllKioskLogAsync() {
    try {
      dispatch(setLoading(true));
      const response = await LogApi.getKioskLog({ ...filter, deviceId: deviceId });
      setKioskLogData(response.data.data.items);
      setToTal(response.data.data.totalCount);
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));
      if (error.status === 403) {
        setIs403(!is403);
      } else {
        toast.error(`${error}`);
        console.log('failed to fetch productList', error);
      }
    }
  }

  useEffect(() => {
    getAllKioskLogAsync();
  }, [isRender, filter.page, filter.pageSize, filter.from, filter.to, deviceId]);

  const handlePageChange = (page: number, pageSize: number) => {
    // console.log(page, pageSize);
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

  async function navigateFunction(url: string) {
    await navigate(url);
  }

  const columns: ColumnsType<TKioskDetailLog> = [
    {
      title: `${t('errorManagement.detail.list.columns.createdAt')}`,
      dataIndex: 'createAt',
      key: 'createAt',
      fixed: true,
      ellipsis: true,
      render: (_, { createdAt }) => {
        return <p>{moment(createdAt).format('DD/MM/YYYY HH:MM:SS A')}</p>;
      },
    },
    {
      title: `${t('errorManagement.detail.list.columns.type')}`,
      dataIndex: 'type',
      key: 'type',
    },

    {
      title: `${t('errorManagement.detail.list.columns.apiUrl')}`,
      dataIndex: 'urlAPI',
      ellipsis: true,
      key: 'urlAPI',
    },
    {
      title: `${t('errorManagement.detail.list.columns.desc')}`,
      dataIndex: 'desc',
      ellipsis: true,
      key: 'desc',
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
              console.log(record);

              setModalDetailLog({ isOpen: true, detailKioskLog: record });
            }}
          >
            {t('group.list.btnAcction')}
          </Button>
        </Space>
      ),
    },
  ];
  const onRangeChangeAll = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      // console.log('From: ', dates[0], ', to: ', dates[1]);
      // console.log('All From: ', dateStrings[0], ', to: ', dateStrings[1]);
      handChangeFilterDays(dateStrings[0], dateStrings[1]);
    }
  };
  return (
    <>
      <div className=" bg-gray-100 min-h-min ">
        <h2 className="font-bold text-3xl  text-inherit mb-4 text-center ">
          {t('errorManagement.detail.title')}
        </h2>
        <div className="flex justify-center items-center gap-3 mb-4 ">
          <h2 className="font-semibold">{t('datePickerFrom.datePicker')}:</h2>
          <RangePicker
            className=""
            disabledDate={disabledDate}
            defaultValue={[dayjs(dayjs(), 'YYYY/MM/DD'), dayjs(dayjs(), 'YYYY/MM/DD')]}
            presets={[
              {
                label: `${t('datePickerFrom.today')}`,
                value: [dayjs().add(0, 'd'), dayjs()],
              },
              {
                label: `${t('datePickerFrom.Last7Days')}`,
                value: [dayjs().add(-7, 'd'), dayjs()],
              },
              {
                label: `${t('datePickerFrom.Last14Days')}`,
                value: [dayjs().add(-14, 'd'), dayjs()],
              },
              {
                label: `${t('datePickerFrom.Last30Days')}`,
                value: [dayjs().add(-30, 'd'), dayjs()],
              },
              {
                label: `${t('datePickerFrom.Last90Days')}`,
                value: [dayjs().add(-90, 'd'), dayjs()],
              },
            ]}
            // picker={"week"}
            format="YYYY/MM/DD"
            onChange={onRangeChangeAll}
          />
        </div>
        <Table
          columns={columns}
          dataSource={kioskLogData}
          tableLayout={'auto'}
          scroll={{ x: 550 }}
          rowKey={(record) => record.createdAt}
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
      </div>
      {modalDetailLog.detailKioskLog && (
        <Modal
          title="Chi tiết lịch sử API"
          open={modalDetailLog.isOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
          footer={null}
          className="w-full sm:w-3/6"
          centered={true}
        >
          <div className="flex justify-around items-center  text-base mx-2">
            {' '}
            <Descriptions
              // title={`${t('errorManagement.detail.title')}`}
              className="text-base"
              labelStyle={{ fontSize: '15px' }}
              size={'middle'}
              column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
              items={[
                {
                  key: '1',
                  label: `${t('errorManagement.detail.list.columns.createdAt')}`,

                  children: `${moment(modalDetailLog.detailKioskLog.createdAt).format(
                    'DD/MM/YYYY HH:MM:SS A'
                  )}
                  `,
                },
                {
                  key: '2',
                  label: `${t('errorManagement.detail.list.columns.type')}`,
                  children: `${modalDetailLog.detailKioskLog.type}`,
                },
              ]}
            />
          </div>
          <Space direction="vertical" size={16} className="w-full">
            <Card title="Error Message" className="w-full overflow-auto">
              <p>{modalDetailLog.detailKioskLog.desc}</p>
            </Card>
            <Card title="Thông tin" className="w-full overflow-auto">
              <div className="flex justify-center items-center gap-3 font-semibold">
                <p className="">{t('errorManagement.detail.list.columns.apiUrl')}:</p>
                <p>{modalDetailLog.detailKioskLog.urlAPI}</p>
              </div>

              <pre>
                {JSON.stringify(JSON.parse(modalDetailLog.detailKioskLog?.jsonData), null, 4)}
              </pre>
            </Card>
          </Space>
        </Modal>
      )}
    </>
  );
}
