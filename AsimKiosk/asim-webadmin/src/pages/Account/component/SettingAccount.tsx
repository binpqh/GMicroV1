import {
  CheckCircleOutlined,
  DeleteOutlined,
  SwapOutlined,
  ExclamationCircleFilled,
  CloseCircleOutlined,
  IssuesCloseOutlined,
} from '@ant-design/icons';
import { IAccount } from '../../../interface';
import { Button, Card, Modal, Space } from 'antd';
import { useState } from 'react';
import ChangePassword from './ChangePassword';
import ChangeRole from './ChangeRole';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import AccountApi from '../../../service/Account.service';
import { toast } from 'react-toastify';
import { StatusEnum } from '../../../Constant/Status';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
const SettingAccount = ({ account }: { account: IAccount }) => {
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showUpdateOptions, setShowUpdateOptions] = useState<
    'ChangePassword' | 'ChangeRole' | undefined
  >(undefined);
  const handleShowUpdateOptions = (
    options: 'ChangePassword' | 'ChangeRole' | undefined
  ) => {
    setShowUpdateOptions(options);
  };

  const showConfirmNotify = (
    title: string,
    desc: string,
    options: 'Active' | 'InActive' | 'Delete'
  ) => {
    confirm({
      title: title,
      icon: (
        <ExclamationCircleFilled style={{ fontSize: '22px', color: 'red' }} />
      ),
      content: desc,
      okText: 'Xác nhân',
      okType: 'danger',
      cancelText: 'Huỷ',
      cancelButtonProps: { type: 'default' },
      autoFocusButton: 'cancel',

      onOk: async () => {
        try {
          dispatch(setLoading(true));

          if (options == 'Active') {
            const res = await AccountApi.updateStatusAccount({
              status: StatusEnum.Active,
              userId: account?.id,
            });

            dispatch(setLoading(false));
            toast.success('Kích hoạt tài khoản thành thành công');
          }

          if (options == 'Delete') {
            const res = await AccountApi.updateStatusAccount({
              status: StatusEnum.Deleted,
              userId: account?.id,
            });

            dispatch(setLoading(false));
            toast.success('Xóa tài khoản thành thành công');
          }
          if (options == 'InActive') {
            const res = await AccountApi.updateStatusAccount({
              status: StatusEnum.Inactive,
              userId: account?.id,
            });

            dispatch(setLoading(false));
            toast.success('Vô hiệu hóa tài khoản thành thành công');
          }
          navigate('/account');
        } catch (error) {
          //@ts-ignore
          showToastErrors(error.errors);
          dispatch(setLoading(false));
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <Card
      className="w-full xl:w-4/6 m-auto "
      title={`Chức năng`}
      headStyle={{
        fontSize: '20px',
        lineHeight: '26px',
        fontWeight: '600',
        textAlign: 'center',
      }}
    >
      <Space size={20} wrap className="justify-center flex mb-8">
        {/* <Button
          className="bg-cyan-500  hover:bg-cyan-400 flex items-center min-w-[170px] justify-center  "
          type="primary"
          size="large"
          shape="round"
          icon={<SwapOutlined />}
          onClick={() => {
            handleShowUpdateOptions('ChangePassword');
          }}
        >
          Đổi mật khẩu
        </Button> */}
        <Button
          className="bg-emerald-500 hover:bg-emerald-400 flex items-center min-w-[170px] justify-center "
          type="primary"
          size="large"
          shape="round"
          icon={<IssuesCloseOutlined />}
          onClick={() => {
            handleShowUpdateOptions('ChangeRole');
          }}
        >
          Đổi Role
        </Button>
        {account?.activeStatus == 'Active' && (
          <Button
            danger
            className="flex items-center min-w-[170px] justify-center text-white bg-yellow-500 hover:bg-yellow-400 "
            type="primary"
            size="large"
            shape="round"
            icon={<CloseCircleOutlined />}
            onClick={() => {
              showConfirmNotify(
                'Vô hiệu hóa tài khoản',
                'Bạn có muốn vô hiệu hóa tài khoản này ?',
                'InActive'
              );
            }}
          >
            Vô hiệu hóa
          </Button>
        )}
        {account?.activeStatus == 'Inactive' && (
          <Button
            danger
            className="flex items-center min-w-[170px] justify-center text-white bg-lime-500 hover:bg-lime-400 "
            size="large"
            shape="round"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              showConfirmNotify(
                'Kích hoạt tài khoản',
                'Bạn có muốn kích hoạt tài khoản này ?',
                'Active'
              );
            }}
          >
            Kích hoạt
          </Button>
        )}
        <Button
          danger
          className="  flex items-center min-w-[170px] justify-center text-white  "
          type="primary"
          size="large"
          shape="round"
          icon={<DeleteOutlined />}
          onClick={() => {
            showConfirmNotify(
              'Xóa tài khoản',
              'Bạn có muốn xóa tài khoản này ?',
              'Delete'
            );
          }}
        >
          Xóa tài khoản
        </Button>
      </Space>
      {showUpdateOptions == 'ChangePassword' && (
        <ChangePassword account={account} />
      )}
      {showUpdateOptions == 'ChangeRole' && <ChangeRole account={account} />}
    </Card>
  );
};

export default SettingAccount;
