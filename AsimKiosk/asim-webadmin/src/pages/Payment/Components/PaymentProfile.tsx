import { Card, Col, Divider, Input, Row } from 'antd';
import { IPaymentConfig } from '../../../interface/IPaymentConfig';
import { WarningOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
type PaymentProfileProps = {
  paymentConfig: IPaymentConfig;
  type: 'modal' | 'component';
};

export default function PaymentProfile({ paymentConfig, type }: PaymentProfileProps) {
  const { t } = useTranslation('lng');
  const componentContent = (
    <Row gutter={[16, 16]} justify="space-around" align="middle">
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base items-start flex   "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Customer Name:</div>
        <div className="w-1/2 sm:w-2/3 lgl:w-3/4 break-word  ">{paymentConfig.customerName}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4  font-semibold">Customer Email:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{paymentConfig.customerEmail}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Customer Mobile:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{paymentConfig.customerMobile}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Key Secret:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">
          <Input.Password value={paymentConfig.keySecret}></Input.Password>
        </div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Merchant Code:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{paymentConfig.merchantCode}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Channel Code:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{paymentConfig.channelCode}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Payment Config:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">
          {paymentConfig.urlDomain.paymentConfig}
        </div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Payment Gateway:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">
          {paymentConfig.urlDomain.paymentGateway}
        </div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Ipn Url:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{paymentConfig.ipnUrl}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4  font-semibold">Redirect Url:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{paymentConfig.redirectUrl}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4  font-semibold">Shop ID:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{paymentConfig.shopId}</div>
      </Col>
    </Row>
  );
  if (type == 'component') {
    return (
      <Card
        className="xl:w-4/5 xl:mx-auto my-5 w-full  break-words"
        title={
          <div className="py-4">
            <h4 className="font-semibold text-base lg:text-3xl text-center">
              {t('paymentHub.paymentHubActive')}
            </h4>
          </div>
        }
        headStyle={{
          textAlign: 'center',
          padding: '0px',
        }}
      >
        {paymentConfig.id ? (
          componentContent
        ) : (
          <div className="flex items-center justify-center h-[200px]">
            <div className="flex flex-col items-center  gap-2">
              <WarningOutlined className="text-[35px] text-[#bdc3c7]" />
              <span className="text-[#bdc3c7]"> {t('paymentHub.paymentHubNoNActive')}</span>
            </div>
          </div>
        )}
      </Card>
    );
  }

  return <div className="px-4 py-4">{componentContent}</div>;
}
