import { CheckOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { IFormCreatePaymentConfig } from '../../../interface/IPaymentConfig';
import { PaymentConfigApi } from '../../../service/PaymentConfig.service';
import { showToastErrors } from '../../../utils/toast_errors';
import { TFromLocalSimConfig } from '../../../interface/TLocalSimApi';
import { LocalSimApi } from '../../../service/LocalSimApi.service';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};
type AddPaymentConfigProps = {
  isOpen: boolean;
  onCancel: () => void;
  handleTriggerRerender: () => void;
};
const AddPaymentConfigFormField = [
  {
    label: 'User Name',
    name: 'userName',
  },
  {
    label: 'Password',
    name: 'password',
  },
  {
    label: 'Grant Type',
    name: 'grantType',
  },
  {
    label: 'Client Id',
    name: 'clientId',
  },
  {
    label: 'Client Secret',
    name: 'clientSecret',
  },
  {
    label: 'Scope',
    name: 'scope',
  },
  {
    label: 'realm',
    name: 'Realm',
  },
  {
    label: 'Auth Url',
    name: 'authUrl',
  },
  {
    label: 'Buss Url',
    name: 'bussUrl',
  },
];

const AddPaymentConfig = ({ isOpen, onCancel, handleTriggerRerender }: AddPaymentConfigProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = async (values: TFromLocalSimConfig) => {
    try {
      dispatch(setLoading(true));
      const res = await LocalSimApi.createLocalSimConfig(values);
      dispatch(setLoading(false));
      toast.success('Thêm cấu hình đấu nối gói sim thành công');
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
              key={field.name}
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
            className="bg-green-500 hover:bg-green-400 flex items-center justify-center w-full px-10 "
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
