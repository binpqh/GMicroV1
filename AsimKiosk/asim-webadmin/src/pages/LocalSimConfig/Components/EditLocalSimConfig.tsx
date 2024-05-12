import { CheckOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { TFromLocalSimConfig, TLocalSimConfig } from '../../../interface/TLocalSimApi';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};
type EditLocalSimConfigProps = {
  isOpen: boolean;
  onCancel: () => void;

  LocalSimConfig: TLocalSimConfig;
  handleEditLocalSimConfig: (id: string, values: TFromLocalSimConfig) => void;
};

const EditLocalSimConfig = ({
  isOpen,
  onCancel,
  LocalSimConfig,
  handleEditLocalSimConfig,
}: EditLocalSimConfigProps) => {
  const [form] = Form.useForm();
  const { t } = useTranslation('lng');
  const dispatch = useDispatch();
  const onFinish = async (values: TFromLocalSimConfig) => {
    handleEditLocalSimConfig(LocalSimConfig.id, values);
  };

  return (
    <Modal
      title={<h4 className="font-bold text-2xl text-center">{t('paymentHub.updatePaymentHub')}</h4>}
      open={isOpen}
      centered
      onCancel={() => {
        onCancel();
      }}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        name="addLocalSimConfig"
        layout="horizontal"
        {...formItemLayout}
        onFinish={onFinish}
        className="w-full font-semibold text-base"
      >
        <Form.Item
          className="font-bold"
          label={'User Name'}
          name={'userName'}
          rules={[{ required: true }]}
          initialValue={LocalSimConfig.userName}
        >
          <Input className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Password'}
          name={'password'}
          rules={[{ required: true }]}
          initialValue={LocalSimConfig.password}
        >
          <Input.Password className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Grant Type'}
          name={'grantType'}
          rules={[{ required: true }]}
          initialValue={LocalSimConfig.grantType}
        >
          <Input className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Client Id'}
          name={'clientId'}
          rules={[{ required: true }]}
          initialValue={LocalSimConfig.clientId}
        >
          <Input className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Client Secret'}
          name={'clientSecret'}
          rules={[{ required: true }]}
          initialValue={LocalSimConfig.clientSecret}
        >
          <Input className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Scope'}
          name={'scope'}
          rules={[{ required: true }]}
          initialValue={LocalSimConfig.scope}
        >
          <Input className="font-normal" />
        </Form.Item>{' '}
        <Form.Item
          className="font-bold"
          label={'Realm'}
          name={'realm'}
          rules={[{ required: true }]}
          initialValue={LocalSimConfig.realm}
        >
          <Input className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'AuthUrl'}
          name={'authUrl'}
          rules={[{ required: true }]}
          initialValue={LocalSimConfig.authUrl}
        >
          <Input className="font-normal" />
        </Form.Item>{' '}
        <Form.Item
          className="font-bold"
          label={'BussUrl'}
          name={'bussUrl'}
          rules={[{ required: true }]}
          initialValue={LocalSimConfig.bussUrl}
        >
          <Input className="font-normal" />
        </Form.Item>
        <div className="flex justify-end  items-center">
          <Button
            htmlType="submit"
            className="bg-green-500 hover:bg-green-400 flex items-center justify-center px-10 w-full "
            size="large"
            type="primary"
            shape="round"
            icon={<CheckOutlined />}
          >
            Lưu chỉnh sửa
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditLocalSimConfig;
