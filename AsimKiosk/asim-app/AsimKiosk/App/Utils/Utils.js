import StaticData from "../Variables/StaticData";
class Utils {
    static isUndefined(e) {
        switch (e) {
            case 'undefined':
            case 'NaN':
            case NaN:
            case undefined:
            case '':
            case null:
            case 'null':
            case false:
            case 'false':
                return true;
            default:
                return false;
        }
    }

    static isArray(value, isNotEmpty) {
        if (!Utils.isUndefined(value) && Array.isArray(value)) {
            if (isNotEmpty) {
                return value.length > 0;
            } else {
                return true;
            }
        }
        return false;
    }

    static resetStatic() {
        StaticData.chooseServices = null;
        StaticData.chooseTypeSim = null;
        StaticData.chooseTypePayment = null;
        StaticData.tranNo = null;
    }
}

export default Utils;