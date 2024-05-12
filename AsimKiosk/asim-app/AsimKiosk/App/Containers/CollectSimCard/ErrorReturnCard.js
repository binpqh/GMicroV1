import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../Components/Header/Header';
import Language from '../../Components/Header/Language';
import { connect } from 'react-redux';
import StaticData from '../../Variables/StaticData';
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from 'react-native-linear-gradient';
import { english, vi } from '../../Lib/Language';

const ErrorReturnCard = props => {
    const { navigation, language } = props;
    var timer;
    React.useEffect(() => {
        timer = setInterval(() => {
            navigation.navigate('PrintInvoiceScreen');
        }, StaticData.timeOut);
        const onBlur = () => {
            clearInterval(timer);
        };
        const unsubscribeBlur = navigation.addListener('blur', onBlur);
        return () => {
            unsubscribeBlur();
        };
    }, [navigation]);

    /// child ui

    const renderErrorReturnCard = React.useMemo(() => {
        return (
            <View style={{ width: 1080, height: 1608, position: 'absolute', marginTop: 216, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: '#ffffff', alignItems: 'center', paddingHorizontal: 56 }}>
                <View style={{
                    width: '100%', backgroundColor: 'white', marginTop: 72, borderRadius: 32, borderColor: '#FF2F48', justifyContent: 'center', alignItems: 'center', paddingVertical: 72, paddingHorizontal: 156,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 0.65,
                    elevation: 7
                }}>
                    <Image
                        style={{ width: 140, height: 140 }}
                        source={require('../../Image/Oops.png')}
                    />
                    <View style={{ marginTop: 46, alignItems: 'center', paddingHorizontal: 24 }}>
                        <Text style={{ color: '#FF2F48', fontSize: 48, fontWeight: '700' }}>{language === 'en' ? english.errors.txtTitleError : vi.errors.txtTitleError}</Text>
                        <Text style={{ color: '#000000', fontSize: 24, marginTop: 24, textAlign: 'center' }}>{language === 'en' ? english.errors.txtDescriptionError : vi.errors.txtDescriptionError}</Text>
                    </View>
                    <View style={{ backgroundColor: '#FFF5F5', flexDirection: 'row', paddingHorizontal: 40, paddingVertical: 40, marginTop: 48, borderRadius: 16 }}>
                        <Text style={{ color: '#000', fontSize: 24, width: 173 }}>{language === 'en' ? english.errors.txtError : vi.errors.txtError}</Text>
                        <Text style={{ color: '#FF2F48', fontSize: 24, width: 396 }}>{language === 'en' ? english.errors.txtInfoError : vi.errors.txtInfoError}</Text>
                    </View>

                    <View style={{ paddingVertical: 40, paddingHorizontal: 40, borderRadius: 16, borderWidth: 1, borderColor: '#C5C5C5', marginTop: 48 }}>
                        <Text style={{ color: '#000', fontSize: 28, fontWeight: '600' }}>{language === 'en' ? english.errors.txtInfoPaymentError : vi.errors.txtInfoPaymentError}</Text>
                        <View style={{ flexDirection: 'row', width: 577, justifyContent: 'space-between' }}>
                            <View style={{ marginTop: 32 }}>
                                <Text style={{ color: '#808080', fontSize: 24, }}>{language === 'en' ? english.errors.txtPaymentNo : vi.errors.txtPaymentNo}</Text>
                                <Text style={{ color: '#808080', fontSize: 24, marginTop: 24 }}>{language === 'en' ? english.errors.txtOrderNo : vi.errors.txtOrderNo}</Text>
                                <Text style={{ color: '#808080', fontSize: 24, marginTop: 24 }}>{language === 'en' ? english.errors.txtKioskNo : vi.errors.txtKioskNo}</Text>
                            </View>
                            <View style={{ marginTop: 32, alignItems: 'flex-end' }}>
                                <Text style={{ color: '#000', fontSize: 24, }}>{StaticData.tranNo}</Text>
                                <Text style={{ color: '#000', fontSize: 24, marginTop: 24 }}>{StaticData.chooseTypePayment.orderCode}</Text>
                                <Text style={{ color: '#000', fontSize: 24, marginTop: 24 }}>{StaticData.serialNumber}</Text>
                            </View>
                        </View>
                        <View style={{ width: 577, height: 1, backgroundColor: '#C5C5C5', marginVertical: 40 }} />

                        <Text style={{ color: '#000', fontSize: 28, fontWeight: '600' }}>{language === 'en' ? english.errors.txtSupportRequirement : vi.errors.txtSupportRequirement}</Text>
                        <View style={{ marginTop: 32, flexDirection: 'row' }}>
                            <View>
                                <QRCode
                                    value={StaticData.chooseServices.qrContactUrl}
                                    size={175}
                                    color="black"
                                    backgroundColor="white"
                                />
                                <Text style={{ fontSize: 18, width: 182, color: '#000', fontWeight: 600, marginTop: 12 }}>{language === 'en' ? english.errors.txtScanQRCode : vi.errors.txtScanQRCode}<Text style={{ fontWeight: 400 }}>{language === 'en' ? english.errors.txtSupport : vi.errors.txtSupport}</Text></Text>
                            </View>
                            <View style={{ marginLeft: 56 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        style={{ width: 48, height: 48, }}
                                        source={require('../../Image/iconPhone.png')}
                                    />
                                    <View style={{ marginLeft: 24 }}>
                                        <Text style={{ fontSize: 24, color: '#737377' }}>{language === 'en' ? english.errors.txtHotline : vi.errors.txtHotline}</Text>
                                        <Text style={{ fontSize: 24, color: '#000', marginTop: 5 }}>{StaticData.chooseServices.hotLine}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24 }}>
                                    <Image
                                        style={{ width: 48, height: 48, }}
                                        source={require('../../Image/iconMail.png')}
                                    />
                                    <View style={{ marginLeft: 24 }}>
                                        <Text style={{ fontSize: 24, color: '#737377' }}>{language === 'en' ? english.errors.txtEmail : vi.errors.txtEmail}</Text>
                                        <Text style={{ fontSize: 24, color: '#000', marginTop: 5 }}>{StaticData.chooseServices.email}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>

                </View>
                <TouchableOpacity style={{ width: 283, height: 72, borderRadius: 8, borderRadius: 8, borderWidth: 2, borderColor: '#FF2F48', justifyContent: 'center', alignItems: 'center',backgroundColor: 'white', marginTop: 35 }}
                    activeOpacity={.7}
                    onPress={() => navigation.navigate('PrintInvoiceScreen')}
                >
                    <Text style={{ color: '#FF2F48', fontSize: 24 }}>{'OK'}</Text>
                </TouchableOpacity>
            </View>
        )
    }, [language]);

    const Bottom = React.useMemo(() => {
        return (
            <View style={{ bottom: 0, position: 'absolute', }}>
                <LinearGradient
                    colors={StaticData.chooseServices.code == 'LOCAL_SIM' ? StaticData.chooseServices.colorCode : StaticData.chooseServices.colorCode}
                    style={{ width: 1080, height: 96, justifyContent: 'center', paddingLeft: 56, backgroundColor: '#FF2F48' }}
                >
                    <Text style={{ fontSize: 28, color: 'white' }}>{"Hotline: " + StaticData.chooseServices?.hotLine}</Text>
                </LinearGradient>
            </View>
        )
    }, [language]);

    return (
        <View
            style={{
                width: 1080, height: 1920,
                backgroundColor: '#FF2F48'
            }}>

            <Header value={StaticData.chooseTypePayment.nameSim} colorCode={StaticData.chooseTypeSim.colorCode} props={navigation} />
            {renderErrorReturnCard}
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
export default connect(mapStateToProps)(ErrorReturnCard);