import { CheckOutlined } from '@ant-design/icons';
import { Form, Modal, Button, Select } from 'antd';
import { ROLE } from '../../../Constant/Role';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import AccountApi from '../../../service/Account.service';
import { toast } from 'react-toastify';
import { IAccount } from '../../../interface';
import { getRole } from '../../../apps/Feature/authSlice/authSlice';
import { useAppSelector } from '../../../apps/hooks';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { getPermissionCanHandleRole } from '../../../utils/getPermissionCanHandleRole';
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 24 },
};

const ChangeRole = ({ account }: { account: IAccount }) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const role = useAppSelector(getRole);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values: any) => {
    try {
      dispatch(setLoading(true));
      const res = await AccountApi.updateAccountRole({
        ...values,
        userId: account?.id,
      });

      dispatch(setLoading(false));
      toast.success('Đổi quyền thành công');
      navigate('/account');
    } catch (error) {
      //@ts-ignore
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };
  return (
    <Form {...formItemLayout} form={form} name="control-hooks" onFinish={onFinish} className="">
      <Form.Item name="role" label="Chọn quyền:" rules={[{ required: true }]}>
        <Select
          className="w-50"
          placeholder="Chọn quyền"
          // onChange={onRoleChange}
          allowClear
        >
          {role &&
            getPermissionCanHandleRole(role as string).map((role) => (
              <Option key={role.id + role.name} value={role.id}>
                {role.name}
              </Option>
            ))}
          {/* <Option value={1}>Developer</Option> */}
        </Select>
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

export default ChangeRole;
