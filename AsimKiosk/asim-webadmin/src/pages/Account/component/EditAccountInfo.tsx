import { CheckOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { useAppDispatch } from '../../../apps/hooks';
import { IAccount, IFormUpdateAccount } from '../../../interface';
import AccountApi from '../../../service/Account.service';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 24 },
};

const EditAccountInfo = ({ account }: { account: IAccount }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish = async (values: IFormUpdateAccount) => {
    if (
      !(
        values.address ||
        values.email ||
        values.fullName ||
        values.password ||
        values.phoneNumber ||
        values.role
      )
    ) {
      toast.error('Vui lòng nhập trường dữ liệu bạn muốn thay đổi để tiếp tục');
      return;
    }
    try {
      dispatch(setLoading(true));
      await AccountApi.updateAccount({ ...values, password: '' });
      toast.success('Sửa thông tin tài khoản thành công');
      navigate('/account');
      dispatch(setLoading(false));
    } catch (error) {
      //@ts-ignore
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };
  return (
    <Card
      className="w-full xl:w-4/6 m-auto"
      title={`Sửa thông tin tài khoản`}
      headStyle={{
        fontSize: '20px',
        lineHeight: '26px',
        fontWeight: '600',
        textAlign: 'center',
      }}
    >
      <Form
        name="validate_other"
        {...formItemLayout}
        layout="horizontal"
        onFinish={onFinish}
        className="w-full font-semibold text-base p-0 "
      >
        <Form.Item
          initialValue={account?.id}
          className="font-bold w-full "
          label="ID:"
          name="id"
          rules={[{ required: true }]}
        >
          <Input className="font-normal" disabled />
        </Form.Item>
        <Form.Item
          initialValue={''}
          className="font-bold w-full"
          label="Tên người dùng:"
          name="fullName"

          //   rules={[{  }]}
        >
          <Input
            className="font-normal placeholder:text-[#000]"
            placeholder={account?.fullName}
          />
        </Form.Item>
        <Form.Item
          initialValue={''}
          className="font-bold w-full"
          label="Email:"
          name="email"
          //   rules={[{  }]}
        >
          <Input
            className="font-normal placeholder:text-[#000]"
            placeholder={account?.email}
          />
        </Form.Item>
        <Form.Item
          initialValue={''}
          className="font-bold w-full"
          label="Địa chỉ:"
          name="address"
          //   rules={[{  }]}
        >
          <Input
            className="font-normal placeholder:text-[#000]"
            placeholder={account?.address}
          />
        </Form.Item>
        <Form.Item
          initialValue={''}
          className="font-bold w-full"
          label="Số điện thoại:"
          name="phoneNumber"
          //   rules={[{  }]}
        >
          <Input
            className="font-normal placeholder:text-[#000]"
            placeholder={account?.phoneNumber}
          />
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
    </Card>
  );
};

export default EditAccountInfo;
