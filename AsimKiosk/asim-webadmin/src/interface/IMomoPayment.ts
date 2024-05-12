
export interface IAddMomoPartner {
  name: string;
  momoDomain: string;
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  isUse: boolean ; // Default true
  redirectUrl: string;
  ipnUrl: string;
  lang: string;
}

export interface IMomoPartner
  extends IAddMomoPartner {
  id: number;
}
