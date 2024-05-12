import React from 'react';
import { Image, Text, TouchableOpacity, View, } from 'react-native';
import Header from '../../Components/Header/Header';
import Language from '../../Components/Header/Language';
import { connect } from 'react-redux';
import MoneyText from '../../Components/Money/MoneyText';
import { english, vi } from '../../Lib/Language';
import LinearGradient from 'react-native-linear-gradient';
import SignalRHub from '../../Utils/SignalRHub';
import StaticData from '../../Variables/StaticData';
import QRCode from 'react-native-qrcode-svg';
import PaymentCardServices from '../../Service/PaymentCardServices';

const PaymentCardScreen = props => {
    const { navigation, language } = props;
    const { goBack, } = navigation;
    const [Payment, setPayment] = React.useState();
    const [countDown, setCountDown] = React.useState('');
    var paymentCardServices;
    var interval = null;
    var formattedTime = null;
    var seconds = null;
    var transactionObjResult = null;

    React.useEffect(async () => {
        const onFocus = async () => {
            paymentCardServices = new PaymentCardServices();
            startCountdown();
            const params = {
                deviceId: StaticData.serialNumber,
                orderCode: StaticData.chooseTypePayment.orderCode,
                productCode: StaticData.chooseTypePayment.infoBank.productCode,
                bankCode: StaticData.chooseTypePayment.infoBank?.bankCode.code
            };
            var dataPaymentSession = await paymentCardServices.createPaymentSession(params);
            if (dataPaymentSession.status) {
                setPayment(dataPaymentSession);           
                SignalRHub.eventHandler = (data) => {
                    transactionObjResult = JSON.parse(data);
                    if (transactionObjResult.IsSuccess === false && transactionObjResult.OrderCode == StaticData.chooseTypePayment.orderCode) {
                       
                        navigation.navigate('ErrorPayment');

                    }
                    if (transactionObjResult.IsSuccess && transactionObjResult.OrderCode == StaticData.chooseTypePayment.orderCode) {
                       
                        navigation.navigate('PaymentSuccess');
                    }   
                }

                /*
                SignalRHub.addNotifyResultTransactionListener((data) => {
                    transactionObjResult = JSON.parse(data);
                    StaticData.tranNo = transactionObjResult.TransactionNumber;
                    console.log('transactionObjResult', transactionObjResult);
                    if (transactionObjResult.IsSuccess === false && transactionObjResult.OrderCode == StaticData.chooseTypePayment.orderCode) {
                        SignalRHub.removeNotifyResultTransactionListener();
                        navigation.navigate('ErrorPayment');

                    }
                    if (transactionObjResult.IsSuccess && transactionObjResult.OrderCode == StaticData.chooseTypePayment.orderCode) {
                        SignalRHub.removeNotifyResultTransactionListener();
                        navigation.navigate('PaymentSuccess');
                    }
                });
                */
            } else {
                navigation.navigate('ErrorPayment');
            }
        };
        const onBlur = () => {
            clearInterval(interval);
            transactionObjResult = null;
            //SignalRHub.removeNotifyResultTransactionListener();
            paymentCardServices = null;
            formattedTime = null;
            setCountDown(null);
            seconds = null;
        };
        const unsubscribeBlur = navigation.addListener('blur', onBlur);
        const unsubscribeFocus = navigation.addListener('focus', onFocus);
        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [navigation]);

    const startCountdown = () => {
        seconds = StaticData.dataResource.data.config.timeoutPayment / 1000;
        interval = setInterval(() => {
            seconds--;
            formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
            setCountDown(formattedTime);
            if (seconds <= 0) {
                SignalRHub.cancelOrder(StaticData.chooseTypePayment.orderCode);
                goBack();
                clearInterval(interval);
            }
        }, 1000);
    };

    const buttonGoBack = React.useCallback(() => {
        goBack();
    }, [Payment]);

    const PaymentCard = React.useMemo(() => {
        return (
            <View style={{ marginTop: 40, alignItems: 'center' }}>
                <View style={{
                    width: 968, height: 914, backgroundColor: 'white', borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5
                }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, color: '#9A9A9A' }}>{'Order code#' + StaticData.chooseTypePayment.orderCode}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                            <MoneyText style={{ fontSize: 36, color: '#FF2F48', fontWeight: '600', }} value={StaticData.chooseTypeSim.choose.price.vnd * StaticData.chooseTypePayment.quantity} delimiter={'.'} suffix={' VNĐ'} />
                            <Text style={{ fontSize: 24, color: '#FF2F48' }}>{` ~ ($${StaticData.chooseTypeSim.choose.price.usd * StaticData.chooseTypePayment.quantity})`}</Text>
                        </View>
                        <Text style={{ width: 718, fontSize: 24, textAlign: 'center', color: 'black', marginTop: 24 }} numberOfLines={2}>{language == 'en' ? english.payment.description : vi.payment.description}</Text>
                        <Text style={{ marginTop: 25, fontSize: 28, color: 'black' }}>{countDown}</Text>
                    </View>
                    <Image
                        style={{ height: 540, width: 786 }}
                        source={require('../../Image/PaymentCardVISA.png')}
                    />
                </View>

                <TouchableOpacity style={{ marginTop: 33, width: 283, height: 72, borderWidth: 2, borderColor: '#FF2F48', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                    activeOpacity={.7}
                    onPress={(() => buttonGoBack())}
                >
                    <Text style={{ color: '#FF2F48', fontSize: 24 }}>{language == 'en' ? english.button.back : vi.button.back}</Text>
                </TouchableOpacity>
            </View>
        )
    }, [language, countDown]);

    const PaymentHub = React.useMemo(() => {
        return (
            <View style={{ marginTop: 40, alignItems: 'center' }}>
                <View style={{
                    width: 968, height: 910, backgroundColor: 'white', borderRadius: 32, justifyContent: 'center', alignItems: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5
                }}>
                    <Text style={{ marginBottom: 86, fontSize: 35, color: 'black', textAlign: 'center', lineHeight: 36, fontWeight: 500 }}>{language === 'en' ? english.payment.txtScanQR : vi.payment.txtScanQR}</Text>
                    <View style={{ width: 500, height: 500 }}>
                        {Payment ?
                            <QRCode
                                value={Payment?.data?.payUrl}
                                size={500}
                                color="black"
                                backgroundColor="white"
                            />
                            :
                            null
                        }
                    </View>
                </View>
                <TouchableOpacity style={{ marginTop: 33, width: 283, height: 72, borderWidth: 2, borderColor: '#FF2F48', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                    activeOpacity={.7}
                    onPress={(() => buttonGoBack())}
                >
                    <Text style={{ color: '#FF2F48', fontSize: 24 }}>{language == 'en' ? english.button.back : vi.button.back}</Text>
                </TouchableOpacity>
            </View>
        );
    }, [Payment, language, countDown]);

    const renderPaymentGuide = React.useMemo(() => {
        return (
            <View style={{ marginTop: 56 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 36, color: 'black', fontWeight: '600' }}>{language == 'en' ? english.payment.paymentGuide : vi.payment.paymentGuide}</Text>
                    <Text style={{ fontSize: 24 }}>{language === 'en' ? english.payment.txtSecuredTransaction : vi.payment.txtSecuredTransaction}</Text>
                </View>
                {StaticData.chooseTypePayment.infoBank.bankCode ? PaymentHub : PaymentCard}

            </View>
        );
    }, [Payment, language, countDown]);

    const renderPaymentProcess = React.useMemo(() => {
        return (
            <View style={{ width: 1080, height: 1608, position: 'absolute', marginTop: 216, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: '#ffffff', paddingHorizontal: 56 }}>
                <View style={{ marginTop: 80 }}>
                    <Text style={{ color: '#FF2F48', fontSize: 48, fontWeight: 'bold' }}>{language == 'en' ? english.payment.paymentProcess : vi.payment.paymentProcess}</Text>
                    <Text style={{ marginTop: 56, fontSize: 36, color: 'black', fontWeight: '600' }}>{language == 'en' ? english.payment.paymentMethod : vi.payment.paymentMethod}</Text>
                </View>
                <View style={{
                    paddingVertical: 40, backgroundColor: 'white', marginTop: 40, borderRadius: 20,
                    shadowColor: "#000000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 1.41,
                    elevation: 2
                }}>
                    <View style={{ flexDirection: 'row', marginHorizontal: 48, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 44, height: 44, marginRight: 24 }}>
                                {StaticData.chooseTypePayment.infoBank.bankCode ?
                                    <Image
                                        style={{ width: 44, height: 44 }}
                                        source={{ uri: StaticData.chooseTypePayment.infoBank.bankCode.icon }} />
                                    :
                                    <Image
                                        style={{ width: 44, height: 44 }}
                                        source={require('../../Image/internetbank.png')}
                                    />
                                }
                            </View>
                            <Text style={{ fontSize: 24, color: 'black' }}>{StaticData.chooseTypePayment.infoBank.bankCode ? StaticData.chooseTypePayment.infoBank.bankCode.name : StaticData.chooseTypePayment.infoBank.productName}</Text>
                        </View>
                        <Image style={{ width: 40, height: 40 }}
                            source={require('../../Image/Mark.png')} />
                    </View>
                </View>
                {renderPaymentGuide}
            </View>
        );
    }, [Payment, language, countDown]);


    const Bottom = React.useMemo(() => {
        return (
            <View style={{ bottom: 0, position: 'absolute', }}>
                <LinearGradient
                    colors={StaticData.chooseTypePayment.code === 'LOCAL_SIM' ? StaticData.chooseTypeSim.colorCode : StaticData.chooseTypeSim.colorCode}
                    style={{ width: 1080, height: 96, justifyContent: 'center', paddingLeft: 56, backgroundColor: '#FF2F48' }}
                >
                    <Text style={{ fontSize: 28, color: 'white' }}>{"Hotline: " + StaticData.chooseServices?.hotLine}</Text>
                </LinearGradient>
            </View>
        );
    }, [language]);


    return (
        <View
            onStartShouldSetResponder={() => StaticData.isActive = true}
            style={{
                width: 1080, height: 1920,
                backgroundColor: '#FF2F48'
            }}>
            <Header
                value={StaticData.chooseTypePayment.code}
                colorCode={StaticData.chooseTypeSim.colorCode}
                props={navigation}
            />
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
}
export default connect(mapStateToProps)(PaymentCardScreen);