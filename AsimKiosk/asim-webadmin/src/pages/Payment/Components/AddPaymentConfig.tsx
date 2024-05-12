import { Button, Form, Input, Modal } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { IFormCreatePaymentConfig, IPaymentConfig } from '../../../interface/IPaymentConfig';
import { toast } from 'react-toastify';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { useDispatch } from 'react-redux';
import { PaymentConfigApi } from '../../../service/PaymentConfig.service';
import { showToastErrors } from '../../../utils/toast_errors';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 24 },
};
type AddPaymentConfigProps = {
  isOpen: boolean;
  onCancel: () => void;
  handleTriggerRerender: () => void;
};
const AddPaymentConfigFormField = [
  {
    label: 'Customer Name',
    name: 'customerName',
  },
  {
    label: 'Customer Email',
    name: 'customerEmail',
  },
  {
    label: 'Customer Mobile',
    name: 'customerMobile',
  },
  {
    label: 'KeySecret',
    name: 'keySecret',
  },
  {
    label: 'MerchantCode',
    name: 'merchantCode',
  },
  {
    label: 'ChannelCode',
    name: 'channelCode',
  },
  {
    label: 'PaymentConfig',
    name: 'paymentConfig',
  },
  {
    label: 'PaymentGateway',
    name: 'paymentGateway',
  },
  {
    label: 'IpnUrl',
    name: 'ipnUrl',
  },
  {
    label: 'redirectUrl',
    name: 'redirectUrl',
  },
  {
    label: 'Shop Id',
    name: 'shopId',
  },
];

const AddPaymentConfig = ({ isOpen, onCancel, handleTriggerRerender }: AddPaymentConfigProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = async (values: IFormCreatePaymentConfig) => {
    try {
      dispatch(setLoading(true));
      const res = await PaymentConfigApi.createPaymentConfig(values);
      dispatch(setLoading(false));
      toast.success('Thêm cấu hình thanh toán thành công');
      form.resetFields();
      onCancel();
      handleTriggerRerender();
    } catch (error) {
      //@ts-ignore
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };

  return (
    <Modal
      title={<h4 className="font-bold text-2xl text-center">{`Thêm cấu hình thanh toán`}</h4>}
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
        {AddPaymentConfigFormField.map((field) => {
          return (
            <Form.Item
              className="font-bold"
              label={field.label}
              name={field.name}
              rules={[{ required: true }]}
            >
              <Input className="font-normal" />
            </Form.Item>
          );
        })}
        <div className="flex justify-end gap-3  items-center">
          <Button
            htmlType="submit"
            className="bg-green-500 hover:bg-green-400 flex items-center px-10 "
            size="large"
            type="primary"
            shape="round"
            icon={<CheckOutlined />}
          >
            Thêm cấu hình
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddPaymentConfig;
