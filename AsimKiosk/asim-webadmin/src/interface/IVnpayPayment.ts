export interface IVnpayTerminal {
  id: number;
  name: null | string;
  terminalId: string;
  termialName: null | string;
  used: boolean;
}

export interface IAddVnpayTerminal {
  name: string;
  terminalId: string;
  terminalName: string;
  vnpayMerchantId: boolean;
}

export interface IAddVnpayMerchant {
  name: string | null;
  merchantCode: string;
  merchantName: string;
  merchantType: string;
  masterMerCode: string;
  createQRUrl: string;
  createQRSecret: string;
  checkTransUrl: string;
  checkTransSecret: string;
  refundUrl: string;
  refundSecret: string;
  appId: string;
  id: number;
}
export interface IVnpayPayment extends IAddVnpayMerchant {
  terminals: IVnpayTerminal[];
  // id: string;
  // name: null | string;
  // merchantCode: string;
  // merchantName: string;
  // merchantType: string;
  // masterMerCode: string;
  // createQRUrl: string;
  // createQRSecret: string;
  // checkTransUrl: string;
  // checkTransSecret: string;
  // refundUrl: string;
  // refundSecret: string;
  // appId: string;
}
