import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Constant from '../Config/Constants';
import ServiceEnum from '../Variables/ServiceEnum';
import { NativeModules } from 'react-native';
import { reSyncFileVideo } from './Utils';
import StaticData from '../Variables/StaticData';
import AssetsService from '../Service/AssetsService';
import GlobalRepository from './../Repositories/GlobalRepository';
const { RebootHelper, DevicePeripherals } = NativeModules;

class SignalRHub {
  static hubConnection = null;
  static token = '';
  static eventHandler = (data) => () => {};
  static delay = millis =>
    new Promise((resolve, reject) => {
      setTimeout(_ => resolve(), millis);
    });
  /*
  Được khởi tạo đầu tiên khi chạy ứng dụng (khởi tạo trong root Container) và được cấu hình lắng nghe các kênh để nhận thông tin về các lệnh từ server như
  */
  static InitSignalR() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(
        Constant.SOCKETS.URL +
        ServiceEnum.SIGNALR +
        StaticData.serialNumber
      )
      .configureLogging(LogLevel.Information)
      .build();
    // Nhận thông tin yêu cầu reboot từ server
    this.hubConnection.on('onreboot', data => {
      console.log('Reboot data areceived:', data);
      RebootHelper.Reboot();
    });
    // Nhận thông tin mở khóa tủ kiosk từ server
    this.hubConnection.on('onOpenLock', data => {
      console.log('onOpenLock:', data);
      DevicePeripherals.openLocker();
    });
    // Nhận thông tin về secret key từ server
    this.hubConnection.on('onReceiveKey', data => {
      console.log('token:', data);
      this.token = data;
    });
    // Nhận lệnh đồng bộ các video từ local lên server
    this.hubConnection.on("reSyncFileVideo", data => {
      onsole.log('reSyncFileVideo:', data);
      reSyncFileVideo();
    });
    this.hubConnection.on("onRefresh", data => {
      SignalRHub.getAllAssests();
    });
    this.hubConnection.on("onActive", data => {
      SignalRHub.onActive();
    });

    this.hubConnection.on("onInactive", (data) => {
      console.log('onReceiveKey', StaticData.routerName);
      SignalRHub.navMove();
    });
    
    this.hubConnection.on("notifyResultTransaction", (data) => {
      this.eventHandler(data);
    });
  }
  


  static async StartHub() {
    await this.hubConnection.start();
  }
  static async getAllAssests() {
    var assetsService = new AssetsService();
    var globalRepository = new GlobalRepository();
    var configData = await globalRepository.getConfig();
    if (configData.status) {
      StaticData.dataResource = configData;
    }
    var image = await assetsService.getAssets();
    if (image.status != false) {
      assetsService.downloadAllAssets(image);
    }
  }
  static async AwaitToken() {
    do {
      if (SignalRHub.token == '') {
        await delay(2000);
      } else {
        return;
      }
    } while (true);
  }
  static async onActive() {
    StaticData.mantainanceType = 0;
    var interval = setInterval(() => {
      if (StaticData.routerName === 'MaintenanceScreen') {
        StaticData.navigation.navigate('Home');
        clearInterval(interval);
      }
    }, 5000);
  }
  static async navMove() {
    StaticData.mantainanceType = 3;
    var interval = setInterval(() => {
      if (StaticData.routerName === 'Home') {
        StaticData.navigation.navigate('MaintenanceScreen');
        clearInterval(interval);
      }
    }, 5000);
  }
  
  /*
  Gửi thông báo lỗi lên server
  */
  static async ErrorEvent(deviceId, errorCode) {
    if (this.hubConnection.state === 'Disconnected') {
      await this.hubConnection.start();
    }
    this.hubConnection.invoke('HandleErrorEvent', {
      deviceId,
      errorCode
    });
  }
  /*
  Gửi log các thao tác trả sim/vnpass của kiosk lên server
  */
  static async addOrderLog(para) {
    if (this.hubConnection.state === 'Disconnected') {
      await this.hubConnection.start();
    }
    this.hubConnection.invoke('AddOrderLog', para); //  AddOrderLog
  }

  static async cancelOrder(orderCode) {
    if (this.hubConnection.state === 'Disconnected') {
      await this.hubConnection.start();
    }
    this.hubConnection.invoke('CancelOrder', orderCode.toString()); //  CancelOrder
  }

  static async processOutCard(orderCode, isSuccess, boxIndex, serialNumber, isCompleted) {
    if (this.hubConnection.state === 'Disconnected') {
      await this.hubConnection.start();
    }

    this.hubConnection.invoke('ProcessOutCard',
      orderCode,
      isSuccess,
      boxIndex,
      serialNumber,
      isCompleted
    ); //  AddOrderLog 
  }
  //Thêm trạng thái hiện tại của kiosk lên server
  static async addCurrentKioskState(state) {
    if (this.hubConnection.state === 'Disconnected') {
      await this.hubConnection.start();
    }
    if (state == 0) {
      console.log("Kiosk đang trong trạng thái chờ");
    }
    if (state == 1) {
      console.log("Kiosk đang trong trạng thái thao tác hoạt động");
    }
    if (state == -1) {
      console.log("Kiosk đang trong trạng thái bảo trì");
    }
    this.hubConnection.invoke('InvokeWorkingStateKioskAsync', StaticData.serialNumber, state);
  }
}

export default SignalRHub;
