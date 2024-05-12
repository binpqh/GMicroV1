import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../Components/Header/Header';
import Language from '../../Components/Header/Language';
import { connect } from 'react-redux';
import { english, vi } from '../../Lib/Language';
import LinearGradient from 'react-native-linear-gradient';

const ErrorsPrint = props => {
    const { navigation, language } = props;
    const { goBack } = navigation;

    var timer;
    React.useEffect(() => {
        timer = setInterval(() => {
            navigation.navigate('RattingScreen');
        }, StaticData.timeOut);
        const onBlur = () => {
            clearInterval(timer);
        };
        const unsubscribeBlur = navigation.addListener('blur', onBlur);
        return () => {
            unsubscribeBlur();
        };
    }, [navigation]);

    const renderRatting = React.useMemo(() => {
        return (
            <View
                style={{ width: 1080, height: 1608, position: 'absolute', marginTop: 216, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: '#ffffff', paddingHorizontal: 56, alignItems: 'center' }}
            >
                <View
                    style={{
                        backgroundColor: 'white', borderRadius: 20, marginTop: 81, shadowColor: '#000000',
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 1.41,
                        elevation: 2,
                        alignItems: 'center',
                        width: '100%'
                    }}>
                    <View style={{ paddingVertical: 142, paddingHorizontal: 139, alignItems: 'center' }}>
                        <Image source={require('../../Image/Oops.png')} />
                        <Text style={{ marginTop: 48, color: '#FF2F48', fontSize: 48, fontWeight: '700', textAlign: 'center' }}>{language === 'en' ? english.errors.txtTitleErrorsPrint : vi.errors.txtTitleErrorsPrint}</Text>
                        <Text style={{ marginTop: 24, marginBottom: 32, fontSize: 24, color: 'black' }}>{language === 'en' ? english.errors.txtDescriptionErrorsPrint : vi.errors.txtDescriptionErrorsPrint}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                    <TouchableOpacity style={{ marginTop: 48, width: 283, height: 72, backgroundColor: 'white', borderColor: '#FF2F48', borderWidth: 2, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => goBack()}
                    >
                        <Text style={{ fontSize: 24, color: '#FF2F48', }}>{language === 'en' ? english.button.errorBackToInvoices : vi.button.errorBackToInvoices}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 48, width: 283, height: 72, backgroundColor: '#FF2F48', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigation.navigate('RattingScreen')}
                    >
                        <Text style={{ fontSize: 24, color: 'white', }}>{language === 'en' ? english.button.errorOkThatFine : vi.button.errorOkThatFine}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }, [language]);

    const Bottom = React.useMemo(() => {
        return (
            <View style={{ bottom: 0, position: 'absolute', }}>
                <LinearGradient
                    colors={['#E0293F', '#E0293F']}
                    style={{ width: 1080, height: 720, paddingLeft: 56, backgroundColor: '#E0293F' }}
                >
                    <Text style={{ fontSize: 28, color: 'white' }}>{"Hotline: " + StaticData.chooseServices?.hotLine}</Text>
                </LinearGradient>
            </View>
        );
    }, [language]);

    return (
        <View
            style={{ width: 1080, height: 1920, backgroundColor: '#FF2F48', }}>
            <Header value={'LOCAL_SIM'} colorCode={['#FF2F48', '#FF2F48']} props={navigation} />
            {renderRatting}
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
export default connect(mapStateToProps)(ErrorsPrint);
