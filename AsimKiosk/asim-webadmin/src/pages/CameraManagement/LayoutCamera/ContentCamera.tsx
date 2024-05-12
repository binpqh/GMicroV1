import {
  Card,
  Col,
  DatePicker,
  Divider,
  List,
  Modal,
  Row,
  Tag
} from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../../apps/hooks';
import { TKioskListDropDown } from '../../../interface';
import { TInventory } from '../../../interface/TInventory';

const { confirm } = Modal;

type DataIndex = keyof TInventory;
const twoColors = { '0%': '#108ee9', '100%': '#87d068' };

import type { RangePickerProps } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import { TCamera } from '../../../interface/TCamera';
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf('day');
};

export interface IContentInventoryProps {
  currentKiosk: TKioskListDropDown;
  filter: any;
  total: number;
  cameraList: TCamera[];
  handlePageChange: (page: number, pageSize: number) => void;

  handChangeFilterDays: (dateFrom: string, dateTo: string) => void;
}

export default function ContentInventory({
  currentKiosk,
  cameraList,
  filter,
  total,
  handlePageChange,
  handChangeFilterDays,
}: IContentInventoryProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('lng');

  const onRangeChangeAll = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      // console.log('From: ', dates[0], ', to: ', dates[1]);
      // console.log('All From: ', dateStrings[0], ', to: ', dateStrings[1]);
      handChangeFilterDays(dateStrings[0], dateStrings[1]);
    }
  };

  return (
    <>
      <Card
        className={`xl:mx-auto mb-4 w-full  break-words  ${currentKiosk}`}
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
        {t('cameraManagement.videoList')}
      </Divider>
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
      <List
        className="w-full mt-4 "
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 4,
          xxl: 4,
        }}
        pagination={
          cameraList.length > 0
            ? {
                align: 'center',
                defaultCurrent: 1,
                showSizeChanger: true,
                pageSizeOptions: ['4', '8', '16', '24'],
                onChange: handlePageChange,
                total: total,
                current: filter.page,
                pageSize: filter.pageSize,
              }
            : false
        }
        dataSource={cameraList}
        renderItem={(item) => (
          <List.Item>
            <Card
              className=" xl:mx-auto mb-4 w-full  break-words "
              title={
                <p className=" text-base break-words font-semibold">
                  {moment(item.createdAt).format('DD/MM/YYYY : HH:mm A')}
                </p>
              }
              headStyle={{
                textAlign: 'center',
                padding: '0px',
              }}
            >
              <div className="m-auto aspect-video w-full">
                <ReactPlayer
                  // width="260px"
                  // height="150px"
                  className="w-full"
                  controls
                  url={`${item.videoKey}`}
                />
              </div>
              <div className="flex flex-wrap xl:flex-nowrap items-center justify-between w-full gap-2 md:gap-0  "></div>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
}
