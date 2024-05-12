import ServiceEnum from '../Variables/ServiceEnum';
import { Constants } from '../Config';
import { postData } from '../Services/network/network-services';
import { NativeModules } from 'react-native';
import StaticData from '../Variables/StaticData';
const { DevicePeripherals } = NativeModules;

class UPSRepository {

    constructor() {
    }
    delay = millis =>
        new Promise((resolve, reject) => {
            setTimeout(_ => resolve(), millis);
        });

    async getBatteryLevel() {

         return 10;//DevicePeripherals.getTemplature();
        // return await DevicePeripherals.getBatteryLevel();
        // var dem = 1;
        // var result = 0;
        // do {
        //     result = await DevicePeripherals.getBatteryLevel();
        //     if (result != 0)
        //         return result;
        //     delay(Math.pow(3, dem) * 1000);
        //     dem++;
        // } while (true && dem < 4);
        // return 0;
    }
    async getTemperature() {

        return 10;//DevicePeripherals.getTemplature();
        // var dem = 1;
        // var result = 0;
        // do {
        //     result = await DevicePeripherals.getTemperature();
        //     if (result != 0)
        //         return result;
        //     delay(Math.pow(3, dem) * 1000);
        //     dem++;
        // } while (true && dem < 4);
        // return 0;
    }
    // async getinputVoltage() {
    //     // return 10;//DevicePeripherals.getInputVoltage();
    //     // var inputVoltage = await DevicePeripherals.getInfoUps()
    //     // return JSON.parse(inputVoltage.inputVoltage);
    // }
    async getInforUPSControl() {
        /* if( StaticData.upstest == null){
             return {batteryLevel: 10, consumedLoad: 20,batteryVoltage: 15, outputVoltage: 5, frequencyOutput:2,inputVoltage:219 };
         }
         return StaticData.upstest;
         */
       //   var data = {batteryLevel: 10, consumedLoad: 20,batteryVoltage: 15, outputVoltage: 5, frequencyOutput:2,inputVoltage:219 };
        //  return data;
        // return await DevicePeripherals.getInfoUps();
         
        // var dem = 1;
        // var data = null;
        // do {       
        //     var ups = await DevicePeripherals.getInfoUps();
        //     data = JSON.parse(ups);
        //     if (data.batteryLevel != 0 && data.batteryVoltage != 0 && data.consumedLoad != 0 && data.frequencyOutput != 0 && data.inputVoltage != 0 && data.outputVoltage != 0 && data.totalInfo != "")
        //         return data;
        //     delay(Math.pow(3, dem) * 1000);
        //     dem++;
        // } while (true && dem < 4);
        // return data;

        return { batteryLevel: 10, consumedLoad: 20, batteryVoltage: 15, outputVoltage: 5, frequencyOutput: 2, inputVoltage: 219 };
    }
    async getInforUPSControlv1() {
        /*if( StaticData.upstest == null){
            // return {batteryLevel: 10, consumedLoad: 20,batteryVoltage: 15, outputVoltage: 5, frequencyOutput:2,inputVoltage:219 };
        }
        return StaticData.upstest;
        */
        // var data = { batteryLevel: 10, consumedLoad: 20, batteryVoltage: 15, outputVoltage: 5, frequencyOutput: 2, inputVoltage: 219 };

        // return data;
        // var ups = await DevicePeripherals.getInfoUps();
        // var  data = JSON.parse(ups);
        // return data;
        return { batteryLevel: 10, consumedLoad: 20, batteryVoltage: 15, outputVoltage: 5, frequencyOutput: 2, inputVoltage: 219 };
    }




    async temperatureSend(temperature) {
        const paramsTemperture = { tempertureNow: temperature.toString() }
        var url = Constants.SERVER_URL_USER + ServiceEnum.TEMPERTURE
        await postData(url, paramsTemperture)
    }
    async upsInforSend(upsBattery, batery) {
        var params = {
            bateryLevel: batery == null ? "" : batery.toString(),
            consumedLoad: upsBattery.consumedLoad == null ? "" : upsBattery.consumedLoad.toString(),
            batteryVoltage: upsBattery.batteryVoltage == null ? "" : upsBattery.batteryVoltage.toString(),
            inputVoltage: upsBattery.inputVoltage == null ? "" : upsBattery.inputVoltage.toString(),
            outPutVoltage: upsBattery.outputVoltage == null ? "" : upsBattery.outputVoltage.toString(),
            frequencyOutput: upsBattery.frequencyOutput == null ? "" : upsBattery.frequencyOutput.toString()
        }
        var url = Constants.SERVER_URL_USER + ServiceEnum.LOGUPS;
        await postData(url, params);
    }
}

export default UPSRepository;