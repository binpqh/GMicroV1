import { Space, Table, Tag } from 'antd';

import queryString from 'query-string';
import { memo, useEffect, useState } from 'react';

import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { TClient, IKioskLog } from '../../../../interface/TClient';
import ClientApi from '../../../../service/Client.service';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

export interface LogKiosk {
  kioskId: string;
}

function LogKiosk({ kioskId }: LogKiosk) {
  let [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  dayjs.extend(customParseFormat);
  const dateFormat = 'YYYY/MM/DD';

  const [data, setData] = useState<IKioskLog[]>();
  const [kiosk, setKiosk] = useState<TClient[]>();

  const [pagination, setPagination] = useState<number>(1);
  const [size, setSize] = useState<number>(5);

  const [total, setTotal] = useState<number>();
  const [filter, setFilter] = useState({
    number: pagination,
    size: size,
    to: dayjs().format('YYYY-MM-DD'),
    from: dayjs().format('YYYY-MM-DD'),
  });

  // const handleChangeToDate = (
  //   value: DatePickerProps['value'] | RangePickerProps['value'],
  //   dateString: string
  // ) => {
  //   console.log('dateString', dateString);

  //   setFilter({
  //     ...filter,
  //     to: dateString,
  //   });
  // };
  // const handleChangeFromDate = (
  //   value: DatePickerProps['value'] | RangePickerProps['value'],
  //   dateString: string
  // ) => {
  //   console.log('dateString', dateString);

  //   setFilter({
  //     ...filter,
  //     from: dateString,
  //   });
  // };

  const handlePageChange = (page: number, pageSize: number) => {
    // console.log(page, pageSize);
    setFilter({
      ...filter,
      number: page,
      size: pageSize,
    });

    setSize(pageSize);
    setPagination(size !== pageSize ? 1 : page);
  };

  const params = queryString.stringify(filter);
  async function getKiosLogAsync() {
    try {
      setSearchParams(params);
      const response = await ClientApi.getKioskLog(kioskId, params);
      // console.log(response.data.totalRecords);
      const results = response.data.data.map((row: IKioskLog, index: number) => ({
        ...row,
        key: row.id + index, // Add key props for item
        index: index + 1,
      }));
      setTotal(Number(response.data.totalRecords));
      setData(results);
    } catch (error) {
      console.log('failed to fetch kiosk log', error);
    }
  }

  useEffect(() => {
    getKiosLogAsync();
  }, [filter]);

  const columns: ColumnsType<IKioskLog> = [
    {
      title: 'STT',
      dataIndex: 'index',

      render: (text) => <p className="block font-semibold">{text}</p>,
    },
    {
      title: 'IP',
      dataIndex: 'ip',

      render: (text) => <p className="block font-semibold">{text}</p>,
    },
    {
      title: 'Ngày kết nối',
      dataIndex: 'addedDate',
    },
    {
      title: 'Tình Trạng',
      key: 'isOnline',
      dataIndex: 'isOnline',
      render: (_, { isOnline }) => {
        let color = 'green';
        if (isOnline === false) {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={'isOnline'}>
            {isOnline ? 'Online'.toUpperCase() : 'Offline'.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Ghi Chú',
      dataIndex: 'message',
    },
  ];

  return (
    <Space className=" bg-gray-100 w-full" direction={'vertical'} wrap={true}>
      <div className="flex items-center ">
        <div className=""></div>
        <div className=""></div>
      </div>

      <h2 className="font-bold text-3xl  text-inherit text-center  mb-5">Lịch Sử Kiosk</h2>
      <div className="flex w-3/6 justify-around mb-5">
        <div className="flex items-center">
          <h2 className="mr-2 font-semibold"> Từ ngày :</h2>
          {/* <DatePicker
            defaultValue={dayjs(dayjs(), dateFormat)}
            format={dateFormat}
            // onChange={handleChangeFromDate}
            presets={[
              { label: '7 Ngày Qua', value: dayjs().add(-7, 'd') },
              { label: '14 Ngày Qua', value: dayjs().add(-14, 'd') },
              { label: '30 Ngày Qua', value: dayjs().add(-1, 'month') },
            ]}
            size={'large'}
          /> */}
        </div>
        <div className="flex items-center">
          <h2 className="mr-2 font-semibold"> Đến ngày :</h2>
          {/* <DatePicker
            defaultValue={dayjs(dayjs(), dateFormat)}
            format={dateFormat}
            // onChange={handleChangeToDate}
            size={'large'}
            presets={[
              { label: 'Hôm Nay', value: dayjs().add(0, 'd') },
              { label: '7 Ngày Qua', value: dayjs().add(-7, 'd') },
              { label: '14 Ngày Qua', value: dayjs().add(-14, 'd') },
              { label: '30 Ngày Qua', value: dayjs().add(-1, 'month') },
            ]}
          /> */}
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          onChange: (page, pageSize) => handlePageChange(page, pageSize),
          position: ['bottomCenter'],
          defaultCurrent: 1,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '15', '20'],
          current: pagination,
          pageSize: size,
          total: total,
        }}
      />
    </Space>
  );
}
export default memo(LogKiosk);
