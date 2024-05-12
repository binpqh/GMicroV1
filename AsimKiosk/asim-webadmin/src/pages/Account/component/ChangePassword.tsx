import { CheckOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { showToastErrors } from '../../../utils/toast_errors';
import { useAppDispatch } from '../../../apps/hooks';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { IAccount, IFormUpdatePassword } from '../../../interface';
import AccountApi from '../../../service/Account.service';
const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 24 },
};

const ChangePassword = ({ account }: { account: IAccount }) => {
  const { t, i18n } = useTranslation('lng');
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onFinish = async (values: IFormUpdatePassword) => {
    try {
      dispatch(setLoading(true));
      const res = await AccountApi.updateAccountPassword({
        ...values,
        id: account?.id,
      });

      dispatch(setLoading(false));
      toast.success(`${t('changePassword.messages.success')}`);
      navigate('/account');
    } catch (error) {
      //@ts-ignore
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };
  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item
        name="password"
        label="Mật khẩu:"
        rules={[
          { required: true, message: 'Hãy nhập thông tin cho trường mật khẩu' },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="Mật khẩu mới:"
        rules={[
          {
            required: true,
            message: 'Hãy nhập thông tin cho trường mật khẩu mới',
          },
        ]}
      >
        {/* <p>Nhập mật khẩu:</p> */}
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirmNewPassword"
        label="Nhập lại mật khẩu mới:"
        rules={[
          {
            required: true,
            message: 'Hãy nhập thông tin cho trường nhập lại mật khẩu',
          },
        ]}
      >
        {/* <p>Nhập mật khẩu:</p> */}
        <Input.Password />
      </Form.Item>

      <Button
        htmlType="submit"
        className="bg-green-500 hover:bg-green-400 flex min-w-[170px]  clear-right float-right  items-center px-5 py-4"
        size="large"
        type="primary"
        shape="round"
        icon={<CheckOutlined />}
      >
        Lưu Thay Đổi
      </Button>
    </Form>
  );
};

export default ChangePassword;
