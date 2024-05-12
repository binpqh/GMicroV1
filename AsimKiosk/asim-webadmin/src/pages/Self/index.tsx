import { Button, Card, Form, Input, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch } from '../../apps/hooks';
import { ISelfRes, IUpdatePasswordSelf } from '../../interface/ISelf';
import SelfAPI from '../../service/Self.service';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';

export default function SelfInfo() {
  const dispatch = useAppDispatch();
  const layout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 19 },
  };

  const [form] = Form.useForm();
  const [dataSelf, setDataSelf] = useState<ISelfRes>();
  const handleGetMe = async () => {
    try {
      const response = await SelfAPI.getMe();
      // toast.success("Vô hiệu hóa tài khoản thành công");
      setDataSelf(response.data);
      console.log(response.data);
    } catch (error) {
      console.log('failed to fetch productList', error);
      // toast.error("Vô hiệu hóa tài khoản thất bại");
    }
  };
  const updateSelfPassword = async (value: IUpdatePasswordSelf) => {
    try {
      dispatch(setLoading(true));
      const response = await SelfAPI.updateSelfPassword(value);
      dispatch(setLoading(false));
      toast.success('Đổi mật khẩu thành công');
      form.resetFields();
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(`${error}`);
    }
  };
  useEffect(() => {
    handleGetMe();
  }, []);
  return (
    <div className="h-full flex items-center ">
      <div className=" md:flex gap-5 justify-center mb-2 w-full">
        <Card
          className="w-full md:w-2/6 mt-4"
          title={`Thông tin tài khoản`}
          headStyle={{
            fontSize: '20px',
            lineHeight: '26px',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          <div className="flex items-center justify-center ">
            <div className=" w-4/6 ">
              <p className="block font-semibold text-base pb-2 ">ID:</p>
              <p className="block font-semibold text-base  pb-2 ">Họ và tên:</p>
              <p className="block font-semibold text-base  pb-2 ">
                Tên tài khoản:
              </p>
              <p className="block font-semibold text-base  pb-2 ">Role:</p>
              <p className="block font-semibold text-base  pb-2 ">
                Tình trạng:
              </p>
            </div>
            <div className="w-4/6 ">
              <p className="block font-[700] text-base  pb-2 ">
                {dataSelf?.id}
              </p>
              <p className="block font-[700] text-base  pb-2 ">
                {dataSelf?.userName}
              </p>

              <p className="block font-[700] text-base  pb-2 ">
                {dataSelf?.displayName}
              </p>
              <p className="block font-[700] text-base  pb-2 ">
                {dataSelf?.role.name}
              </p>
              <p className="block font-[700] text-base  pb-2">
                <Tag
                  color={dataSelf?.isEnable === true ? 'green' : 'volcano'}
                  key={'isEnable'}
                >
                  {dataSelf?.isEnable === true
                    ? 'Enable'.toUpperCase()
                    : 'UnEnable'.toUpperCase()}
                </Tag>
              </p>
            </div>
          </div>
        </Card>
        <Card
          className="w-full md:w-2/6 mt-4"
          title={`Đổi mật khẩu`}
          headStyle={{
            fontSize: '20px',
            lineHeight: '26px',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          <div className="">
            <Form
              {...layout}
              form={form}
              name="control-hooks"
              onFinish={updateSelfPassword}
              style={{ maxWidth: 600 }}
            >
              <div className="w-full">
                <Form.Item
                  name="oldPassword"
                  label="Mật khẩu cũ:"
                  rules={[{ required: true }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới:"
                  rules={[{ required: true }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="confirmNewPassword"
                  label="Nhập lại mật khẩu mới:"
                  rules={[{ required: true }]}
                >
                  {/* <p>Nhập mật khẩu:</p> */}
                  <Input.Password />
                </Form.Item>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-green-500 mr-2 float-right"
                >
                  Xác nhận
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
