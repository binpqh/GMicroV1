import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../Components/Header/Header';
import Language from '../../Components/Header/Language';
import { connect } from 'react-redux';
import { english, vi } from '../../Lib/Language';
import LinearGradient from 'react-native-linear-gradient';
import StaticData from '../../Variables/StaticData';
import ModalVideo from '../../Components/Camera/ModalVideo';
import QRCode from 'react-native-qrcode-svg';
import GlobalService from '../../Service/GlobalService';
import Utils from '../../Utils/Utils';

const RattingScreen = props => {
    const { navigation, language } = props;
    StaticData.captureVideo = true;

    const [defaultRating, setDefaultRating] = React.useState(0);
    const [maxRatting, setMaxRatting] = React.useState([1, 2, 3, 4, 5]);
    const [modalVideo, setModalVideo] = React.useState(false);
    const [isChooseOption, setIsChooseOption] = React.useState(true);
    var timer;
    var globalService;

    React.useEffect(() => {
        timer = setTimeout(() => {
            navigation.navigate('Home');
        }, StaticData.timeOut);

        const onFocus = () => {
            globalService = new GlobalService();
        };
        const onBlur = () => {
            clearTimeout(timer);
            Utils.resetStatic();
            StaticData.video = 2;
            globalService = null;
        };
        const unsubscribeFocus = navigation.addListener('focus', onFocus);
        const unsubscribeBlur = navigation.addListener('blur', onBlur);
        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        }
    }, [navigation]);

    const buttonHandleVideo = () => {
        setModalVideo(true)
    }
    const endShowModal = () => {
        setModalVideo(false);
    };

    const Star = React.useCallback(async (data) => {
        setDefaultRating(data)
        const raitting = {
            orderCode: StaticData.chooseTypePayment.orderCode,
            pointRating: data
        }
        await globalService.rattingApp(raitting);
        navigation.navigate('Home')
    }, [defaultRating, maxRatting])
    const renderRatting = React.useMemo(() => {
        return (
            <View
                style={{
                    width: 1080, height: 1608, position: 'absolute', marginTop: 216, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: '#ffffff', paddingHorizontal: 56, alignItems: 'center', justifyContent: StaticData.chooseTypePayment.code === 'LOCAL_SIM' ? 'flex-start' : 'center'
                }}>
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
                        alignItems: 'center'
                    }}>

                    <View style={{ paddingVertical: 110, paddingHorizontal: 139, alignItems: 'center' }}>
                        <Image source={require('../../Image/LoveIcon.png')} />
                        <Text style={{ marginTop: 48, color: '#FF2F48', fontSize: 48, fontWeight: '700', textAlign: 'center' }}>{language == 'en' ? english.ratting.txtTitle : vi.ratting.txtTitle}</Text>
                        <Text style={{ marginTop: 24, marginBottom: 32, fontSize: 24 }}>{language == 'en' ? english.ratting.txtFeedback : vi.ratting.txtFeedback}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {maxRatting.map((item, key) => {
                                return (
                                    <TouchableOpacity
                                        style={{ marginHorizontal: 17 }}
                                        activeOpacity={.7}
                                        onPress={() => Star(item)}

                                        key={item}
                                    >
                                        <Image style={{ width: 80, height: 80 }}
                                            source={item <= defaultRating ? require('../../Image/star.png') : require('../../Image/noStar.png')}
                                        />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={{ marginTop: 48, width: 283, height: 72, backgroundColor: 'white', borderColor: '#FF2F48', borderWidth: 2, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => { navigation.navigate('Home') }}
                >
                    <Text style={{ fontSize: 24, color: '#FF2F48', }}>{language == 'en' ? english.ratting.txtbutton : vi.ratting.txtbutton}</Text>
                </TouchableOpacity>
            </View>
        );
    }, [defaultRating, maxRatting, language]);

    const Bottom = React.useMemo(() => {
        return (
            <View style={{ bottom: 0, position: 'absolute', }}>
                {StaticData.chooseTypePayment.code === 'LOCAL_SIM' ? <LinearGradient
                    colors={['#E0293F', '#E0293F']}
                    style={{ width: 1080, height: 720, paddingHorizontal: 56, backgroundColor: '#E0293F', paddingVertical: 50 }}
                >
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 700, fontSize: 42, color: 'white' }}>{language === 'en' ? english.errors.txtBottomInstruct : vi.errors.txtBottomInstruct}</Text>
                        <TouchableOpacity style={{ backgroundColor: '#FFAC33', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}
                            onPress={() => buttonHandleVideo()}
                        >
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>{language === 'en' ? english.errors.txtButtonWatchMe : vi.errors.txtButtonWatchMe}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, paddingHorizontal: 6, marginTop: 38 }}>
                        <TouchableOpacity style={{ width: 478, height: 68, justifyContent: 'center', alignItems: 'center', backgroundColor: isChooseOption ? '#FFFFFF' : null, borderRadius: 16, }}
                            onPress={() => setIsChooseOption(true)}
                        >
                            <Text style={{ fontSize: 24, fontWeight: 700, color: isChooseOption ? 'black' : 'white' }}>{language === 'en' ? english.errors.txtButtonByApp : vi.errors.txtButtonByApp}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 478, height: 68, justifyContent: 'center', alignItems: 'center', backgroundColor: isChooseOption ? null : '#FFFFFF', borderRadius: 16 }}
                            onPress={() => setIsChooseOption(false)}
                        >
                            <Text style={{ fontSize: 24, fontWeight: 700, color: isChooseOption ? 'white' : 'black' }}>{language === 'en' ? english.errors.txtButtonByWebApp : vi.errors.txtButtonByWebApp}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: '100%', backgroundColor: '#FFFFFF', flexDirection: 'row', paddingTop: 8, borderRadius: 20, paddingBottom: 36, paddingHorizontal: 36, marginTop: 20, justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ color: '#FF2F48', fontSize: 48, fontWeight: 700, marginTop: 10, }}>{'01'}<Text style={{ fontSize: 36, fontWeight: 600, color: '#FF2F48', }}>{isChooseOption ? language === 'en' ? english.errors.txtDownloadApp : vi.errors.txtDownloadApp : language === 'en' ? english.errors.txtScanQRCode : vi.errors.txtScanQRCode}</Text></Text>
                            {isChooseOption ?
                                <View>
                                    <View style={{ marginLeft: 50, marginTop: 16 }}>
                                        {StaticData.dataResource.data?.activeSimInfo.barCodeUrl ?
                                            <QRCode
                                                value={StaticData.dataResource.data?.activeSimInfo.barCodeUrl}
                                                size={175}
                                                color="black"
                                                backgroundColor="white"
                                            />
                                            :
                                            null
                                        }
                                    </View>
                                    <Text style={{ marginTop: 16, fontSize: 18, fontWeight: 700, color: 'black' }}>{language === 'en' ? english.errors.txtUseCameraScanQR : vi.errors.txtUseCameraScanQR}</Text>
                                    <Text style={{ color: 'black', fontSize: 18, fontWeight: 500 }}>{language === 'en' ? english.errors.txtOrAccessTo : vi.errors.txtOrAccessTo}<Text style={{ fontSize: 18, fontWeight: 700, color: '#FF2F48' }}>{language === 'en' ? english.errors.txtLink : vi.errors.txtLink}</Text></Text>
                                </View>
                                :
                                <View>
                                    <Image
                                        source={require('../../Image/BYWEBAPP.png')}
                                        style={{ width: 283, height: 180, marginTop: 26 }}
                                    />
                                    <Text style={{ fontSize: 18, fontWeight: 700, color: 'black', marginTop: 26 }}>{language === 'en' ? english.errors.txtInfo01ByWebApp : vi.errors.txtInfo01ByWebApp}<Text style={{ fontSize: 18, fontWeight: 500, color: '#FF2F48' }}>{language === 'en' ? english.errors.txtYourSIM : vi.errors.txtYourSIM}</Text></Text>
                                </View>

                            }
                        </View>
                        {isChooseOption ?
                            <View style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../Image/BYAPP02.png')}
                                        style={{ width: 86, height: 93, marginRight: 22, marginLeft: 5 }}
                                    />
                                    <View style={{}}>
                                        <Text style={{ color: '#FF2F48', fontSize: 48, fontWeight: 700 }}>{'02'}</Text>
                                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 500, lineHeight: 22, width: 365 }}>{language === 'en' ? english.errors.txtByApp02 : vi.errors.txtByApp02}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <Image
                                        source={require('../../Image/BYWEBAPP02.png')}
                                        style={{ width: 67, height: 93, marginRight: 42 }}
                                    />
                                    <View style={{}}>
                                        <Text style={{ color: '#FF2F48', fontSize: 48, fontWeight: 700 }}>{'03'}</Text>
                                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 500, lineHeight: 22, width: 365 }}>{language === 'en' ? english.errors.txtByApp03 : vi.errors.txtByApp03}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 10 }}>
                                    <Image
                                        source={require('../../Image/BYWEBAPP03.png')}
                                        style={{ width: 96, height: 93 }}
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ color: '#FF2F48', fontSize: 48, fontWeight: 700 }}>{'04'}</Text>
                                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 500, lineHeight: 22, width: 319 }}>{language === 'en' ? english.errors.txtByWebApp03 : vi.errors.txtByWebApp03}</Text>
                                    </View>
                                </View>
                            </View>
                            :
                            <View style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../Image/BYWEBAPP02.png')}
                                        style={{ width: 67, height: 93, marginRight: 36 }}
                                    />
                                    <View style={{}}>
                                        <Text style={{ color: '#FF2F48', fontSize: 48, fontWeight: 700 }}>{'02'}</Text>
                                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 500, lineHeight: 22, width: 365 }}>{language === 'en' ? english.errors.txtByWebApp02 : vi.errors.txtByWebApp02}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 36, marginLeft: 10 }}>
                                    <Image
                                        source={require('../../Image/BYWEBAPP03.png')}
                                        style={{ width: 96, height: 93 }}
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ color: '#FF2F48', fontSize: 48, fontWeight: 700 }}>{'03'}</Text>
                                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 500, lineHeight: 22, width: 319 }}>{language === 'en' ? english.errors.txtByWebApp03 : vi.errors.txtByWebApp03}</Text>
                                    </View>
                                </View>
                            </View>
                        }
                    </View>
                    <Text style={{ fontSize: 28, color: 'white', marginTop: 30 }}>{"Hotline: " + StaticData.chooseServices?.hotLine}</Text>
                </LinearGradient>
                    :
                    <LinearGradient
                        colors={StaticData.chooseTypeSim.colorCode}
                        style={{ width: 1080, height: 96, justifyContent: 'center', paddingLeft: 56, backgroundColor: '#FF2F48' }}
                    >
                        <Text style={{ fontSize: 28, color: 'white' }}>{"Hotline: " + StaticData.chooseServices?.hotLine}</Text>
                    </LinearGradient>}
            </View>
        );
    }, [language, isChooseOption, modalVideo, language]);

    return (
        <View
            style={{ width: 1080, height: 1920, backgroundColor: '#FF2F48', }}>
            <Header
                value={StaticData.chooseTypePayment.code}
                colorCode={StaticData.chooseTypeSim.colorCode}
                props={navigation}
            />
            {renderRatting}
            <Language style={{ position: 'absolute' }} />
            {Bottom}
            <ModalVideo
                showErros={modalVideo}
                closePopup={endShowModal}
            />
        </View>
    );
};
const mapStateToProps = state => {
    const { language } = state.language;
    return {
        language
    };
};
export default connect(mapStateToProps)(RattingScreen);
