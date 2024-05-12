import React, { useEffect } from 'react';
import { MainNavigation, SystemMaintenance } from '../Navigation';
import createStore from '../Redux';
import { Provider } from 'react-redux';
import SignalRHub from '../Utils/SignalRHub';
import CameraHub from '../Components/Camera/CameraHub';
import StaticData from '../Variables/StaticData';
import HardwareService from '../Service/HardwareService';
import AssetsService from '../Service/AssetsService';
import IntervalVideo from '../Utils/IntervalVideo';
import IntervalHandler from '../Utils/IntervalHandler';
import GlobalRepository from '../Repositories/GlobalRepository';
const store = createStore();
function RootContainer() {

  const [load, setLoad] = React.useState(false)
  delay = millis =>
    new Promise((resolve, reject) => {
      setTimeout(_ => resolve(), millis);
    });
  useEffect(async () => {
    // Initialize SignalR connection when the component mounts

    var hardwareService = new HardwareService();

    StaticData.serialNumber = await hardwareService.getSerialNumber();
    console.log("serialNumber:", StaticData.serialNumber);
    await SignalRHub.InitSignalR();
    await SignalRHub.StartHub();
    do {
      if (SignalRHub.token == '') {
        await delay(2000);
      } else {
        break;
      }
    } while (true);
    var globalService = new GlobalRepository();
    var dataGetConfig = await globalService.getConfig();
    StaticData.dataResource = dataGetConfig;
    var assetsService = new AssetsService();
    console.log("Start download resource");
    var image = await assetsService.getAssets();
    if (image.status) {
      var downloadStatusFlag = await assetsService.downloadAllAssets(image);
      console.log("End download resource");
      setLoad(downloadStatusFlag);
      
      return;
    }
    
    setLoad(false);
  }, []);


  React.useEffect(() => {
    var intervalHandler = new IntervalHandler();
    var interValVideo = new IntervalVideo();
    interValVideo.startInterval()
  }, []);

  return (
    <Provider store={store}>
      {load ? <MainNavigation /> : <SystemMaintenance />}
      <CameraHub />
    </Provider>
  );
}
export default RootContainer;
