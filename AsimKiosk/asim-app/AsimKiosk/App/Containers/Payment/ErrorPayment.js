import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../Components/Header/Header';
import Language from '../../Components/Header/Language';
import { connect } from 'react-redux';
import StaticData from '../../Variables/StaticData';
import { english, vi } from '../../Lib/Language';

const ErrorPayment = props => {
    const { navigation, language } = props;
    const { goBack } = navigation;
    var timer = null;

    React.useEffect(() => {
        timer = setInterval(() => {
            navigation.navigate('SelectPaymentMethodScreen');
        }, StaticData.timeOut);
        const onBlur = () => {
            clearInterval(timer);
            timer = null;
        };
        const unsubscribeBlur = navigation.addListener('blur', onBlur);
        return () => {
            unsubscribeBlur();
        };
    }, [navigation]);

    /// child ui

    const renderPaymentError = React.useMemo(() => {
        return (
            <View style={{ width: 1080, height: 1608, position: 'absolute', marginTop: 216, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: '#ffffff', alignItems: 'center' }}>
                <View style={{
                    height: 720, width: 968, backgroundColor: 'white', marginTop: 269, borderRadius: 32, borderWidth: 2, borderColor: '#FF2F48', justifyContent: 'center', alignItems: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 5.84,
                    elevation: 10
                }}>
                    <Image
                        style={{ width: 140, height: 140 }}
                        source={require('../../Image/Oops.png')}
                    />
                    <View style={{ marginTop: 56, alignItems: 'center' }}>
                        <Text style={{ color: '#FF2F48', fontSize: 48, fontWeight: '700' }}>{'Oops!'}</Text>
                        <Text style={{ color: '#000000', fontSize: 24, marginTop: 26 }}>{language == 'en' ? english.payment.errorPayment : vi.payment.errorPayment}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 62 }}>
                    <TouchableOpacity style={{ width: 283, height: 72, borderRadius: 8, borderRadius: 8, borderWidth: 2, borderColor: '#FF2F48', justifyContent: 'center', alignItems: 'center', marginRight: 80 }}
                        activeOpacity={.7}
                        onPress={() => navigation.navigate('SelectPaymentMethodScreen')}
                    >
                        <Text style={{ color: '#FF2F48', fontSize: 24 }}>{language == 'en' ? english.button.txtCancel : vi.button.txtCancel}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: 283, height: 72, borderRadius: 8, borderRadius: 8, backgroundColor: '#FF2F48', justifyContent: 'center', alignItems: 'center' }}
                        activeOpacity={.7}
                        onPress={() => navigation.navigate('PaymentCardScreen')}
                    >
                        <Text style={{ color: 'white', fontSize: 24 }}>{language == 'en' ? english.button.txtTryAgain : vi.button.txtTryAgain}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }, [language]);

    const Bottom = React.useMemo(() => {
        return (
            <View style={{ bottom: 0, position: 'absolute', width: 1080, height: 96, justifyContent: 'center', marginLeft: 56 }}>
                <Text style={{ fontSize: 28, color: 'white' }}>{StaticData.chooseTypeSim.hotLine}</Text>
            </View>
        )
    }, []);

    return (
        <View
            style={{width: 1080, height: 1920,backgroundColor: '#FF2F48'}}>
            <Header value={'LOCAL_SIM'} colorCode={['#FF2F48', '#FF2F48']} props={navigation} />
            {renderPaymentError}
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
export default connect(mapStateToProps)(ErrorPayment);