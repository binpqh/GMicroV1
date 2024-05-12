import { Card, Col, Divider, Input, Row, Tag } from 'antd';
import { IPaymentConfig } from '../../../interface/IPaymentConfig';
import { WarningOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { TLocalSimConfig } from '../../../interface/TLocalSimApi';
import { StatusEnumString } from '../../../Constant/Status';
type PaymentProfileProps = {
  LocalSimConfig: TLocalSimConfig;
  type: 'modal' | 'component';
};

export default function LocalSimProfileActive({ LocalSimConfig, type }: PaymentProfileProps) {
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
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">User Name:</div>
        <div className="w-1/2 sm:w-2/3 lgl:w-3/4 break-word  ">{LocalSimConfig.userName}</div>
      </Col>

      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Password:</div>

        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">
          <Input.Password value={LocalSimConfig.password}></Input.Password>
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
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Grant Type:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{LocalSimConfig.grantType}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Client Id:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{LocalSimConfig.clientId}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Client Secret:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{LocalSimConfig.clientSecret}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Scope:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{LocalSimConfig.scope}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Realm:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{LocalSimConfig.realm}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4 font-semibold">Auth Url:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{LocalSimConfig.authUrl}</div>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4  font-semibold">Buss Url:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">{LocalSimConfig.bussUrl}</div>
      </Col>
      {/* <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24 }}
        lg={{ span: 24 }}
        xl={{ span: 24 }}
        className="text-base  items-start flex "
      >
        <div className="w-1/2 sm:w-1/3  lg:w-1/4  font-semibold">Status:</div>
        <div className="w-1/2 sm:w-2/3 lg:w-3/4 break-word  ">
          <Tag
            className="m-0 font-semibold"
            color={
              LocalSimConfig.status.toLocaleLowerCase() ===
              StatusEnumString.Inactive.toLocaleLowerCase()
                ? 'red'
                : 'blue'
            }
            key={'isOnline'}
          >
            {LocalSimConfig.status.toUpperCase()}
          </Tag>
          {}
        </div>
      </Col> */}
    </Row>
  );
  if (type == 'component') {
    return (
      <Card
        className="xl:w-4/5 xl:mx-auto my-5 w-full  break-words"
        title={
          <div className="py-4">
            <h4 className="font-semibold text-base lg:text-3xl text-center">
              {t('localSimApiConfig.localSimApiActive')}
            </h4>
          </div>
        }
        headStyle={{
          textAlign: 'center',
          padding: '0px',
        }}
      >
        {LocalSimConfig.id ? (
          componentContent
        ) : (
          <div className="flex items-center justify-center h-[200px]">
            <div className="flex flex-col items-center  gap-2">
              <WarningOutlined className="text-[35px] text-[#bdc3c7]" />
              <span className="text-[#bdc3c7]"> {t('localSimApiConfig.localSimApiNoNActive')}</span>
            </div>
          </div>
        )}
      </Card>
    );
  }

  return <div className="px-4 py-4">{componentContent}</div>;
}
