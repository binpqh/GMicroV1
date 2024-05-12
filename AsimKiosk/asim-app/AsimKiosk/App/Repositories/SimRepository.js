import ServiceEnum from '../Variables/ServiceEnum';
import { Constants } from '../Config';
import { postData } from '../Services/network/network-services';
import StaticData from '../Variables/StaticData';
class SimRepository {
  constructor() {
  }
  async addPackageSim(payload) {
    const data = await postData(Constants.SERVER_URL_USER + ServiceEnum.ADD_PACKAGE_SIM, payload);
    return data;
  }

  chooseTypeServices(simType, checkQuantity) {
    var originalItemsEn = JSON.parse(JSON.stringify(simType.lang.en.items));
    var originalItemsVi = JSON.parse(JSON.stringify(simType.lang.vi.items));

    var simList = checkQuantity.data.filter((item) => item.productCode === simType.code && item.isActived && item.isAvailable);

    // Xóa các mục không còn tồn tại trong simList từ simType.lang.en.items
    simType.lang.en.items = simType.lang.en.items.filter((enItem) => {
      var temp = simList.find((item) => item.itemCode == enItem.code);
      if (temp == null) {
        return false; // Xóa mục
      } else {
        enItem.quantity = 1;
        return true; // Giữ lại mục
      }
    });

    // Xóa các mục không còn tồn tại trong simList từ simType.lang.vi.items
    simType.lang.vi.items = simType.lang.vi.items.filter((viItem) => {
      var temp = simList.find((item) => item.itemCode == viItem.code);
      if (temp == null) {
        return false; // Xóa mục
      } else {
        viItem.quantity = 1;
        return true; // Giữ lại mục
      }
    });

    if (simType.lang.en.items.length && simType.lang.vi.items.length) {
      StaticData.chooseServices = simType;
      return true;
    } else {
      // Khôi phục mảng nếu không đủ điều kiện
      simType.lang.en.items = originalItemsEn;
      simType.lang.vi.items = originalItemsVi;
      return false;
    }
  }

  chooseSim(choose, code, hotLine, name, icon, colorCode) {
    StaticData.chooseTypeSim = { choose, code, hotLine, name, icon, colorCode }
  }

  countQuantitySim(sim) {
    for (var i = 0; i < StaticData.chooseServices.lang.en.items.length; i++) {
      if (sim.code == StaticData.chooseServices.lang.en.items[i].code) {
        StaticData.chooseServices.lang.en.items[i].quantity = StaticData.chooseServices.lang.en.items[i].quantity + 1;
      }
    }
    for (var i = 0; i < StaticData.chooseServices.lang.vi.items.length; i++) {
      if (sim.code == StaticData.chooseServices.lang.vi.items[i].code) {
        StaticData.chooseServices.lang.vi.items[i].quantity = StaticData.chooseServices.lang.vi.items[i].quantity + 1;
      }
    }
  }

  minusQuantitySim(sim) {
    for (var i = 0; i < StaticData.chooseServices.lang.en.items.length; i++) {
      if (sim.code == StaticData.chooseServices.lang.en.items[i].code) {
        StaticData.chooseServices.lang.en.items[i].quantity = StaticData.chooseServices.lang.en.items[i].quantity - 1;
      }
    }
    for (var i = 0; i < StaticData.chooseServices.lang.vi.items.length; i++) {
      if (sim.code == StaticData.chooseServices.lang.vi.items[i].code) {
        StaticData.chooseServices.lang.vi.items[i].quantity = StaticData.chooseServices.lang.vi.items[i].quantity - 1;
      }
    }
  }

}

export default SimRepository;