export type IFormCreatePaymentConfig = {
  keySecret: string;
  merchantCode: string;
  channelCode: string;
  paymentConfig: string;
  paymentGateway: string;
  customerEmail: string;
  customerName: string;
  customerMobile: string;
  ipnUrl: string;
  redirectUrl: string;
  shopId: string;
};

export type IPaymentConfig = {
  id: string;
  keySecret: string;
  merchantCode: string;
  channelCode: string;
  urlDomain: {
    paymentConfig: string;
    paymentGateway: string;
  };
  customerEmail: string;
  customerName: string;
  customerMobile: string;
  ipnUrl: string;
  redirectUrl: string;
  status: string;
  shopId: string;
};
export type IFormChangePaymentConfigStatus = {
  paymentConfigId: string;
  status: number;
};
