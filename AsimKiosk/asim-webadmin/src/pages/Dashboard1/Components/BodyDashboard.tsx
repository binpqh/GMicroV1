import { DollarCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Card, Col, DatePicker, Radio, Row } from 'antd';
import ReactApexChart from 'react-apexcharts';

import type { RangePickerProps } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';

import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../../apps/hooks';

import { IChartAll, IChartArray, IChartLine, IMethod } from '../../../interface';
import ChartsAPI from '../../../service/Charts.service';

import { formatPrice } from '../../../utils';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const rangePresets: {
  label: string;
  value: [Dayjs, Dayjs];
}[] = [
  { label: '7 Ngày Trước', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '14 Ngày Trước', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '30 Ngày Trước', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '90 Ngày Trước', value: [dayjs().add(-90, 'd'), dayjs()] },
];
export interface BodyDashboardProps {}
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf('day');
};
let isBoolean = true;

export default function BodyDashboard(props: BodyDashboardProps) {
  const dispatch = useAppDispatch();

  const [isCheck, setIsCheck] = useState<Boolean>(true);
  const [dataChartAll, setDataChartAll] = useState<IChartAll>();
  const [dataChartDays, setDataChartDays] = useState<IChartArray>({
    days: [],
    ticket: [],
    cash: [],
    pos: [],
    momo: [],
    vnpay: [],
  });

  const [paramChartDays, setParamChartDays] = useState({
    from: dayjs().add(-7, 'd').format('YYYY-MM-DD'),
    to: dayjs().format('YYYY-MM-DD'),
  });
  const [paramChartAll, setParamChartAll] = useState({
    from: dayjs().format('YYYY-MM-DD'),
    to: dayjs().format('YYYY-MM-DD'),
  });

  const getDataChartAll = async () => {
    const params = queryString.stringify(paramChartAll);

    // try {
    //   dispatch(setLoading(true));
    //   const response = await ChartsAPI.getChartAll(params);

    //   const { totalTicket, totalRevenue } = response.data;

    //   let ticketChartAll: number[] = response.data.method.reduce(
    //     (Total: number[], item: IMethod) => {
    //       item.methods === "CASH" && Total.push(item.ticket ?? 0);
    //       item.methods === "MOMO" && Total.push(item.ticket ?? 0);
    //       item.methods === "VNPAY" && Total.push(item.ticket ?? 0);
    //       item.methods === "SACOMPOS" && Total.push(item.ticket ?? 0);
    //       return Total;
    //     },
    //     []
    //   );
    //   let revenueChartAll: number[] = response.data.method.reduce(
    //     (Total: number[], item: IMethod) => {
    //       item.methods === "CASH" && Total.push(item.revenue ?? 0);
    //       item.methods === "MOMO" && Total.push(item.revenue ?? 0);
    //       item.methods === "VNPAY" && Total.push(item.revenue ?? 0);
    //       item.methods === "SACOMPOS" && Total.push(item.revenue ?? 0);
    //       return Total;
    //     },
    //     []
    //   );
    //   let methodsChartAll: string[] = response.data.method.reduce(
    //     (Total: string[], item: IMethod) => {
    //       item.methods === "CASH" && Total.push("TIỀN MẶT");
    //       item.methods === "MOMO" && Total.push("MOMO");
    //       item.methods === "VNPAY" && Total.push("VNPAY");
    //       item.methods === "SACOMPOS" && Total.push("SACOMPOS");
    //       return Total;
    //     },
    //     []
    //   );
    //   setDataChartAll({
    //     methodsChartAll,
    //     totalTicket,
    //     totalRevenue,
    //     ticketChartAll,
    //     revenueChartAll,
    //   });

    //   dispatch(setLoading(false));
    // } catch (error) {
    //   dispatch(setLoading(false));
    //   toast.error(`${error}`);
    // }
  };
  const getDataChartDays = async () => {
    const params = queryString.stringify(paramChartDays);
    try {
      dispatch(setLoading(true));
      const response = await ChartsAPI.getChartDays(params);
      // console.log(response.data.days);
      let result: IChartArray = {
        days: [],
        cash: [],
        ticket: [],
        momo: [],
        vnpay: [],
        pos: [],
      };
      response.data.days.map((item: IChartLine) => {
        result.days.push(item.date);
        result.cash.push(item.cash);
        result.ticket.push(item.ticket);
        result.momo.push(item.momo);
        result.pos.push(item.pos);
        result.vnpay.push(item.vnpay);
      });
      // console.log(result)
      setDataChartDays(result);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    // getDataChartDays();
  }, [paramChartDays]);

  useEffect(() => {
    // getDataChartAll();
  }, [paramChartAll]);

  const onRangeChangeAll = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      // console.log("From: ", dates[0], ", to: ", dates[1]);
      // console.log("All From: ", dateStrings[0], ", to: ", dateStrings[1]);
      setParamChartAll({ from: dateStrings[0], to: dateStrings[1] });
    }
  };

  const onRangeChangeDays = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      // console.log("From: ", dates[0], ", to: ", dates[1]);
      // console.log("Days From: ", dateStrings[0], ", to: ", dateStrings[1]);
      setParamChartDays({ from: dateStrings[0], to: dateStrings[1] });
    }
  };

  const data: any = {
    series: isCheck ? dataChartAll?.revenueChartAll ?? [] : dataChartAll?.ticketChartAll ?? [],
    options: {
      colors: ['#27c2ed', '#35bc78', '#fa3eb2', '#f63e44', '#0582fe'],
      tooltip: {
        shared: true,
        intersect: false,

        y: {
          formatter: function (y: any) {
            if (typeof y !== 'undefined') {
              const result = isBoolean ? formatPrice(y.toFixed(0)) : y.toFixed(0) + ' Vé';
              return result;
            }
            return y;
          },
        },
      },
      chart: {
        width: '100%',
        height: 'auto',
        type: 'pie',

        fontFamily: 'Montserrat, Inter, Avenir, Helvetica , Arial, sans-serif',
        // background: "#ac4545",
      },
      legend: {
        position: 'bottom',
      },
      labels: dataChartAll?.methodsChartAll ?? [],
      plotOptions: {
        pie: {},
      },
      dataLabels: {
        enabled: true,
      },
      fill: {
        type: 'gradient',
      },

      responsive: [
        {
          breakpoint: 576,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
        {
          breakpoint: 768,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  };

  const dataLine: any = {
    series: [
      {
        name: 'Tổng Vé',
        type: 'column',
        data: dataChartDays?.ticket ?? [],
      },
      {
        name: 'Tiền Mặt',
        type: 'line',
        data: dataChartDays?.cash ?? [],
      },
      {
        name: 'MOMO',
        type: 'line',
        data: dataChartDays?.momo ?? [],
      },
      {
        name: 'VNPAY',
        type: 'line',
        data: dataChartDays?.vnpay ?? [],
      },
      {
        name: 'SACOMPOS',
        type: 'line',
        data: dataChartDays?.pos || [],
      },
    ],
    options: {
      colors: ['#6ecfea', '#35bc78', '#fa3eb2', '#f63e44', '#0582fe'],
      chart: {
        zoom: {
          enabled: false,
        },
        width: '100%',
        height: '100%',
        type: 'line',
        stacked: false,
        fontFamily: 'Montserrat, Inter, Avenir, Helvetica , Arial, sans-serif',
        locales: [
          {
            name: 'vi',
            options: {
              months: [
                'Tháng 1',
                'Tháng 2',
                'Tháng 3',
                'Tháng 4',
                'Tháng 5',
                'Tháng 6',
                'Tháng 7',
                'Tháng 8',
                'Tháng 9',
                'Tháng 10',
                'Tháng 11',
                'Tháng 12',
              ],
              shortMonths: [
                'Tháng 1',
                'Tháng 2',
                'Tháng 3',
                'Tháng 4',
                'Tháng 5',
                'Tháng 6',
                'Tháng 7',
                'Tháng 8',
                'Tháng 9',
                'Tháng 10',
                'Tháng 11',
                'Tháng 12',
              ],
              days: [
                'Chủ Nhật',
                'Thứ Hai',
                'Thứ Ba',
                'Thứ Tư',
                'Thứ Năm',
                'Tháng Sáu',
                'Tháng Bảy',
              ],
              shortDays: ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'],
              toolbar: {
                exportToSVG: 'Tải xuống SVG',
                exportToPNG: 'Tải xuống PNG',
                exportToCSV: 'Tải xuống CSV',
              },
            },
          },
        ],
        defaultLocale: 'vi',
      },

      stroke: {
        width: [1, 3, 3, 3, 3],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },

      fill: {
        opacity: [0.5, 1, 1, 1, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: dataChartDays?.days || [''],
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
        shared: false,

        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: "MMM 'yy",
            day: 'dd MMM',
            hour: 'HH:mm',
          },
        },
      },

      yaxis: [
        {
          seriesName: 'Tổng Vé',
          axisTicks: {
            show: true,
          },

          title: {
            text: 'Tổng Vé',
            style: {
              color: '#008eb6',
            },
          },
          labels: {
            style: {
              colors: '#008eb6',
              fontSize: '13px',
              fontWeight: 500,
            },
          },
          min: 0,
          max: Math.max(...dataChartDays?.ticket) * 1.2,
        },
        {
          opposite: true,
          seriesName: 'Tiền Mặt',
          title: {
            text: 'Tổng Tiền',
          },
          labels: {
            show: true,
            style: {
              fontSize: '13px',
              fontWeight: 500,
            },
            formatter: (value: any) => {
              return formatPrice(value);
            },
          },
          min: 0,
          max:
            Math.max(
              ...dataChartDays?.momo,
              ...dataChartDays?.pos,
              ...dataChartDays?.cash,
              ...dataChartDays?.vnpay
            ) * 1.2,
        },
        {
          seriesName: 'Tiền Mặt',
          show: false,
        },
        {
          seriesName: 'Tiền Mặt',
          show: false,
        },
        {
          seriesName: 'Tiền Mặt',
          show: false,
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y: any, { series, seriesIndex, dataPointIndex, w }: any) {
            // console.log("series", series);
            // console.log("seriesIndex", seriesIndex);

            // console.log("y", y);

            if (typeof y !== 'undefined' && seriesIndex !== 0) {
              return formatPrice(y.toFixed(0));
            }
            return y + ' Vé';
          },
        },
      },
    },
  };
  const onChange = () => {
    isBoolean = !isBoolean;
    setIsCheck(!isCheck);
    //Check DoanhSố or Vé for tooltip chart pie
  };
  return (
    <div
      // align="middle"
      className=" mt-5 gap-2 flex sm:gap-4  md:gap-5 flex-wrap xl:flex-nowrap items-stretch"
    >
      <div className=" flex flex-col gap-2 sm:gap-4  md:gap-5 w-full xl:w-2/5 h-full">
        <div className="flex gap-2 sm:gap-4 w-full md:gap-5 h-2/6">
          <Card className="w-3/6 ">
            <div className="w-full ">
              <div className="flex justify-around items-center gap-3">
                <h4 className="text-lg lg:text-xl  xl:text-lg 2xl:text-xl text-[#afb3bb] font-[500]">
                  Doanh Thu
                </h4>
                <DollarCircleOutlined className=" text-lg lg:text-xl  xl:text-2xl  p-3 rounded-lg text-green-500 bg-green-100" />
              </div>
              <div className="text-lg lg:text-xl  xl:text-2xl font-bold  text-center">
                {formatPrice(dataChartAll?.totalRevenue || 0)}
              </div>
            </div>
          </Card>
          <Card className="w-3/6 ">
            <div className="w-full ">
              <div className="flex justify-around items-center gap-10">
                <h4 className="text-lg lg:text-xl  xl:text-lg 2xl:text-xl text-[#afb3bb] font-[500]">
                  Tổng Vé
                </h4>
                <TagsOutlined className="text-lg lg:text-xl  xl:text-2xl  p-3 rounded-lg text-green-500 bg-green-100" />
              </div>
              <div className="text-lg lg:text-xl  xl:text-2xl font-bold  text-center ">
                {dataChartAll?.totalTicket ?? 0} Vé
              </div>
            </div>
          </Card>
        </div>
        <Card
          className="w-full h-4/6 bg-white  "
          bodyStyle={{ padding: '0px' }}
          title={
            <div className=" flex   my-3 lg:my-0  justify-center lg:justify-between lg:flex-nowrap items-center flex-wrap gap-2 ">
              <h3
                className="m-0 font-semibold w-full  lg:w-2/6 text-lg lg:text-xl  xl:text-lg 2xl:text-xl text-center
              lg:text-left "
              >
                {isCheck ? 'Doanh Thu' : 'Tổng Vé'}
              </h3>
              <RangePicker
                className=""
                disabledDate={disabledDate}
                defaultValue={[dayjs(dayjs(), 'YYYY/MM/DD'), dayjs(dayjs(), 'YYYY/MM/DD')]}
                presets={[
                  { label: 'Hôm Nay', value: [dayjs().add(0, 'd'), dayjs()] },
                  ...rangePresets,
                ]}
                // showTime
                // picker={"week"}
                format="YYYY/MM/DD"
                onChange={onRangeChangeAll}
              />
            </div>
          }
        >
          <ReactApexChart
            options={data.options}
            series={data.series}
            type="pie"
            height="auto"
            className="m-auto xl:max-w-[90%] 2xl:max-w-[96%] "
          />
          <Radio.Group
            onChange={onChange}
            defaultValue="true"
            size="middle"
            className="flex justify-center m-3 "
          >
            <Radio.Button
              value="true"
              className="px-5 min-w-[30%] text-center text-[16px] font-[500] "
            >
              Doanh Thu
            </Radio.Button>
            <Radio.Button
              value="false"
              className="px-5 min-w-[30%] text-center text-[16px] font-[500] "
            >
              Tổng Vé
            </Radio.Button>
          </Radio.Group>
        </Card>
      </div>
      <div className="w-full xl:w-4/6 h-full">
        <Card
          className=" bg-white "
          bodyStyle={{ padding: '0px', margin: '10px 0px' }}
          title={
            <div className=" flex   my-3 lg:my-0  justify-center lg:justify-between lg:flex-nowrap items-center flex-wrap gap-2 ">
              <h3 className="m-0 font-semibold w-full  lg:w-2/6 text-lg lg:text-xl  xl:text-lg 2xl:text-xl text-center lg:text-left ">
                Thống Kê
              </h3>
              <RangePicker
                disabledDate={disabledDate}
                className="w-4/6 text-base  xl:text-lg 2xl:text-xl"
                defaultValue={[
                  dayjs(dayjs(), 'YYYY/MM/DD'),
                  dayjs(dayjs().add(-7, 'd'), 'YYYY/MM/DD'),
                ]}
                presets={rangePresets}
                format="YYYY/MM/DD"
                onChange={onRangeChangeDays}
              />
            </div>
          }
        >
          <ReactApexChart
            options={dataLine.options}
            series={dataLine.series}
            type="line"
            height="auto"
            className="mx-0 my-auto "
          />
        </Card>
      </div>
    </div>
  );
}
