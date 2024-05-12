import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IAccount } from '../../../interface';
import AccountApi from '../../../service/Account.service';
import EditAccountInfo from './EditAccountInfo';
import SettingAccount from './SettingAccount';
import { showToastErrors } from '../../../utils/toast_errors';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';

export default function AccountInfo({ userId }: { userId: string }) {
  const [showUpdateOptions, setShowUpdateOptions] = useState<'Info' | 'Setting'>('Setting');

  const dispatch = useDispatch();

  const [account, setAccount] = useState<IAccount>();

  const getAccountInfo = async () => {
    try {
      dispatch(setLoading(true));
      const res = await AccountApi.getAccountById(userId);
      setAccount(res.data);
      dispatch(setLoading(false));
    } catch (error) {
      //@ts-ignore
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };
  const handleShowUpdateOptions = (options: 'Info' | 'Setting') => {
    setShowUpdateOptions(options);
  };

  useEffect(() => {
    getAccountInfo();
  }, []);
  return (
    <div className=" bg-gray-100 w-full gap-5 mt-5 ">
      <Card
        className="w-full xl:w-3/6 m-auto mb-5"
        title={`Thông tin tài khoản`}
        headStyle={{
          fontSize: '20px',
          lineHeight: '26px',
          fontWeight: '600',
          textAlign: 'center',
        }}
        actions={[
          <EditOutlined
            style={{ fontSize: '22px' }}
            key="edit"
            onClick={() => handleShowUpdateOptions('Info')}
          />,
          <SettingOutlined
            style={{ fontSize: '22px' }}
            key="setting"
            onClick={() => handleShowUpdateOptions('Setting')}
          />,
        ]}
      >
        <div className="flex items-center ">
          <div className=" w-3/6 ">
            <p className="block font-semibold text-base pb-2 ">ID:</p>
            <p className="block font-semibold text-base  pb-2 ">Họ và tên:</p>
            <p className="block font-semibold text-base  pb-2 ">Tên tài khoản:</p>
            <p className="block font-semibold text-base  pb-2 ">Role:</p>
            <p className="block font-semibold text-base  pb-2 ">Tình trạng:</p>
          </div>
          <div className="w-3/6 ">
            <p className="block font-[700] text-base  pb-2 ">{account?.id}</p>
            <p className="block font-[700] text-base  pb-2 ">{account?.fullName}</p>

            <p className="block font-[700] text-base  pb-2 ">{account?.userName}</p>
            <p className="block font-[700] text-base  pb-2 ">{account?.role}</p>
            <p className="block font-[700] text-base  pb-2">
              {account?.activeStatus == 'Active' ? (
                <Tag color={'blue'} key={'activeStatus'}>
                  {account?.activeStatus.toUpperCase()}
                </Tag>
              ) : (
                <Tag color={'error'} key={'activeStatus'}>
                  {account?.activeStatus.toUpperCase()}
                </Tag>
              )}
            </p>
          </div>
        </div>
      </Card>
      {showUpdateOptions == 'Info' ? (
        <EditAccountInfo account={account as IAccount} />
      ) : (
        <SettingAccount account={account as IAccount} />
      )}
    </div>
  );
}
