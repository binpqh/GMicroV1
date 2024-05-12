import React from 'react';
import { Image, Text, View } from 'react-native';
import Header from '../../Components/Header/Header';
import Language from '../../Components/Header/Language';
import { connect } from 'react-redux';
import { NativeModules } from 'react-native';
import { english, vi } from '../../Lib/Language';
import LinearGradient from 'react-native-linear-gradient';
import SignalRHub from '../../Utils/SignalRHub';
import StaticData from '../../Variables/StaticData'
import SimService from '../../Service/SimService';
const { Despenser } = NativeModules;

const CollectSimCard = props => {
    const { navigation, language } = props;
    const { navigate } = navigation;
    const [status, setStatus] = React.useState(false);
    const [number, setNumber] = React.useState(0);
    const [nameSim, setNameSim] = React.useState(StaticData.chooseTypePayment.code);
    const [itemCode, setItemCode] = React.useState(StaticData.chooseTypePayment.itemCode);
    const [totalUserAmount, setTotalUserAmount] = React.useState(StaticData.chooseTypeSim.choose.quantity);
    const [orderCode, setOrderCode] = React.useState(StaticData.chooseTypePayment.orderCode);
    var simService;
    const delay = millis =>
        new Promise((resolve, reject) => {
            setTimeout(_ => resolve(), millis);
        });


    React.useEffect(() => {
        const onFocus = () => {
            simService = new SimService();
        };
        const onBlur = () => {
            simService = null;
        };
        const unsubscribeFocus = navigation.addListener('focus', onFocus);
        const unsubscribeBlur = navigation.addListener('blur', onBlur);
        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [navigation]);

    React.useEffect(async () => {
        indexForDispenser(StaticData.dataResource.data.extDevices);
        returnCard(totalUserAmount, StaticData.dataResource.data.extDevices, nameSim, itemCode);
    }, []);
    /*
     Kiểm dispenser nào có thể kết nối listDispensers -> lấy từ API getConfig kiosk được gọi khi khởi tạo chương trình
    */
    function indexForDispenser() {
        for (var i = 0; i < StaticData.dataResource.data.extDevices.length; i++) {
            StaticData.dataResource.data.extDevices[i].index = i + 1;
        }
    }
    function checkSerialNUmber(serialNumber){
        if(serialNumber.length == 0){
            return false;
        }
        for(var i = 0; i< serialNumber.length;i++){
            if(!(serialNumber[i] == " " || serialNumber[i] == "0")){
                return true;
            }
        }
        return false;
    }

    //------------------code convert-----------------------
    var totalCard = 0;
    var cardSuccess = 0;
    /*
  Có chức năng để lấy ra Dispenser đủ điều kiện trả SIM/VNPASS, Loại SIM/ VNPASS người dùng chọn, Số lượng người dùng mua, từ đó ra quyết định chạy hàm  getOneCard một cách hợp lý.
  + totalCardTemp: Số lượng SIM/VNPASS người dùng mua
  + listDispensers: Danh sách các Dispenser khả dụng đã được lọc bởi checkHardware(listDispensers)
  + nameSim dùng để xác định loại thẻ người dùng mua SIM/VNPASS
  + itemCode xác định gói cước người dùng mua
  
    */
    async function returnCard(totalCardTemp, listDispensers, nameSim, itemCode) {
        const selectedDispensers = listDispensers.filter(dispenser =>
            dispenser.itemCode.includes(itemCode)
        );

        if (selectedDispensers.length === 0) {
            return;
        }
        const type = nameSim.includes('SIM') ? 1 : 2;

        cardSuccess = 0;
        totalCard = totalCardTemp;
        for (let i = 0; i < selectedDispensers.length; i++) {

            var init = await Despenser.initDespenser(
                selectedDispensers[i].index,
                selectedDispensers[i].path
            );
            if (!init) {
                continue;
            }
            const temp = await getOneCard(
                selectedDispensers[i].name,
                type,
                selectedDispensers[i].code,
                selectedDispensers[i].index
            );

            if (totalCardTemp == cardSuccess) {
                break;
            }
            if (temp === -1) {
                continue;
            }
            if (temp == -2) {
                //khách hàng không  nhận thẻ
                console.log('Giao dịch thất bại!');
                navigation.navigate('ErrorReturnCard');
                return;
            }
        }

        if (cardSuccess === totalCardTemp) {
            // Giao dịch thành công
            console.log('Giao dịch thành công!');
            navigation.navigate('PrintInvoiceScreen');
        } else {
            // Giao dịch thất bại
            console.log('Giao dịch thất bại!');
            navigation.navigate('ErrorReturnCard');
            ///
        }

        return;
    }

    /*
    Hàm này tích hợp các điều kiện kiểm tra giống trong tài liệu SDK và có chức năng trả 1 thẻ Sim/VNPass
  + boxName: Tên của Dispenser đang dùng để trả SIM/VNPass
  + type: Loại 1(SIM) hoặc 2(VNPASS)
  + extDeviceCode: Code dùng để khởi tạo Dispenser dùng để trả SIM/VNPASS
    */
    async function getOneCard(boxName, type, extDeviceCode, boxIndex) {
        do {
            const checkOutPutResult = await Despenser.checkOutPut(); // Gọi từ API
            const checkReadAreaResult = await Despenser.checkReadArea(); // Gọi từ API
            if (checkOutPutResult || checkReadAreaResult) {
                SignalRHub.addOrderLog({ orderCode: orderCode, message: 'Phát hiện kẹt thẻ', extDeviceCode: extDeviceCode });
                console.log('Phát hiện kẹt thẻ');
                rejectCard(boxName);
            }

            let numberLoop = 0;
            let readSerialResult = '';
            var readRFSerialResult = "";
            var serialTemp = '';
            while (numberLoop < 3) {
                const checkInBoxResult = await Despenser.checkInBox(); // Gọi từ API
                SignalRHub.addOrderLog({ orderCode: orderCode, message: `Trạng thái kho thẻ của ${boxName} là ${checkInBoxResult}`, extDeviceCode: extDeviceCode });
                console.log('Trạng thái kho thẻ: ', checkInBoxResult);
                if (!checkInBoxResult) {
                    SignalRHub.addOrderLog({ orderCode: orderCode, message: `Thẻ trong kho ${boxName} đã hết`, extDeviceCode: extDeviceCode });
                    console.log(`Thẻ trong kho ${boxName} đã hết`);
                    numberLoop++;
                    continue;
                }

                if (type === 1) {
                    const moveCardResult = await Despenser.moveCard(); // Gọi từ API
                    console.log('orderCode', orderCode)
                    console.log('extDeviceCode', extDeviceCode)
                    if (!moveCardResult) {
                        SignalRHub.addOrderLog({ orderCode: orderCode, message: `Lỗi khi gửi lệnh chuyển thẻ trong khay: ${boxName}`, extDeviceCode: extDeviceCode });
                        console.log(`Lỗi khi gửi lệnh chuyển thẻ trong khay: ${boxName}`);
                        numberLoop++;
                        rejectCard(boxName);
                        continue;
                    }
                }
                if (type === 2) {
                    const moveRFCardResult = await Despenser.moveCardRF(); // Gọi từ API
                    if (!moveRFCardResult) {
                        SignalRHub.addOrderLog({ orderCode: orderCode, message: `Lỗi khi gửi lệnh chuyển thẻ RF trong khay: ${boxName}`, extDeviceCode: extDeviceCode });
                        console.log(`Lỗi khi gửi lệnh chuyển thẻ RF trong khay: ${boxName}`);
                        numberLoop++;
                        rejectCard(boxName);
                        continue;
                    }
                }
                const checkReadAreaResultV1 = await Despenser.checkReadArea(); // Gọi từ API

                if (!checkReadAreaResultV1) {
                    SignalRHub.addOrderLog({ orderCode: orderCode, message: `Lỗi mặc dù đã gửi lệnh chuyển thẻ nhưng thẻ vẫn chưa tới khu vực đọc của khay:  ${boxName}`, extDeviceCode: extDeviceCode });
                    console.log(`Lỗi mặc dù đã gửi lệnh chuyển thẻ nhưng thẻ vẫn chưa tới khu vực đọc của khay:  ${boxName}`,);
                    numberLoop++;
                    rejectCard(boxName);
                    continue;
                }
                SignalRHub.addOrderLog({ orderCode: orderCode, message: `Thẻ đã được chuyển đến khu vực đọc của khay:  ${boxName}`, extDeviceCode: extDeviceCode });
                console.log(`Thẻ đã được chuyển đến khu vực đọc của khay:  ${boxName}`);
                //type == 1 là Sim

                if (type === 1) {
                    readSerialResult = await Despenser.readSerial(); // Gọi từ API
                    serialTemp = readSerialResult;

                    if ( checkSerialNUmber(readSerialResult) == false ) {
                        SignalRHub.addOrderLog({ orderCode: orderCode, message: `Lỗi không thể đọc serial SIM tại khay:  ${boxName}`, extDeviceCode: extDeviceCode });
                        console.log(`Lỗi không thể đọc serial SIM tại khay:  ${boxName}`);
                        SignalRHub.processOutCard(orderCode, false, boxIndex, readSerialResult, false);
                        numberLoop++;
                        rejectCard(boxName);
                        continue;
                    }
                    const paramsAddPackageSim = { serialSim: readSerialResult, orderCode: orderCode };
                    var dataAddpackageSim = await simService.addPackageSim(paramsAddPackageSim)
                    if (!dataAddpackageSim.status) {
                        SignalRHub.processOutCard(orderCode, false, boxIndex, readSerialResult, false);
                        SignalRHub.addOrderLog({ orderCode: orderCode, message: `Lỗi không thể đấu nối sim SIM tại khay:  ${boxName}`, extDeviceCode: extDeviceCode });
                        numberLoop++;
                        rejectCard(boxName);
                        continue;
                    }
                }
                if (type === 2) {
                    readRFSerialResult = await Despenser.readIdCardRF(); // Gọi từ API
                    serialTemp = readRFSerialResult;
                    console.log("vn pass:", readRFSerialResult);
                    if (checkSerialNUmber(readRFSerialResult) == false ) {
                        SignalRHub.addOrderLog({ orderCode: orderCode, message: `Lỗi không thể đọc serial RF tại khay:  ${boxName}`, extDeviceCode: extDeviceCode });
                        SignalRHub.processOutCard(orderCode, false, boxIndex, readRFSerialResult, false);
                        console.log(`Lỗi không thể đọc serial RF tại khay:  ${boxName}`);
                        numberLoop++;
                        rejectCard(boxName);
                        continue;
                    }
                    // const addPackageSim = await postData(url, {
                    //   serialSim: readSerialResult,
                    //   orderCode: props.route.params.orderCode,
                    // });
                    // if (!addPackageSim) {
                    //   SignalRHub.addOrderLog({
                    //     orderCode: props.route.params.orderCode,
                    //     message: `Lỗi không thể đấu nối sim RF tại khay:  ${boxName}`,
                    //     extDeviceCode: extDeviceCode,
                    //   });
                    //   rejectCard(boxName);
                    //   numberLoop++;
                    //   continue;
                    // }
                }
                // Gọi API để xác nhận serial
                const outCardResult = await Despenser.outCard(); // Gọi từ API

                if (!outCardResult) {
                    SignalRHub.addOrderLog({ orderCode: orderCode, message: `Lỗi không thể trả thẻ cho người dùng tại khay:  ${boxName}`, extDeviceCode: extDeviceCode });
                    console.log(`Lỗi không thể trả thẻ cho người dùng tại khay:  ${boxName}`);
                    SignalRHub.processOutCard(orderCode, false, boxIndex, serialTemp, false);
                    numberLoop++;
                    rejectCard(boxName);
                    continue;
                }
                SignalRHub.addOrderLog({ orderCode: orderCode, message: `Khay:  ${boxName} đã tiến hành trả thẻ cho người dùng`, extDeviceCode: extDeviceCode });
                console.log(`Khay:  ${boxName} đã tiến hành trả thẻ cho người dùng`);
                break;
            }

            if (numberLoop === 3) {
                return -1;
            }
            var numberSleep = 0;
            do {
                const checkOutPut = await Despenser.checkOutPut();
                if (checkOutPut) {
                    numberSleep++;
                    await delay(1000); // thay delay vào đây
                } else {
                    cardSuccess++; // Người dùng đã lấy thẻ
                    totalCard--;
                    if (cardSuccess == totalUserAmount)
                        SignalRHub.processOutCard(orderCode, true, boxIndex, serialTemp, true);
                    else
                        SignalRHub.processOutCard(orderCode, true, boxIndex, serialTemp, false);
                    setNumber(cardSuccess);
                    setStatus(true);
                    // ở đây totalSuccess++
                    break; // sau khi beark
                }
                if (numberSleep >= 30) {
                    console.log("Reject by 30");

                    rejectCard(boxName);
                    SignalRHub.addOrderLog({ orderCode: orderCode, message: `Khay: ${boxName} khách hàng không nhận thẻ`, extDeviceCode: extDeviceCode });
                    SignalRHub.processOutCard(orderCode, false, boxIndex, serialTemp, false);
                    return -2;
                }
            } while (true);
            // totalSuccess++; // nhảy xuống đây totalSuccess + thêm 1 nữa là 2
            SignalRHub.addOrderLog({ orderCode: orderCode, message: `Khay: ${boxName} đã tiến hành trả thẻ thứ ${cardSuccess}/ ${totalUserAmount} cho người dùng thành công`, extDeviceCode: extDeviceCode });
            console.log(`Khay: ${boxName} đã tiến hành trả thẻ thứ ${cardSuccess}/ ${totalUserAmount} cho người dùng thành công`,);
            if (totalCard == 0) {
                console.log(`Khay: ${boxName} đã tiến hành trả thẻ cho người dùng thành công lần thứ ${cardSuccess} trên số lượng ${totalUserAmount} Sim mà người dùng đã chọn mua`,);
                break;
            }
        } while (true);
        return 1;
    }

    async function rejectCard(boxName) {
        await Despenser.rejectCard(); // Gọi từ API
        SignalRHub.addOrderLog({ orderCode: orderCode, message: `Đang đưa thẻ kẹt ở box: ${boxName} vào nơi chứa thẻ lỗi`, extDeviceCode: extDeviceCode });
        console.log(`Đang đưa thẻ kẹt ở box: ${boxName} vào nơi chứa thẻ lỗi`);
    }

    ///////////////////////////////////// End custom ///////////////////////////////////////


    const renderPaymentProcess = React.useMemo(() => {
        return (
            <View
                style={{ width: 1080, height: 1608, position: 'absolute', marginTop: 216, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: '#ffffff', paddingHorizontal: 56 }}>
                <View
                    style={{
                        backgroundColor: 'white', borderRadius: 20, width: 968, height: 1446, marginTop: 81, shadowColor: '#000000',
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 1.41,
                        elevation: 2
                    }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text
                            style={{ fontSize: 48, fontWeight: '700', color: '#FF2F48', marginTop: 72 }}>
                            {language == 'en' ? english.returnSim.title : vi.returnSim.title}
                        </Text>
                        <Text
                            style={{ fontSize: 24, fontWeight: '500', color: '#000000', marginTop: 24, width: 500, textAlign: 'center' }}>
                            {language == 'en' ? english.returnSim.txtYourReady : vi.returnSim.txtYourReady}
                        </Text>
                        <Text
                            style={{ fontSize: 24, fontWeight: '500', color: '#000000', width: 500, textAlign: 'center' }}>
                            {language == 'en' ? english.returnSim.txtCollectSIM : vi.returnSim.txtCollectSIM}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 48 }}>
                        <View
                            style={{ height: 64, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, color: '#000000' }}>{language == 'en' ? english.returnSim.txtstatus : vi.returnSim.txtstatus}</Text>
                            {status ? (
                                <View
                                    style={{ backgroundColor: '#53D4921A', paddingVertical: 16, paddingHorizontal: 16, marginLeft: 32, justifyContent: 'center', borderRadius: 8, flexDirection: 'row' }}>
                                    <Image style={{ width: 24, height: 24, marginRight: 16, marginTop: 5 }} source={require('../../Image/Ready.png')} />
                                    <Text style={{ fontSize: 24, color: '#53D492' }}>
                                        {language == 'en' ? english.returnSim.txtReady : vi.returnSim.txtReady}
                                    </Text>
                                </View>
                            ) : (
                                <View
                                    style={{ backgroundColor: '#F8970A1A', paddingVertical: 16, paddingHorizontal: 16, marginLeft: 32, alignItems: 'center', borderRadius: 8, flexDirection: 'row' }}>
                                    <Image style={{ width: 22, height: 22, marginRight: 16 }} source={require('../../Image/InProgress.png')} />
                                    <Text style={{ fontSize: 24, color: '#F8970A' }}>
                                        {language == 'en' ? english.returnSim.txtInprogress : vi.returnSim.txtInprogress}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View
                            style={{ width: 555, height: 168, borderRadius: 15, borderWidth: 1, borderColor: '#C5C5C5', backgroundColor: 'white', marginTop: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <View>
                                <Text style={{ color: 'black', fontSize: 24 }}>
                                    {language == 'en' ? english.returnSim.txtPurchased : vi.returnSim.txtPurchased}
                                </Text>
                                <Text
                                    style={{ color: 'black', fontSize: 48, fontWeight: '700', marginTop: 10 }}>
                                    {totalUserAmount}
                                </Text>
                            </View>
                            <View
                                style={{ width: 1, height: 88, backgroundColor: '#C5C5C5' }}></View>
                            <View>
                                <Text style={{ color: 'black', fontSize: 24 }}>{language == 'en' ? english.returnSim.txtReceived : vi.returnSim.txtReceived}</Text>
                                <Text
                                    style={{ color: '#53D492', fontSize: 48, fontWeight: '700', marginTop: 10 }}>
                                    {number}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 97 }}>
                            {nameSim === 'LOCAL_SIM' ? (
                                <Image
                                    style={{ height: 625, width: 551, marginRight: 45, resizeMode: 'cover' }}
                                    source={require('../../Image/SIMTray.png')}
                                />
                            ) : (
                                <Image
                                    style={{ height: 640, width: 680, resizeMode: 'cover', marginRight: 45 }}
                                    source={require('../../Image/CardTray.png')}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    }, [status, number, language]);

    const Bottom = React.useMemo(() => {
        return (
            <View style={{ bottom: 0, position: 'absolute' }}>
                <LinearGradient
                    colors={nameSim === 'LOCAL_SIM' ? StaticData.chooseTypeSim.colorCode : StaticData.chooseTypeSim.colorCode}
                    style={{ width: 1080, height: 96, justifyContent: 'center', paddingLeft: 56, backgroundColor: '#FF2F48' }}>
                    <Text style={{ fontSize: 28, color: 'white' }}>{"Hotline: " + StaticData.chooseServices?.hotLine}</Text>
                </LinearGradient>
            </View>
        );
    }, []);

    return (
        <View
            style={{ width: 1080, height: 1920, backgroundColor: '#FF2F48' }}>
            <Header value={nameSim} colorCode={StaticData.chooseTypeSim.colorCode} props={navigate} />
            {renderPaymentProcess}
            <Language style={{ position: 'absolute' }} />
            {Bottom}
        </View>
    );
};
const mapStateToProps = state => {
    const { language } = state.language;
    return {
        language
    };
};
export default connect(mapStateToProps)(CollectSimCard);
