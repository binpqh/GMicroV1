import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../Components/Header/Header';
import Language from '../../Components/Header/Language';
import MoneyText from '../../Components/Money/MoneyText';
import { connect, } from 'react-redux';
import { english, vi } from '../../Lib/Language';
import LinearGradient from 'react-native-linear-gradient';
import StaticData from '../../Variables/StaticData';
import LogService from '../../Service/LogService';
import PrintService from '../../Service/PrintService';

const PrintInvoiceScreen = props => {
    const { navigation, language } = props;
    const [status, setStatus] = React.useState(false);
    var logService;
    var printService;
    var timer;

    React.useEffect(() => {
        timer = setInterval(() => {
            navigation.navigate('RattingScreen');
        }, StaticData.timeOut);

        const onFocus = () => {
            logService = new LogService();
            printService = new PrintService();
        };
        const onBlur = () => {
            logService = null;
            printService = null;
            clearInterval(timer);
        };
        const unsubscribeFocus = navigation.addListener('focus', onFocus);
        const unsubscribeBlur = navigation.addListener('blur', onBlur);
        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [navigation]);

    React.useEffect(() => {
        var price = StaticData.chooseTypeSim.choose.price.vnd * StaticData.chooseTypeSim.choose.quantity
        StaticData.totalbill = ({ quantity: StaticData.chooseTypeSim.choose.quantity.toString(), price: price.toLocaleString('vi-VN') });
        var printBill = [];
        for (var i = 1; i <= StaticData.chooseTypeSim.choose.quantity; i++) {
            printBill.push({ description: StaticData.chooseTypePayment.nameSim, quantity: '1', price: StaticData.chooseTypeSim.choose.price.vnd.toLocaleString('vi-VN') });
        }
        StaticData.commodityListBill = (printBill);
        StaticData.language = (language);
    }, []);

    const handlePrint = React.useCallback(async () => {
        if (!status) {
            setStatus(true);
            var statusOutOfPaper = await printService.statusOutOfPaper();
            if (!statusOutOfPaper) {
                await printService.printBill();
                var checkPaper = printService.checkPaper();
                if (!checkPaper) {
                    setStatus(true);
                } else {
                    await logService.logPrinter({ warningPaper: checkPaper })
                }
            } else {
                await logService.logPrinter({ warningPaper: statusOutOfPaper })
                navigation.navigate('ErrorsPrint');
            }
        }
    }, [status]);

    const renderOrderDetail = React.useMemo(() => {
        return (
            <View style={{ width: 960, alignItems: 'center', marginTop: 76 }}>
                <Text style={{ fontSize: 36, color: 'black', fontWeight: '600' }}>
                    {language == 'en' ? english.bill.txtOrderdetail : vi.bill.txtOrderdetail}
                </Text>
                <View>
                    <View style={{ width: 856 }}>
                        <View
                            style={{ marginTop: 40, borderRadius: 16, borderWidth: 1, borderColor: '#DADADA' }}>
                            <View
                                style={{ flexDirection: 'row', backgroundColor: '#F8F8F8', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingVertical: 16, paddingHorizontal: 40, alignItems: 'center' }}>
                                <Text style={{ fontSize: 24, color: 'black', marginRight: 20, fontWeight: 600, width: 271, }}>
                                    {language == 'en' ? english.bill.txtDescription : vi.bill.txtDescription}
                                </Text>
                                <Text style={{ fontSize: 24, color: 'black', marginHorizontal: 20, fontWeight: 600, width: 135 }}>
                                    {language == 'en' ? english.bill.txtQuantity : vi.bill.txtQuantity}
                                </Text>
                                <Text style={{ fontSize: 24, color: 'black', marginHorizontal: 20, width: 115, fontWeight: 600 }}>
                                    {language == 'en' ? english.bill.txtPriceVND : vi.bill.txtPriceVND}
                                </Text>
                                <Text style={{ fontSize: 24, color: 'black', marginHorizontal: 20, width: 136, fontWeight: 600, }}>
                                    {language == 'en' ? english.bill.txtTotalVND : vi.bill.txtTotalVND}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 40 }}>
                                <View style={{ paddingVertical: 32, marginRight: 20 }}>
                                    <Text numberOfLines={1} style={{ color: 'black', fontSize: 24, width: 310 }}>
                                        {StaticData.chooseTypePayment.nameSim}
                                    </Text>
                                </View>
                                <View style={{ paddingVertical: 32 }}>
                                    <Text
                                        style={{ color: 'black', fontSize: 24, width: 155 }}>
                                        {StaticData.chooseTypeSim.choose.quantity}
                                    </Text>
                                </View>
                                <View style={{ paddingVertical: 32, width: 115, marginRight: 40 }}>
                                    <MoneyText style={{ color: 'black', fontSize: 24 }} value={StaticData.chooseTypeSim.choose.price.vnd} delimiter={'.'} suffix={''} />
                                </View>
                                <View style={{ paddingVertical: 32, width: 175, marginLeft: 20 }}>
                                    <MoneyText style={{ color: 'black', fontSize: 28, color: '#FF2F48' }} value={StaticData.chooseTypeSim.choose.price.vnd * StaticData.chooseTypeSim.choose.quantity} delimiter={'.'} suffix={''} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }, [language]);

    const renderPaymentProcess = React.useMemo(() => {
        return (
            <View style={{ width: 1080, height: 1608, position: 'absolute', marginTop: 216, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: '#ffffff', paddingHorizontal: 30, }}>
                <View style={{ height: 1001, marginTop: 80 }}>
                    <Image
                        style={{ width: '100%', height: 1050 }}
                        source={require('../../Image/billLocal.png')}
                    />
                    <View style={{ position: 'absolute', width: 957, marginHorizontal: 31 }}>
                        <LinearGradient
                            colors={
                                StaticData.chooseTypePayment.code === 'LOCAL_SIM'
                                    ? ['#F8F8F8', '#F8F8F8']
                                    : ['#419679', '#20596A']
                            }
                            style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 56, borderTopRightRadius: 32, borderTopLeftRadius: 32, height: 200, paddingVertical: 46, alignItems: 'center' }}
                        >
                            {StaticData.chooseTypePayment.code === 'LOCAL_SIM' ? (
                                <Image
                                    style={{ width: 223, height: 83 }}
                                    source={require('../../Image/printLogo.png')}
                                />
                            ) : (
                                <Image
                                    style={{ width: 252, height: 84 }}
                                    source={require('../../Image/logoHeaderVNpass.png')}
                                />
                            )}
                            <Text style={{ width: 398, fontSize: 24, color: StaticData.chooseTypePayment.code === 'LOCAL_SIM' ? 'black' : 'white', textAlign: 'right' }}>
                                {language == 'en' ? StaticData.chooseServices.lang.en.address: StaticData.chooseServices.lang.vi.address}
                            </Text>
                        </LinearGradient>
                        <View style={{ width: 856, height: 248, borderRadius: 16, borderWidth: 1, borderColor: '#DADADA', marginTop: 56, marginLeft: 53 }}>
                            <View style={{ flexDirection: 'row', marginTop: 32 }}>
                                <View style={{ paddingHorizontal: 32 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 364, }}>
                                        <Text style={{ fontSize: 24, color: '#909090' }}>
                                            {language == 'en' ? english.bill.txtTel : vi.bill.txtTel}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={{ fontSize: 24, color: 'black' }}
                                        >
                                            {StaticData.chooseServices.hotLine}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 364, marginTop: 24 }}>
                                        <Text style={{ fontSize: 24, color: '#909090' }}>
                                            {'Email:'}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={{ fontSize: 24, color: 'black' }}
                                        >
                                            {StaticData.chooseServices.email}
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{ width: 1, height: 88, backgroundColor: '#DADADA' }}
                                />
                                <View style={{ paddingHorizontal: 32 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 364 }}>
                                        <Text style={{ fontSize: 24, color: '#909090' }}>
                                            {language == 'en' ? english.bill.txtReceipt : vi.bill.txtReceipt}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={{ fontSize: 24, color: 'black', width: 250 }}
                                        >
                                            {StaticData.chooseTypePayment.orderCode}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 364, marginTop: 24 }}>
                                        <Text style={{ fontSize: 24, color: '#909090' }}>
                                            {language == 'en' ? english.bill.txtKioskId : vi.bill.txtKioskId}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={{ fontSize: 24, color: 'black' }}
                                        >
                                            {StaticData.serialNumber}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: 32, alignItems: 'center' }}>
                                <View style={{ width: 792, height: 1, backgroundColor: '#DADADA', marginVertical: 32 }} />
                                <Text style={{ color: 'black', fontSize: 24 }}>
                                    {`${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getDay().toString().padStart(2, '0')} ${new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0') + ':' + new Date().getSeconds().toString().padStart(2, '0') + '.' + new Date().getMilliseconds().toString().padStart(3, '0')}`}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 76, width: 850, height: 1, backgroundColor: '#C0C7D0', marginLeft: 53 }}></View>
                        {renderOrderDetail}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', bottom: 57, width: 1080, justifyContent: 'center', position: 'absolute', backgroundColor: 'white' }}>
                    <TouchableOpacity
                        style={{ width: 283, height: 72, borderRadius: 8, borderRadius: 8, borderWidth: 2, borderColor: '#FF2F48', justifyContent: 'center', alignItems: 'center', marginRight: 80 }}
                        activeOpacity={0.7}
                        onPress={() => handlePrint()}
                    >
                        <Text style={{ color: '#FF2F48', fontSize: 24 }}>{language == 'en' ? english.button.PrintInvoice : vi.button.PrintInvoice}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ width: 283, height: 72, borderRadius: 8, borderRadius: 8, backgroundColor: '#FF2F48', justifyContent: 'center', alignItems: 'center' }}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('RattingScreen')}
                    >
                        <Text style={{ color: 'white', fontSize: 24 }}>{language == 'en' ? english.button.done : vi.button.done}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }, [status, language]);

    const Bottom = React.useMemo(() => {
        return (
            <View style={{ bottom: 0, position: 'absolute' }}>
                <LinearGradient
                    colors={StaticData.chooseTypePayment.code === 'LOCAL_SIM' ? StaticData.chooseTypeSim.colorCode : StaticData.chooseTypeSim.colorCode}
                    style={{ width: 1080, height: 96, justifyContent: 'center', paddingLeft: 56, backgroundColor: '#FF2F48' }}>
                    <Text style={{ fontSize: 28, color: 'white' }}>{"Hotline: " + StaticData.chooseServices?.hotLine}</Text>
                </LinearGradient>
            </View>
        );
    }, [language,]);

    return (
        <View style={{ width: 1080, height: 1920, backgroundColor: '#FF2F48' }}>
            <Header value={StaticData.chooseTypePayment.nameSim} colorCode={StaticData.chooseTypeSim.colorCode} props={navigation} />
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
export default connect(mapStateToProps)(PrintInvoiceScreen);
