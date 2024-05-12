import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../Components/Header/Header';
import Language from '../../Components/Header/Language';
import { connect } from 'react-redux';
import MoneyText from '../../Components/Money/MoneyText'
import { english, vi } from '../../Lib/Language';
import LinearGradient from 'react-native-linear-gradient';
import StaticData from '../../Variables/StaticData';
import { ModalErrors } from '../../Components/Errors';
const PaymentSuccess = props => {
    const { navigation, language } = props;
    const [totalQuantity, setTotalQuantity] = React.useState(StaticData.chooseTypeSim.choose.quantity);
    const [price, setPrice] = React.useState(StaticData.chooseTypeSim.choose.price);
    const [errorsScreen, setErrorsScreen] = React.useState(true);
    var timer;
    React.useEffect(() => {
        timer = setInterval(() => {
            navigation.navigate('CollectSimCard');
        }, StaticData.timeOut);
        const onBlur = () => {
            clearInterval(timer);
        };
        const unsubscribeBlur = navigation.addListener('blur', onBlur);
        return () => {
            unsubscribeBlur();
        };
    }, [navigation]);

    const endShowModal = () => {
        setErrorsScreen(false);
    };

    /// child ui

    const PaymentCard = React.useMemo(() => {
        return (
            <View style={{ marginTop: 40, alignItems: 'center' }}>
                <View style={{
                    width: 968, height: 914, backgroundColor: 'white', borderRadius: 32, alignItems: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5
                }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, color: '#9A9A9A', marginTop: 56 }}>{'Order code#' + StaticData.chooseTypePayment.orderCode}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                            <MoneyText style={{ fontSize: 36, color: '#FF2F48', fontWeight: '600' }} value={price?.vnd * totalQuantity} delimiter={'.'} suffix={' VNĐ'} />
                            <Text style={{ fontSize: 24, color: '#FF2F48' }}>{` ~ ($${price?.usd * totalQuantity})`}</Text>
                        </View>
                        <View style={{ backgroundColor: '#EEFBF4', width: 857, height: 88, borderRadius: 16, justifyContent: 'center', marginTop: 32 }}>
                            <Text style={{ color: '#53D492', fontSize: 24, marginLeft: 40, fontWeight: '600' }}>{language == 'en' ? english.payment.paymentSuccessful : vi.payment.paymentSuccessful}</Text>
                        </View>
                    </View>
                    <Image
                        style={{ height: 540, width: 786, marginTop: 26, marginRight: 45, resizeMode: 'contain' }}
                        source={require('../../Image/PaymentProcess.png')}
                    />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 33 }}>
                    <TouchableOpacity style={{ width: 283, height: 72, borderRadius: 8, borderRadius: 8, backgroundColor: '#FF2F48', justifyContent: 'center', alignItems: 'center' }}
                        activeOpacity={.7}
                        onPress={() => navigation.navigate('CollectSimCard')}
                    >
                        <Text style={{ color: 'white', fontSize: 24 }}>{language == 'en' ? english.button.next : vi.button.next}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }, [totalQuantity, language]);

    const renderPaymentGuide = React.useMemo(() => {
        return (
            <View style={{ marginTop: 56 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 36, color: 'black', fontWeight: '600' }}>{language == 'en' ? english.payment.paymentGuide : vi.payment.paymentGuide}</Text>
                    <Text style={{ fontSize: 24 }}>{language === 'en' ? english.payment.txtSecuredTransaction : vi.payment.txtSecuredTransaction}</Text>
                </View>
                {PaymentCard}
            </View>
        );
    }, [totalQuantity, language]);

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
                                        source={{ uri: StaticData.chooseTypePayment.infoBank.bankCode.icon }}
                                    />
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
    }, [totalQuantity, language])

    const Bottom = React.useMemo(() => {
        return (
            <View style={{ bottom: 0, position: 'absolute'}}>
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
            {StaticData?.chooseTypePayment?.infoBank?.productCode === 'POS' ? <ModalErrors
                showErros={errorsScreen}
                closePopup={endShowModal}
                language={language}
            /> : null}
        </View>
    );
};
const mapStateToProps = state => {
    const { language } = state.language;
    return {
        language
    };
}
export default connect(mapStateToProps)(PaymentSuccess);