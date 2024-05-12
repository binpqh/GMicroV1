
import ServiceEnum from './../Variables/ServiceEnum';
import { Constants } from '../Config';
import { getData, postData} from '../Services/network/network-services';
class GlobalRepository {
    constructor(){

    }
    async getConfig(){
        const data = await getData(Constants.SERVER_URL_USER + ServiceEnum.GET_CONFIG);
        return data;
    }
    async rattingApp(payload){
        const data = await postData(Constants.SERVER_URL_USER + ServiceEnum.RATTING,payload);
        return data;
    }
    async checkQuantity(){

        // var data = {
        //     status: true,
        //     data: [
        //       {
        //         peripheralCode: "DI1",
        //         dispenderSlot: 1,
        //         isActived: true,
        //         isAvailable: true,
        //         itemName: "LOCAL SIM",
        //         itemCode: "A65T",
        //         productCode: "LOCAL_SIM"
        //       },
        //       {
        //         peripheralCode: "DI2",
        //         dispenderSlot: 2,
        //         isActived: true,
        //         isAvailable: false,
        //         itemName: "LOCAL SIM",
        //         itemCode: "A65T",
        //         productCode: "LOCAL_SIM"
        //       },
        //       {
        //         peripheralCode: "DI3",
        //         dispenderSlot: 3,
        //         isActived: true,
        //         isAvailable: true,
        //         itemName: "Vé bus 68",
        //         itemCode: "68",
        //         productCode: "VNPASS"
        //       },
        //       {
        //         peripheralCode: "DI4",
        //         dispenderSlot: 4,
        //         isActived: false,
        //         isAvailable: true,
        //         itemName: "Vé bus 86",
        //         itemCode: "ITEM_VNPASS_86",
        //         productCode: "VNPASS"
        //       }
        //     ]
        //   };
        var data = await getData(Constants.SERVER_URL_USER+ServiceEnum.CHECK_QUANTITY);
        return data;
    }
}

export default GlobalRepository;