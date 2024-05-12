import { CheckCircleOutlined, MinusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Card, Col, DatePicker, List, Modal, Rate, Row, Select, Tag } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

import { formatPrice } from '../../utils';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';

import Table, { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OrderStatusString,
  PaymentMethodColor,
  PaymentStatusString,
} from '../../Constant/ReportStatus';
import { ExternalDevices } from '../../Constant/externalDevices';
import { OrderItems, TResOrderCode } from '../../interface';
import Item from 'antd/es/list/Item';
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf('day');
};
const { RangePicker } = DatePicker;
const { Option } = Select;
export interface IOrderDetailProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  dataDetail: TResOrderCode;
}

function OrderDetail({ isModalOpen = false, handleCloseModal, dataDetail }: IOrderDetailProps) {
  const { t, i18n } = useTranslation('lng');
  const columnsDetail: ColumnsType<OrderItems> = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (productName) => <p>{productName}</p>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'index',
      key: 'index',
      render: (text) => <p>{1}</p>,
    },
    {
      title: 'Thành Tiền',
      key: 'price',
      dataIndex: 'price',
      render: (price) => <p>{formatPrice(price)}</p>,
    },
  ];

  return (
    <Modal
      centered
      title={<h4 className="font-bold text-2xl text-center">{'CHI TIẾT ĐƠN HÀNG'}</h4>}
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
      className="w-[1000px]"
    >
      {dataDetail && (
        <div className="mb-4">
          <div className="text-center ">
            <p className="text-lg font-semibold ">Mã đơn hàng: {dataDetail?.orderCode}</p>
            <p className="text-sm font-medium">Thời gian tạo: {dataDetail?.createdAt}</p>
          </div>

          <Row gutter={[16, 16]} className="my-4">
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
              xxl={{ span: 8 }}
              className="gutter-row w-full flex items-center justify-between"
            >
              <p className=" font-semibold">Tình trạng đơn hàng: </p>
              <Tag
                className="m-0"
                color={
                  dataDetail?.statusOrder === OrderStatusString.Success
                    ? 'success'
                    : dataDetail?.statusOrder === OrderStatusString.Failed
                    ? 'red'
                    : dataDetail?.statusOrder === OrderStatusString.Processing
                    ? 'processing'
                    : 'volcano'
                }
                icon={
                  dataDetail?.statusOrder === OrderStatusString.Success ? (
                    <CheckCircleOutlined />
                  ) : dataDetail?.statusOrder === OrderStatusString.Processing ? (
                    <SyncOutlined spin />
                  ) : (
                    <MinusCircleOutlined />
                  )
                }
                key={'statusOrder'}
              >
                {dataDetail?.statusOrder.toUpperCase()}
              </Tag>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
              xxl={{ span: 8 }}
              className="gutter-row w-full flex items-center justify-between"
            >
              <p className=" font-semibold">Sản Phẩm: </p>
              <p className=" font-semibold">
                {' '}
                {dataDetail.productName} - {dataDetail.itemName} {dataDetail.itemCode}{' '}
              </p>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
              xxl={{ span: 8 }}
              className="gutter-row w-full flex items-center justify-between"
            >
              <p className=" font-semibold">Hình Thức Thanh Toán: </p>

              {(dataDetail?.paymentMethod === '' || dataDetail?.paymentMethod) && (
                <Tag color={PaymentMethodColor(dataDetail?.paymentMethod)} key={'paymentMethod'}>
                  {dataDetail.paymentMethod === ''
                    ? 'POS'
                    : dataDetail?.paymentMethod.toUpperCase()}
                </Tag>
              )}
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
              xxl={{ span: 8 }}
              className="gutter-row w-full flex items-center justify-between"
            >
              <p className=" font-semibold">Trạng thái thanh toán: </p>
              <Tag
                className="m-0"
                color={
                  dataDetail?.paymentStatus === PaymentStatusString.Success
                    ? 'success'
                    : dataDetail?.paymentStatus === PaymentStatusString.Failed
                    ? 'red'
                    : dataDetail?.paymentStatus === PaymentStatusString.Processing
                    ? 'processing'
                    : 'volcano'
                }
                icon={
                  dataDetail?.paymentStatus === PaymentStatusString.Success ? (
                    <CheckCircleOutlined />
                  ) : dataDetail?.paymentStatus === PaymentStatusString.Processing ? (
                    <SyncOutlined spin />
                  ) : (
                    <MinusCircleOutlined />
                  )
                }
                key={'statusOrder'}
              >
                {dataDetail?.paymentStatus.toUpperCase()}
              </Tag>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
              xxl={{ span: 8 }}
              className="gutter-row w-full flex items-center justify-between"
            >
              <p className=" font-semibold">Thời gian thanh toán:</p>
              <p className=" font-semibold">{dataDetail?.paymentDate}</p>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
              xxl={{ span: 8 }}
              className="gutter-row w-full flex items-center justify-between"
            >
              <p className=" font-semibold">Đánh giá:</p>
              <Rate disabled defaultValue={dataDetail.ratingPoint} />
            </Col>
          </Row>
          {dataDetail.orderItems?.length > 0 && (
            <Table
              bordered
              rowKey={(record) => record.index}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell className="text-base font-semibold" index={0}>
                      Summary/ Tổng Tiền
                    </Table.Summary.Cell>
                    <Table.Summary.Cell className="text-base font-semibold" index={1}>
                      {dataDetail.quantity}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell className="text-base font-semibold" index={2}>
                      {formatPrice(dataDetail.totalMountVND)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
              size="small"
              columns={columnsDetail}
              dataSource={dataDetail.orderItems.map((item, index) => ({ ...item, index: index }))}
              pagination={false}
            />
          )}
        </div>
      )}
      {dataDetail?.serialNumber.length > 0 && (
        <Card
          size="small"
          className="w-full mb-4 "
          title={`Mã Serial/Id Thẻ Thành Công`}
          headStyle={{
            textAlign: 'center',
          }}
        >
          {dataDetail?.serialNumber.map((serial, index) => (
            <Tag color="processing" className="font-medium text-sm text-center" key={index}>
              {serial}
            </Tag>
          ))}
        </Card>
      )}
      {dataDetail?.errorSerialNumber.length > 0 && (
        <Card
          size="small"
          className="w-full  mb-4"
          title={`Mã Serial/Id Thẻ Lỗi`}
          headStyle={{
            textAlign: 'center',
          }}
        >
          {dataDetail?.errorSerialNumber.map((serial, index) => (
            <Tag color="error" className="font-medium text-sm text-center" key={index}>
              {serial}
            </Tag>
          ))}
        </Card>
      )}

      {dataDetail?.logProcessOrder && dataDetail?.logProcessOrder.length > 0 && (
        <List
          header={<div className="text-lg font-semibold text-center ">Lịch Sử Tiến Trình </div>}
          className="max-h-64 scroll-smooth overflow-auto"
          bordered
          pagination={false}
          dataSource={dataDetail?.logProcessOrder}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                className="text-base font-medium"
                title={
                  <p>
                    {t(`kiosk.detail.externalInformation.${ExternalDevices(item.extDeviceCode)}`)} -{' '}
                    {moment.utc(item.createdAt).add(7, 'hours').format('DD/MM/YYYY HH:mm A')}
                  </p>
                }
                description={item.message}
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
}
export default memo(OrderDetail);
