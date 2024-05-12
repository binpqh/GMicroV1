import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { IPaymentConfig } from '../../interface/IPaymentConfig';
import { PaymentConfigApi } from '../../service/PaymentConfig.service';
import { StatusEnum } from '../../Constant/Status';
import { showToastErrors } from '../../utils/toast_errors';
const PaymentConfigList = React.lazy(() => import('./Components/PaymentConfigList'));
const PaymentProfile = React.lazy(() => import('./Components/PaymentProfile'));
const initPaymentConfig = {
  id: '',
  keySecret: '',
  merchantCode: '',
  channelCode: '',
  urlDomain: {
    paymentConfig: '',
    paymentGateway: '',
  },
  customerEmail: '',
  customerName: '',
  customerMobile: '',
  ipnUrl: '',
  redirectUrl: '',
  status: '',
  shopId: '',
};
export default function Payment() {
  const dispatch = useDispatch();
  const [paymentConfigList, setPaymentConfigList] = useState<IPaymentConfig[]>([initPaymentConfig]);
  const paymentConfigActive = useMemo(
    () => paymentConfigList.find((pc) => pc.status.toLowerCase() == 'active'),
    [paymentConfigList]
  );
  const [isRender, setIsRender] = useState<boolean>(false);
  const getAllPaymentConfig = async () => {
    try {
      dispatch(setLoading(true));
      const res = await PaymentConfigApi.getAllPaymentConfig();
      setPaymentConfigList(res.data);
      dispatch(setLoading(false));
    } catch (error: any) {
      //@ts-ignore
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };

  const handleChangePaymentConfigStatus = async (
    paymentConfigId: string,
    status: 'Active' | 'InActive' | 'Delete'
  ) => {
    try {
      dispatch(setLoading(true));

      const formatData = {
        paymentConfigId: paymentConfigId,
        status:
          status === 'Active'
            ? StatusEnum.Active
            : status === 'InActive'
            ? StatusEnum.Inactive
            : StatusEnum.Deleted,
      };
      const res = await PaymentConfigApi.changePaymentConfigStatus(formatData);
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
    <div className="mx-3">
      <PaymentProfile paymentConfig={paymentConfigActive ?? initPaymentConfig} type="component" />
      <PaymentConfigList
        paymentConfigList={paymentConfigList}
        handleChangePaymentConfigStatus={handleChangePaymentConfigStatus}
        handleTriggerRerender={handleTriggerRerender}
      />
    </div>
  );
}
