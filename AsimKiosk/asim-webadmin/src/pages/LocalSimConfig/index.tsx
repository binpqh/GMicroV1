import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { IPaymentConfig } from '../../interface/IPaymentConfig';
import { PaymentConfigApi } from '../../service/PaymentConfig.service';
import { StatusEnum } from '../../Constant/Status';
import { showToastErrors } from '../../utils/toast_errors';
import { TLocalSimConfig } from '../../interface/TLocalSimApi';
import { LocalSimApi } from '../../service/LocalSimApi.service';
import { useAppDispatch } from '../../apps/hooks';
const PaymentConfigList = React.lazy(() => import('./Components/PaymentConfigList'));
const LocalSimProfileActive = React.lazy(() => import('./Components/LocalSimProfileActive'));
const initLocalSimConfigValue = {
  userName: '',
  password: '',
  grantType: '',
  clientId: '',
  clientSecret: '',
  scope: '',
  realm: '',
  authUrl: '',
  bussUrl: '',
  id: '',
  status: '',
};
export default function LocalSimConfigPage() {
  const dispatch = useAppDispatch();
  const [localSimConfigList, setLocalSimConfigList] = useState<TLocalSimConfig[]>([
    initLocalSimConfigValue,
  ]);
  const localSimConfigActive = useMemo(
    () => localSimConfigList.find((item) => item.status.toLowerCase() == 'active'),
    [localSimConfigList]
  );
  const [isRender, setIsRender] = useState<boolean>(false);
  const getAllPaymentConfig = async () => {
    try {
      dispatch(setLoading(true));
      const res = await LocalSimApi.getAllLocalSimConfig();
      setLocalSimConfigList(res.data.data);
    } catch (error: any) {
      //@ts-ignore
      showToastErrors(error.errors);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChangePaymentConfigStatus = async (
    localSimConfigId: string,
    status: 'Active' | 'Delete'
  ) => {
    try {
      dispatch(setLoading(true));

      const res =
        status === 'Active'
          ? await LocalSimApi.ActiveLocalSimConfig(localSimConfigId)
          : await LocalSimApi.DeleteLocalSimConfig(localSimConfigId);
      getAllPaymentConfig();
      dispatch(setLoading(false));
    } catch (error: any) {
      //@ts-ignore
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    getAllPaymentConfig();
  }, [isRender]);

  const handleTriggerRerender = () => {
    setIsRender(!isRender);
  };

  return (
    <div className="lg:mx-3">
      <LocalSimProfileActive
        LocalSimConfig={localSimConfigActive ?? initLocalSimConfigValue}
        type="component"
      />
      <PaymentConfigList
        LocalSimConfigList={localSimConfigList}
        handleChangePaymentConfigStatus={handleChangePaymentConfigStatus}
        handleTriggerRerender={handleTriggerRerender}
      />
    </div>
  );
}
