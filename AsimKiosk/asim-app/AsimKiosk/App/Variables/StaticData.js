class StaticData {
  static dataResource = null;
  static chooseServices = null;
  static chooseTypeSim = null;
  static chooseTypePayment = null;
  static cameraServices = null;
  static captureViceoUrl = "";
  static captureVideo = false
  static tranNo = null;
  static routerName = "";
  static language = 'en';
  static navigation = "";
  static video = 0;
  static serialNumber = null;
  static commodityListBill = null;
  static totalbill = null;
  static timeOut = 50000;
  //Interval Handle
  static isActive = false;
  static timeToAutoReturnToHome = 50;
  static timeToAutoDeleteVideoRecord = 50;
  static mantainanceType = 0;
  static forceToMantainance = false;
  
  static getdataResource() {
    return dataResource;
  }
}
export default StaticData;