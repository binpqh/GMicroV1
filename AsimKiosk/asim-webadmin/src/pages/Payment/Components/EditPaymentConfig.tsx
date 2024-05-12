import { Button, Form, Input, Modal } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { IFormCreatePaymentConfig, IPaymentConfig } from '../../../interface/IPaymentConfig';
import { toast } from 'react-toastify';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { useDispatch } from 'react-redux';
import { PaymentConfigApi } from '../../../service/PaymentConfig.service';
import { showToastErrors } from '../../../utils/toast_errors';
import { useTranslation } from 'react-i18next';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 24 },
};
type EditPaymentConfigProps = {
  isOpen: boolean;
  onCancel: () => void;

  paymentConfig: IPaymentConfig;
  handleEditPaymentConfig: (id: string, values: IFormCreatePaymentConfig) => void;
};

const EditPaymentConfig = ({
  isOpen,
  onCancel,

  paymentConfig,
  handleEditPaymentConfig,
}: EditPaymentConfigProps) => {
  const [form] = Form.useForm();
  const { t } = useTranslation('lng');
  const dispatch = useDispatch();
  const onFinish = async (values: IFormCreatePaymentConfig) => {
    handleEditPaymentConfig(paymentConfig.id, values);
  };

  return (
    <Modal
      title={<h4 className="font-bold text-2xl text-center">{t('paymentHub.updatePaymentHub')}</h4>}
      open={isOpen}
      centered
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        name="addParterMomo"
        {...formItemLayout}
        layout="horizontal"
        onFinish={onFinish}
        className="w-full font-semibold text-base"
      >
        <Form.Item
          className="font-bold"
          label={'Customer Name'}
          name={'customerName'}
          rules={[{ required: true }]}
          initialValue={paymentConfig.customerName}
        >
          <Input className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Customer email'}
          name={'customerEmail'}
          rules={[{ required: true }]}
          initialValue={paymentConfig.customerEmail}
        >
          <Input className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Customer Mobile'}
          name={'customerMobile'}
          rules={[{ required: true }]}
          initialValue={paymentConfig.customerMobile}
        >
          <Input className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Key Secret'}
          name={'keySecret'}
          rules={[{ required: true }]}
          initialValue={paymentConfig.keySecret}
        >
          <Input.Password className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Merchant Code'}
          name={'merchantCode'}
          rules={[{ required: true }]}
          initialValue={paymentConfig.merchantCode}
        >
          <Input className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Channel Code'}
          name={'channelCode'}
          rules={[{ required: true }]}
          initialValue={paymentConfig.channelCode}
        >
          <Input className="font-normal" />
        </Form.Item>{' '}
        <Form.Item
          className="font-bold"
          label={'Payment Config'}
          name={'paymentConfig'}
          rules={[{ required: true }]}
          initialValue={paymentConfig.urlDomain.paymentConfig}
        >
          <Input className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Payment Gateway'}
          name={'paymentGateway'}
          rules={[{ required: true }]}
          initialValue={paymentConfig.urlDomain.paymentGateway}
        >
          <Input className="font-normal" />
        </Form.Item>{' '}
        <Form.Item
          className="font-bold"
          label={'Ipn Url'}
          name={'ipnUrl'}
          rules={[{ required: true }]}
          initialValue={paymentConfig.ipnUrl}
        >
          <Input className="font-normal" />
        </Form.Item>{' '}
        <Form.Item
          className="font-bold"
          label={'Redirect Url'}
          name={'redirectUrl'}
          rules={[{ required: true }]}
          initialValue={paymentConfig.redirectUrl}
        >
          <Input className="font-normal" />
        </Form.Item>
        <Form.Item
          className="font-bold"
          label={'Shop ID'}
          name={'shopId'}
          rules={[{ required: true }]}
          initialValue={paymentConfig.shopId}
        >
          <Input className="font-normal" />
        </Form.Item>
        <div className="flex justify-end gap-3  items-center">
          <Button
            htmlType="submit"
            className="bg-green-500 hover:bg-green-400 flex items-center px-10 "
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

export default EditPaymentConfig;
