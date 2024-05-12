import { Col, Flex, List, Row, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { TLogPeripheral } from '../../../../interface';
import { ExternalDevices } from '../../../../Constant/externalDevices';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { toast } from 'react-toastify';
import { showToastErrors } from '../../../../utils/toast_errors';
import ClientApi from '../../../../service/Client.service';
import { MAX_TEMPERTUR, MAX_UPS } from '../../../../utils';

export interface IViewLogPeripheralProps {
  kioskId: string;
  logType: string;
}

export default function ViewLogPeripheral({ kioskId, logType }: IViewLogPeripheralProps) {
  const { t } = useTranslation('lng');
  const [logData, setLogData] = useState<TLogPeripheral[]>();

  const getLogPeripheral = async () => {
    try {
      const response = await ClientApi.getPeripheralLog(kioskId, logType);
      console.log(response.data.data);
      setLogData(response.data.data);
      // toast.success(`${t('kiosk.update.messageSuccess')}`);
    } catch (error: any) {
      console.log('failed to fetch productList', error);
      showToastErrors(error.errors);
    }
  };

  useEffect(() => {
    getLogPeripheral();
  }, []);

  return (
    <div>
      <List
        header={
          <div className="text-lg font-semibold text-center ">
            {t('kiosk.detail.externalInformation.logPeripheral')}
          </div>
        }
        className="h-full scroll-smooth overflow-auto"
        bordered
        pagination={false}
        dataSource={logData}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              className="text-base font-medium"
              title={
                <p>
                  {t(`kiosk.detail.externalInformation.${ExternalDevices(item.idPeripherals)}`)} -{' '}
                  {moment(item.createdAt).format('DD/MM/YYYY HH:mm A')}
                </p>
              }
              description={
                <div>
                  {item.idPeripherals === 'TEM' ? (
                    <p className="text-base font-semibold">
                      {t('kiosk.detail.externalInformation.temperture')}
                      <Tag
                        color={+item.data.tempertureNow >= MAX_TEMPERTUR ? 'error' : 'success'}
                        className="mx-5"
                      >
                        {item.data.tempertureNow} °C
                      </Tag>
                    </p>
                  ) : item.idPeripherals === 'PRI' ? (
                    <div className="w-full text-base font-semibold">
                      <p>
                        {t('kiosk.detail.externalInformation.warningPaper')}
                        <Tag
                          icon={<CheckCircleOutlined />}
                          color={item.data.warningPaper ? 'orange' : 'processing'}
                          className="mx-5"
                        >
                          {item.data.warningPaper
                            ? `  ${t('kiosk.detail.externalInformation.paperEmpty')}`
                            : 'Máy in còn giấy'}
                        </Tag>
                      </p>
                    </div>
                  ) : (
                    <Row gutter={[32, 8]} className="my-4">
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 12 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        xl={{ span: 8 }}
                        xxl={{ span: 8 }}
                        className="gutter-row w-full flex items-center justify-between "
                      >
                        <p className=" font-semibold">
                          {t('kiosk.detail.externalInformation.bateryLevel')}
                        </p>
                        <Tag
                          color={+item.data.bateryLevel <= MAX_UPS ? 'error' : 'success'}
                          className="mx-5"
                        >
                          {item.data.bateryLevel} %
                        </Tag>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 12 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        xl={{ span: 8 }}
                        xxl={{ span: 8 }}
                        className="gutter-row w-full flex items-center justify-between "
                      >
                        <p className=" font-semibold">
                          {t('kiosk.detail.externalInformation.consumedLoad')}
                        </p>
                        <Tag color={'success'} className="mx-5">
                          {item.data.consumedLoad} %
                        </Tag>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 12 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        xl={{ span: 8 }}
                        xxl={{ span: 8 }}
                        className="gutter-row w-full flex items-center justify-between "
                      >
                        <p className=" font-semibold">
                          {t('kiosk.detail.externalInformation.batteryVoltage')}
                        </p>
                        <Tag color={'success'} className="mx-5">
                          {item.data.batteryVoltage} V
                        </Tag>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 12 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        xl={{ span: 8 }}
                        xxl={{ span: 8 }}
                        className="gutter-row w-full flex items-center justify-between "
                      >
                        <p className=" font-semibold">
                          {t('kiosk.detail.externalInformation.inputVoltage')}
                        </p>
                        <Tag
                          color={+item.data.inputVoltage === 0 ? 'error' : 'success'}
                          className="mx-5"
                        >
                          {item.data.inputVoltage} V
                        </Tag>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 12 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        xl={{ span: 8 }}
                        xxl={{ span: 8 }}
                        className="gutter-row w-full flex items-center justify-between "
                      >
                        <p className=" font-semibold">
                          {t('kiosk.detail.externalInformation.outPutVoltage')}
                        </p>
                        <Tag color={'success'} className="mx-5">
                          {item.data.outPutVoltage} V
                        </Tag>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 12 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        xl={{ span: 8 }}
                        xxl={{ span: 8 }}
                        className="gutter-row w-full flex items-center justify-between "
                      >
                        <p className=" font-semibold">
                          {t('kiosk.detail.externalInformation.frequencyOutput')}
                        </p>
                        <Tag color={'success'} className="mx-5">
                          {item.data.frequencyOutput} Hz
                        </Tag>
                      </Col>
                    </Row>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
