import StaticData from '../Variables/StaticData';
import { NativeModules } from 'react-native';
const { Printer } = NativeModules;
class PrintRepository {
    constructor() {
    }

    async statusOutOfPaper() {
        const data = await Printer.StatusOutOfPaper();
        return data;
    };

    async printBill() {
        await Printer.PrinterBill(
            StaticData.serialNumber,
            StaticData.chooseTypePayment.orderCode,
            StaticData.language,
            StaticData.chooseServices.hotLine,
            StaticData.chooseServices.email,
            StaticData.totalbill,
            StaticData.commodityListBill
        );
    }
    async checkPaper() {
        const data = await Printer.CheckPaper();
        return data;
    }
}

export default PrintRepository;