import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Col, DatePicker, Row, Select, Table, Tag, TreeSelect } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { ColumnsType } from 'antd/es/table';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import queryString from 'query-string';
import { lazy, useCallback, useEffect, useState } from 'react';
import { TReportFilter, TReportResponse, TResOrderCode } from '../../interface/IReport';
import ReportApi from '../../service/Report.service';
import { formatPrice } from '../../utils';

import type { Dayjs } from 'dayjs';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import {
  OrderStatusList,
  OrderStatusString,
  PaymentMethodColor,
  PaymentMethodList,
  PaymentStatusString,
} from '../../Constant/ReportStatus';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../apps/hooks';
import { showToastErrors } from '../../utils/toast_errors';
import SelectTree from '../../Components/SelectTree';
const OrderDetail = lazy(() => import('../../Components/OrderDetail'));
const SearchInput = lazy(() => import('../../Components/searchDetail/index1'));
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf('day');
};
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ReportPage() {
  const { t, i18n } = useTranslation('lng');
  const dispatch = useAppDispatch();
  const [reportData, setReportData] = useState<TReportResponse[]>();
  const [dataDetail, setDataDetail] = useState<TResOrderCode>();
  const [filter, setFilter] = useState<TReportFilter>({
    From: dayjs().format('YYYY-MM-DD'),
    To: dayjs().format('YYYY-MM-DD'),
    page: 1,
    pageSize: 10,
    PaymentMethod: 'All',
    OrderStatus: 3,
    itemCode: [],
    deviceIds: [],
  });
  const [total, setToTal] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, SetAmount] = useState(0);

  const onRangeChangeAll = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      // console.log('From: ', dates[0], ', to: ', dates[1]);
      console.log('All From: ', dateStrings[0], ', to: ', dateStrings[1]);
      setFilter({
        ...filter,
        page: 1,
        From: dateStrings[0],
        To: dateStrings[1],
      });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handlePageChange = (page: number, pageSize: number) => {
    // console.log(page, pageSize);
    setFilter({
      ...filter,
      page: page,
      pageSize: pageSize,
    });
  };

  const handleSelectChange = (value: string | number, Option: 'PaymentMethod' | 'OrderStatus') => {
    console.log('handleSelectChange', value);
    Option === 'PaymentMethod' &&
      setFilter({
        ...filter,
        page: 1,
        PaymentMethod: value.toString(),
      });
    Option === 'OrderStatus' &&
      setFilter({
        ...filter,
        page: 1,
        OrderStatus: +value,
      });
  };

  const handleSelectTreeChange = (
    value: string[] | [],
    Option: 'ProductItemList' | 'GroupKioskList'
  ) => {
    console.log('handleSelectChange', value);
    Option === 'ProductItemList' &&
      setFilter({
        ...filter,
        page: 1,
        itemCode: value,
      });
    Option === 'GroupKioskList' &&
      setFilter({
        ...filter,
        page: 1,
        deviceIds: value,
      });
  };

  const takeResBookingById = async (orderCode: string) => {
    try {
      dispatch(setLoading(true));
      const response = await ReportApi.getDetailOrder(orderCode);
      console.log(response.data.data);
      setDataDetail(response.data.data);
      showModal();
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));
      showToastErrors(error.errors);
      console.log('failed to fetch sort report', error);
    }
    // setDataDetail(valueRes);
  };

  async function getSortReport() {
    try {
      dispatch(setLoading(true));

      const response = await ReportApi.getReport(filter);
      console.log(response.data.data.reports.items);
      setReportData(response.data.data.reports.items);
      // console.log("rs", response);
      setToTal(response.data.data.reports.totalCount);
      SetAmount(response.data.data.totalPrice);
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));
      showToastErrors(error.errors);
      console.log('failed to fetch sort report', error);
    }
  }
  useEffect(() => {
    getSortReport();
  }, [
    filter.From,
    filter.To,
    filter.OrderStatus,
    filter.PaymentMethod,
    filter.page,
    filter.pageSize,
    filter.deviceIds,
    filter.itemCode,
  ]);

  const columns: ColumnsType<TReportResponse> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      ellipsis: true,

      key: 'orderCode',
    },
    {
      title: 'Sản Phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'statusOrder',

      render: (_, { statusOrder }) => {
        return (
          <Tag
            className="m-0"
            color={
              statusOrder === OrderStatusString.Success
                ? 'success'
                : statusOrder === OrderStatusString.Failed
                ? 'red'
                : statusOrder === OrderStatusString.Processing
                ? 'processing'
                : 'volcano'
            }
            icon={
              statusOrder === OrderStatusString.Success ? (
                <CheckCircleOutlined />
              ) : statusOrder === OrderStatusString.Processing ? (
                <SyncOutlined spin />
              ) : (
                <MinusCircleOutlined />
              )
            }
            key={'statusOrder'}
          >
            {statusOrder.toUpperCase()}
          </Tag>
        );
      },
    },

    {
      title: 'Thời gian',
      dataIndex: 'createAtUTC',
      key: 'createAtUTC',
      render: (createAtUTC) => (
        <p>{moment.utc(createAtUTC).add(7, 'hours').format('DD/MM/YYYY HH:mm A')}</p>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: '8%',
      key: 'quantity',
      render: (quantity) => <p className="w-10">{quantity}</p>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <p>{formatPrice(price)}</p>,
    },
    {
      title: 'Hình thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: '8%',
      render: (_, { paymentMethod }) => {
        return (
          <Tag color={PaymentMethodColor(paymentMethod)} key={'paymentMethod'}>
            {paymentMethod ? paymentMethod.toUpperCase() : 'POS'}
          </Tag>
        );
      },
    },
    {
      title: 'Tình trạng thanh toán',
      dataIndex: 'paymentStatus',
      render: (_, { paymentStatus }) => {
        return (
          <Tag
            className="m-0"
            color={
              paymentStatus === PaymentStatusString.Success
                ? 'success'
                : paymentStatus === PaymentStatusString.Failed
                ? 'red'
                : paymentStatus === PaymentStatusString.Processing
                ? 'processing'
                : 'volcano'
            }
            icon={
              paymentStatus === PaymentStatusString.Success ? (
                <CheckCircleOutlined />
              ) : paymentStatus === PaymentStatusString.Processing ? (
                <SyncOutlined spin />
              ) : (
                <MinusCircleOutlined />
              )
            }
            key={'paymentStatus'}
          >
            {paymentStatus.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Chi tiết đơn hàng',
      width: '7%',
      fixed: 'right',
      dataIndex: 'statusString',
      render: (_, item) => {
        return (
          <Button
            className="bg-cyan-500 hover:bg-cyan-600   flex items-center  "
            size="middle"
            type="primary"
            shape="round"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              takeResBookingById(item.orderCode);
            }}
          ></Button>
        );
      },
    },
  ];

  //  Xuat Excel
  // const [month, setMonth] = useState(new Date().getMonth() + 1);
  // const [year, setYear] = useState(new Date().getFullYear());
  // const handleExport = () => {
  //   Swal.fire({
  //     title: 'Xác nhận xuất excel báo cáo đơn hàng',
  //     icon: 'warning',
  //     cancelButtonText: 'Hủy',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Xác nhận',
  //   }).then(async (result: any) => {
  //     if (result.isConfirmed) {
  //       exportExcel();
  //     }
  //   });
  //   const exportExcel = () => {
  //     const totalList: {
  //       index: number;
  //       id: number;
  //       excel: {
  //         col: number;
  //         row: number;
  //       };
  //       value: CellValue;
  //     }[] = [];
  //     let workbook = new Workbook();
  //     let worksheet = workbook.addWorksheet(
  //       'T' + month + '-' + 'N' + year + '-',
  //       {
  //         views: [{ state: 'frozen', ySplit: 6, xSplit: 3 }],
  //       }
  //     );
  //     workbook.calcProperties.fullCalcOnLoad = true;

  //     worksheet.getCell('A1').value = 'CÔNG TY CỔ PHẦN DỊCH VỤ TÂY YÊN TỬ';
  //     worksheet.getCell('A1').font = { bold: true, size: 20 };
  //     worksheet.mergeCells('A1:F1');
  //     worksheet.getCell('A1').alignment = {
  //       vertical: 'middle',
  //       horizontal: 'center',
  //       wrapText: true,
  //     };
  //     worksheet.getCell('A2').value = 'BÁO CÁO ĐƠN HÀNG';
  //     worksheet.getCell('A2').font = { bold: true, size: 20 };
  //     worksheet.mergeCells('A2:F2');
  //     worksheet.getCell('A2').alignment = {
  //       vertical: 'middle',
  //       horizontal: 'center',
  //       wrapText: true,
  //     };
  //     worksheet.getCell('A3').value = 'Ghi chú';
  //     worksheet.getCell('A3').font = { bold: true, size: 13 };
  //     worksheet.getCell('A3').alignment = {
  //       vertical: 'middle',
  //       horizontal: 'center',
  //       wrapText: true,
  //     };
  //     worksheet.getCell('A4').value = 'CASH: Tiền mặt';
  //     worksheet.getCell('B4').value = 'VNPAY: VNPAY';
  //     worksheet.getCell('C4').value = 'MOMO: MOMO';
  //     worksheet.getCell('D4').value = 'SACOMPOS: SACOMPOS';

  //     worksheet.getCell('A5').value = 'Processing: Đang xử lý';
  //     worksheet.getCell('A5').alignment = {
  //       vertical: 'middle',
  //       horizontal: 'center',
  //       wrapText: true,
  //     };
  //     worksheet.getCell('B5').value = 'Success: Thành công';
  //     worksheet.getCell('C5').value = 'Fail: Thất bại';

  //     worksheet.columns = [
  //       { width: 30, style: { font: { size: 10, bold: true } } }, // 1
  //       { width: 20 }, // 2
  //       { width: 20 }, // 3
  //       { width: 30 }, // 4
  //       { width: 16 }, // 5
  //       { width: 20 }, // 6
  //     ];

  //     const headers = [
  //       {
  //         id: 99,
  //         name: 'STT',
  //         check: true,
  //       },
  //       {
  //         id: 0,
  //         name: 'Mã đơn hàng',
  //         check: true,
  //       },
  //       {
  //         id: 1,
  //         name: 'Hình thức thanh toán',
  //         check: true,
  //       },
  //       {
  //         id: 2,
  //         name: 'Thời gian tạo',
  //         check: true,
  //       },
  //       {
  //         id: 3,
  //         name: 'Tổng tiền',
  //         check: true,
  //       },
  //       {
  //         id: 4,
  //         name: 'Tình trạng đơn hàng',
  //         check: true,
  //       },
  //     ];
  //     let baseColAllowance = 2;
  //     let baseRow = 7;
  //     // bùa chúa
  //     headers.map((item: any, index: number) => {
  //       worksheet.getCell(baseRow, index + 1).value = item.name;
  //       // worksheet.mergeCells('A4:H4');
  //       worksheet.getCell(baseRow, index + 1).font = {
  //         bold: true,
  //       };
  //     });

  //     // export
  //     let index = 0;
  //     let baseColAl = 19;
  //     for (let i = 0; i < headers.length; i++) {
  //       worksheet.getCell(baseRow + 1, i + 1).value = i + 1;
  //     }
  //     let baseCol = 2;
  //     baseRow = baseRow + 2;

  //     dataExcel.map((item: IPayment, index: number) => {
  //       let getRow = baseRow;

  //       // console.log(item);
  //       {
  //         let counterRow = getRow + index;
  //         // console.log(counterRow);
  //         let dataCol = 3;
  //         worksheet.getCell(counterRow, 1).value = index + 1;
  //         worksheet.getCell(counterRow, 2).value = `${item.bookingId}`;
  //         worksheet.getCell(counterRow, 3).value = `${item.methodsString}`;
  //         worksheet.getCell(counterRow, ++dataCol).value = `${dayjs(
  //           item.createdAtString
  //         ).format('DD/MM/YYYY h:mm:ss')}`;
  //         worksheet.getCell(counterRow, ++dataCol).value = `${formatPrice(
  //           item.amount
  //         )}`;
  //         worksheet.getCell(counterRow, ++dataCol).value = item.statusString;
  //       }
  //     });
  //     const lastRow = dataExcel.length + 6 + 3;
  //     worksheet.getCell(`D${lastRow}`).value = 'Tổng doanh thu:';
  //     worksheet.getCell(`E${lastRow}`).value = `${formatPrice(amount)}`;
  //     worksheet.eachRow(function (row, rowNumber) {
  //       // console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
  //       row.eachCell(function (cell, colNumber) {
  //         // console.log("Cell " + colNumber + " = " + cell.value);
  //         if (rowNumber > 5) {
  //           row.getCell(colNumber).border = {
  //             top: { style: 'thin' },
  //             left: { style: 'thin' },
  //             bottom: { style: 'thin' },
  //             right: { style: 'thin' },
  //           };

  //           if (colNumber != 9) {
  //             row.getCell(colNumber).alignment = {
  //               vertical: 'middle',
  //               horizontal: 'center',
  //               wrapText: true,
  //             };
  //             row.height = 16;

  //             if (rowNumber === 6) {
  //               row.getCell(colNumber).alignment = {
  //                 vertical: 'middle',
  //                 horizontal: 'center',
  //                 wrapText: true,
  //               };
  //               row.height = 50;
  //               row.font = { bold: true };
  //             }
  //           }
  //           if (colNumber === 3) {
  //             if (rowNumber === 6) {
  //               row.getCell(colNumber).alignment = {
  //                 vertical: 'middle',
  //                 horizontal: 'center',
  //                 wrapText: true,
  //               };
  //               row.height = 50;
  //               row.font = { bold: true };
  //             }
  //             if (rowNumber === 7) {
  //               row.getCell(colNumber).alignment = {
  //                 vertical: 'middle',
  //                 horizontal: 'center',
  //                 wrapText: true,
  //               };
  //             }
  //           }

  //           if (rowNumber === 4) {
  //             row.getCell(colNumber).alignment = {
  //               vertical: 'middle',
  //               horizontal: 'center',
  //               wrapText: true,
  //             };
  //             row.height = 50;
  //             row.font = { bold: true, size: 26 };
  //           }
  //         }
  //       });
  //     });

  //     worksheet.getCell('A1').alignment = {
  //       vertical: 'middle',
  //       horizontal: 'center',
  //       wrapText: true,
  //     };

  //     worksheet.getCell('A2').alignment = {
  //       vertical: 'middle',
  //       horizontal: 'center',
  //       wrapText: true,
  //     };

  //     worksheet.getCell('A4').alignment = {
  //       vertical: 'middle',
  //       horizontal: 'center',
  //       wrapText: true,
  //     };

  //     workbook.xlsx.writeBuffer().then((data) => {
  //       let blob = new Blob([data], {
  //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //       });
  //       fs.saveAs(
  //         blob,
  //         'BaoCaoDonHang' + 'T' + month + '-' + 'N' + year + '.xlsx'
  //       );
  //     });
  //   };
  // };
  return (
    <div>
      <Row gutter={[16, 8]}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 12 }}
          lg={{ span: 6 }}
          xl={{ span: 6 }}
          xxl={{ span: 6 }}
          className="gutter-row w-full"
        >
          <p className="mb-2 font-semibold">Chọn ngày: </p>
          <RangePicker
            className="w-full"
            size="large"
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
        </Col>

        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 12 }}
          lg={{ span: 4 }}
          xl={{ span: 4 }}
          className="gutter-row w-full"
        >
          <p className="mb-2 font-semibold">Trạng thái đơn hàng:</p>

          <Select
            placeholder={`${t('maintenance.detail.ChoseUser')}`}
            virtual={false}
            size="large"
            className="  w-full"
            showSearch
            defaultValue={3}
            optionFilterProp="children"
            onChange={(value) => handleSelectChange(value, 'OrderStatus')}
          >
            {OrderStatusList?.map((payment) => (
              <Option key={payment.id} value={payment.id}>
                {i18n.language === 'vi' ? payment.viName : payment.enName}
              </Option>
            ))}
          </Select>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 12 }}
          lg={{ span: 4 }}
          xl={{ span: 4 }}
          className="gutter-row w-full"
        >
          <p className="mb-2 font-semibold">Hình thức thanh toán: </p>
          <Select
            placeholder={`${t('maintenance.detail.ChoseUser')}`}
            virtual={false}
            size="large"
            className="  w-full"
            showSearch
            defaultValue="All"
            optionFilterProp="children"
            onChange={(value) => handleSelectChange(value, 'PaymentMethod')}
          >
            {PaymentMethodList?.map((payment) => (
              <Option key={payment.id} value={payment.id}>
                {i18n.language === 'vi' ? payment.viName : payment.enName}
              </Option>
            ))}
          </Select>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 12 }}
          lg={{ span: 10 }}
          xl={{ span: 10 }}
          className="gutter-row w-full"
        >
          {' '}
          <p className="mb-2 font-semibold">Tìm kiếm đơn hàng: </p>
          {/* numberGet === 0 to get All search */}
          <SearchInput numberGet={0} placeholder={`Nhập mã đơn hàng`} />
        </Col>

        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
          className="gutter-row w-full"
        >
          <p className="mb-2 font-semibold">Chọn Group kiosk hoặc kiosk: </p>
          <SelectTree
            treeType={'GroupKioskList'}
            placeholder="Please select"
            handleFilter={(value) => handleSelectTreeChange(value, 'GroupKioskList')}
          />
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
          className="gutter-row w-full"
        >
          <p className="mb-2 font-semibold">Chọn Sản Phẩm: </p>
          <SelectTree
            treeType={'ProductItemList'}
            placeholder="Please select"
            handleFilter={(value) => handleSelectTreeChange(value, 'ProductItemList')}
          />
        </Col>
      </Row>

      <div>
        <h1 className="font-semibold text-xl sm:text-4xl text-inherit text-center mt-6">
          BẢNG BÁO CÁO ĐƠN HÀNG
        </h1>
        <div>
          <h2 className="font-semibold text-xl mb-4 pt-2 text-inherit text-center">
            Tổng doanh thu: {formatPrice(amount)}
          </h2>
        </div>

        <Table
          columns={columns}
          rowKey={(record) => record.orderCode}
          dataSource={reportData}
          pagination={{
            onChange: (page, pageSize) => handlePageChange(page, pageSize),
            position: ['bottomCenter'],
            defaultCurrent: 2,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            current: filter.page,
            pageSize: filter.pageSize,
            total: total,
          }}
          tableLayout={'auto'}
          scroll={{ x: 450 }}
          // antd site header height
          sticky={{ offsetHeader: 64 }}
        />
      </div>
      {dataDetail && (
        <OrderDetail
          key={dataDetail.orderCode}
          isModalOpen={isModalOpen}
          dataDetail={dataDetail}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
}
