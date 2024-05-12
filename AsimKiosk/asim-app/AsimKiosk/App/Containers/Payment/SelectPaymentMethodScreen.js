import React from 'react';
import { Image, Text, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import Header from '../../Components/Header/Header';
import Language from '../../Components/Header/Language';
import { connect } from 'react-redux';
import MoneyText from '../../Components/Money/MoneyText';
import { english, vi } from '../../Lib/Language';
import LinearGradient from 'react-native-linear-gradient';
import StaticData from '../../Variables/StaticData';
import PaymentCardServices from '../../Service/PaymentCardServices';

const SelectPaymentMethodScreen = props => {
    const { navigation, language } = props;
    const { goBack } = navigation;

    //---------------------------------state--------------------------------------------------
    const [preItem, setPreItem] = React.useState('');
    const [chooseTypeBank, setChooseTypeBank] = React.useState('');
    const [bankCode, setBankCode] = React.useState('');
    const [checkTypeBank, setCheckTypeBank] = React.useState(false);
    var paymentCardService;
    //---------------------------------effect--------------------------------------------------
    React.useEffect(() => {
        const onFocus = () => {
            paymentCardService = new PaymentCardServices();
        };
        const onBlur = () => {
            paymentCardService = null;
        };
        const unsubscribeFocus = navigation.addListener('focus', onFocus);
        const unsubscribeBlur = navigation.addListener('blur', onBlur);
        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [navigation]);
    //---------------------------------function--------------------------------------------------

    const handleIschooseBank = (item) => {
        setPreItem(item.code);
        setBankCode(item);
        setCheckTypeBank(true);
    };

    const navPayment = async () => {
        var date = new Date().getTime();
        if (checkTypeBank || bankCode && chooseTypeBank) {
            const params = {
                quantity: StaticData.chooseTypeSim.choose.quantity,
                itemCode: StaticData.chooseTypeSim.choose.code,
                orderCode: `${date}_${StaticData.chooseTypeSim.choose.code}_${StaticData.serialNumber}`,
                deviceId: StaticData.serialNumber
            }
            paymentCardService = new PaymentCardServices();
            var createOrder = await paymentCardService.createOrder(params);
            if (!createOrder.status) {
                if (StaticData.mantainanceType <= 2) {
                    StaticData.mantainanceType = 2;
                }
                navigation.navigate('MaintenanceScreen');
            } else {
                StaticData.chooseTypePayment = { infoBank: { productCode: chooseTypeBank.productCode, productName: chooseTypeBank.productName, bankCode: bankCode }, quantity: StaticData.chooseTypeSim.choose.quantity, orderCode: `${date}_${StaticData.chooseTypeSim.choose.code}_${StaticData.serialNumber}`, itemCode: StaticData.chooseTypeSim.choose.code, nameSim: StaticData.chooseTypeSim.name, code: StaticData.chooseTypeSim.code, itemCode: StaticData.chooseTypeSim.choose.code }
                navigation.navigate('PaymentCardScreen');
            }
        }
    }

    //---------------------------------child ui--------------------------------------------------
    const renderInfoPayment = React.useMemo(() => {
        return (
            <View style={{ marginTop: 50, }}>
                <View style={{ paddingHorizontal: 56 }}>
                    <Text style={{ color: '#FF2F48', fontSize: 48, fontWeight: 'bold' }}>{language == 'en' ? english.language.titleOrderPayment : vi.language.titleOrderPayment}</Text>
                    <Text style={{ color: 'black', fontSize: 36, marginTop: 40 }}>{language == 'en' ? english.language.inforPayment : vi.language.inforPayment}</Text>
                </View>
                <View style={{ width: 1080, height: 628, marginTop: 30, alignItems: 'center' }}>
                    <Image
                        style={{ width: 1060, height: 570, }}
                        source={require('../../Image/InformationSim.png')}
                    />
                    <View style={{ position: 'absolute', marginTop: 50, paddingHorizontal: 20 }}>
                        <View style={{ width: 857, height: 88, backgroundColor: '#EEFBF4', borderRadius: 16, justifyContent: 'center', }}>
                            <Text style={{ fontSize: 24, color: '#53D492', marginLeft: 30 }}>{language == 'en' ? english.language.notify + ` ${StaticData.chooseTypeSim.choose.quantity} ` + english.language.txtSL : vi.language.notify + ` ${StaticData.chooseTypeSim.choose.quantity} ` + vi.language.txtSL}</Text>
                        </View>
                        <View style={{ marginTop: 30, justifyContent: 'space-between', flexDirection: 'row' }}>
                            <View>
                                <Text style={{ fontSize: 25 }}>{language == 'en' ? english.language.package : vi.language.package}</Text>
                                <Text style={{ fontSize: 25, color: 'black' }}>{StaticData.chooseTypeSim.choose.code}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 25 }}>{language == 'en' ? english.language.quantity : vi.language.quantity}</Text>
                                <Text style={{ fontSize: 25, color: 'black' }}>{'x' + StaticData.chooseTypeSim.choose.quantity}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 25 }}>{language == 'en' ? english.language.subtotal : vi.language.subtotal}</Text>
                                <MoneyText style={{ fontSize: 25, color: 'black' }} value={StaticData.chooseTypeSim.choose.price?.vnd} delimiter={'.'} suffix={' VNĐ' + ` ~ ($${StaticData.chooseTypeSim.choose.price.usd})`} />
                            </View>
                        </View>
                        <View style={{ marginTop: 180, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 36, color: 'black' }}>{language == 'en' ? english.language.totalDue : vi.language.totalDue}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <MoneyText style={{ color: '#FF2F48', fontSize: 36, }} value={StaticData.chooseTypeSim.choose.price.vnd * StaticData.chooseTypeSim.choose.quantity} delimiter={'.'} suffix={' VNĐ'} />
                                <Text style={{ color: '#FF2F48', fontSize: 27, }}>{` ~ ($${StaticData.chooseTypeSim.choose.price.usd * StaticData.chooseTypeSim.choose.quantity})`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }, [language]);

    const renderSeeMore = React.useCallback((item) => {
        setCheckTypeBank(false);
        return (
            <View style={{ flexDirection: 'row', marginLeft: 35, marginVertical: 11, flexDirection: 'row', }}>
                <TouchableOpacity
                    style={{ width: 275, height: 96, backgroundColor: 'white', borderRadius: 15, alignItems: 'center', flexDirection: 'row', borderWidth: 2, borderColor: item.item.code == preItem ? '#FF2F48' : '#BDBFC6' }}
                    onPress={() => handleIschooseBank(item.item)}
                >
                    <View style={{ width: 48, height: 48, marginHorizontal: 16 }}>
                        <Image
                            style={{ width: 48, height: 48, }}
                            source={{ uri: item?.item?.icon }}
                        />
                    </View>
                    <Text style={{ fontSize: 24, color: 'black' }}>{item?.item.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }, [preItem, bankCode, checkTypeBank]);

    const renderMethodTypePayment = React.useMemo(() => {
        return (
            <View style={{ marginBottom: 180 }}>
                <Text style={{ fontSize: 36, color: 'black', marginLeft: 56 }}>{language == 'en' ? english.payment.paymentMethod : vi.payment.paymentMethod}</Text>
                {StaticData.dataResource.data.paymentTypeAvailables.map((item) =>
                    <View style={{
                        backgroundColor: 'white', borderRadius: 20, marginHorizontal: 56, marginVertical: 20, shadowColor: "#fffff",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 1.41,
                        elevation: 2,
                    }}>
                        <TouchableOpacity style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 35,

                        }}
                            onPress={() => { setChooseTypeBank(item), setBankCode(''), setPreItem(''), setCheckTypeBank(true) }}
                        >
                            <Text style={{ fontSize: 24, color: 'black', paddingVertical: 35 }}>{item.productName}</Text>
                            <View style={{ width: 40, height: 40, borderRadius: 20 }}>
                                {chooseTypeBank?.productCode == item?.productCode ?
                                    <Image source={require('../../Image/ischoosebank.png')} />
                                    :
                                    <Image source={require('../../Image/notchoosebank.png')} />
                                }
                            </View>
                        </TouchableOpacity>
                        {item?.bankCodes?.length > 0 && item?.productCode == chooseTypeBank?.productCode ?
                            <FlatList
                                style={{ marginBottom: 20 }}
                                numColumns={3}
                                data={item?.bankCodes}
                                renderItem={renderSeeMore}
                            />
                            :
                            null}
                    </View>
                )}
            </View>
        );
    }, [chooseTypeBank, preItem, bankCode, checkTypeBank]);

    const renderOrderPayment = React.useMemo(() => {
        return (
            <View style={{ width: 1080, height: 1608, position: 'absolute', marginTop: 216 }}>
                <View >
                    <Image style={{ position: 'absolute' }} source={require('../../Image/background.png')} />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {renderInfoPayment}
                        {renderMethodTypePayment}
                    </ScrollView>
                </View>
            </View>
        );
    }, [language, preItem, chooseTypeBank, bankCode, checkTypeBank]);

    const renderButtonHandlePayment = React.useMemo(() => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 60, bottom: 36, position: 'absolute', width: '100%', paddingVertical: 40, backgroundColor: 'white' }}>
                <TouchableOpacity style={{ width: 283, height: 72, borderRadius: 8, borderRadius: 8, borderWidth: 2, borderColor: '#FF2F48', justifyContent: 'center', alignItems: 'center', marginRight: 68 }}
                    activeOpacity={.7}
                    onPress={(() => goBack())}
                >
                    <Text style={{ color: '#FF2F48', fontSize: 24 }}>{language == 'en' ? english.button.back : vi.button.back}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 283, height: 72, borderRadius: 8, borderRadius: 8, backgroundColor: '#FF2F48', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => navPayment()}
                    activeOpacity={.7}
                >
                    <Text style={{ color: 'white', fontSize: 24 }}>{language == 'en' ? english.button.payment : vi.button.payment}</Text>
                </TouchableOpacity>
            </View>
        );
    }, [language, chooseTypeBank, bankCode, checkTypeBank]);

    const Bottom = React.useMemo(() => {
        return (
            <View style={{ bottom: 0, position: 'absolute' }}>
                <LinearGradient
                    colors={StaticData.chooseServices.code == 'LOCAL_SIM' ? StaticData.chooseServices.colorCode : StaticData.chooseServices.colorCode}
                    style={{ width: 1080, height: 96, alignItems: 'center', paddingLeft: 56, backgroundColor: '#FF2F48', flexDirection: 'row', paddingBottom: 9 }}
                >
                    <Image style={{ marginRight: 20 }} source={require('../../Image/telephone.png')} />
                    <Text style={{ fontSize: 28, color: 'white' }}>{"Hotline: " + StaticData.chooseServices?.hotLine}</Text>
                </LinearGradient>
            </View>
        );
    }, [language]);

    //---------------------------------return--------------------------------------------------
    return (
        <View
            onStartShouldSetResponder={() => StaticData.isActive = true}
            style={{ width: 1080, height: 1920, backgroundColor: '#FF2F48' }}>
            <Header
                value={StaticData.chooseTypeSim.code}
                colorCode={StaticData.chooseTypeSim.colorCode}
                props={navigation}
            />
            {renderOrderPayment}
            <Language style={{ position: 'absolute' }} />
            {renderButtonHandlePayment}
            {Bottom}
        </View>
    );
};
const mapStateToProps = state => {
    const { language } = state.language;
    return {
        language
    };
}
export default connect(mapStateToProps)(SelectPaymentMethodScreen);