import React from 'react';
import { Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Header from '../../Components/Header/Header';
import Language from '../../Components/Header/Language';
import { connect } from 'react-redux';
import MoneyText from '../../Components/Money/MoneyText';
import { english, vi } from '../../Lib/Language';
import LinearGradient from 'react-native-linear-gradient';
import StaticData from '../../Variables/StaticData';
import Utils from '../../Utils/Utils';
import SimService from '../../Service/SimService';

const ChooseTypeServicesScreen = props => {
    const { navigation, language } = props;
    const { goBack } = navigation;
    //---------------------------------state--------------------------------------------------
    const [sumSim, setSumSim] = React.useState(5);
    const [renderUI, setRenderUI] = React.useState(false);

    //---------------------------------effect--------------------------------------------------
    var simService;
    React.useEffect(() => {

        const onFocus = () => {
            simService = new SimService();
        };
        const onBlur = () => {
            simService = null
        };
        const unsubscribeFocus = navigation.addListener('focus', onFocus);
        const unsubscribeBlur = navigation.addListener('blur', onBlur);
        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [navigation]);

    //---------------------------------function--------------------------------------------------
    const handleOrder = React.useCallback((item) => {
        if (Utils.isArray(StaticData.dataResource.data.paymentTypeAvailables, true)) {
            StaticData.chooseTypeSim = ({ choose: item, code: StaticData.chooseServices.code, hotLine: StaticData.chooseServices.hotLine, name: StaticData.chooseServices.name, icon: StaticData.chooseServices.icon, colorCode: StaticData.chooseServices.colorCode });
            navigation.navigate('SelectPaymentMethodScreen');
        }
    }, []);
    ///  
    const countSim = React.useCallback((selectedItem) => {
        simService = new SimService();
        simService.countQuantitySim(selectedItem);
        setRenderUI(!renderUI);
    }, [renderUI]);

    const minusSim = React.useCallback((selectedItem) => {
        simService = new SimService();
        simService.minusQuantitySim(selectedItem);
        setRenderUI(!renderUI);
    }, [renderUI]);

    //---------------------------------child ui--------------------------------------------------


    const renderItemServices = React.useMemo(() => {
        return (
            <View style={{ width: 1080, height: 1608, position: 'absolute', marginTop: 216 }}>
                <Image source={require('../../Image/background.png')} />
                <View style={{ position: 'absolute', width: '100%', height: 1560, marginLeft: 48 }}>
                    <ScrollView style={{ paddingTop: 80 }}>
                        {StaticData.chooseServices.lang?.en.heading?.title == '' ?
                            null
                            :
                            <Text style={{ fontSize: 48, color: '#FF2F48', fontWeight: 'bold' }}>{language == 'en' ? StaticData.chooseServices.lang?.en.heading?.title : StaticData.chooseServices.lang?.vi.heading?.title}</Text>
                        }
                        {StaticData.chooseServices.lang?.en.heading?.title == '' ?
                            null
                            :
                            <Text style={{ fontSize: 48, color: 'black', fontWeight: 'bold', paddingTop: 45 }}>{language == 'en' ? StaticData.chooseServices.lang?.en.heading?.sub_title : StaticData.chooseServices.lang?.vi.heading?.sub_title}</Text>
                        }
                        {language == 'en' ? StaticData.chooseServices.lang?.en.heading?.description.map((item) =>
                            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
                                <Image style={{ width: 40, height: 40 }} source={require('../../Image/arrow_right.png')} />
                                <Text style={{ fontSize: 24, color: 'black' }}>{item}</Text>
                            </View>
                        )
                            :
                            StaticData.chooseServices.lang?.vi.heading?.description.map((item) =>
                                <View style={{ flexDirection: 'row', paddingTop: 20 }}>
                                    <Image style={{ width: 40, height: 40, paddingTop: 20 }} source={require('../../Image/arrow_right.png')} />
                                    <Text style={{ fontSize: 24, color: 'black' }}>{item}</Text>
                                </View>
                            )}
                        {StaticData.chooseServices.code === 'LOCAL_SIM' ?
                            <Text style={{ fontSize: 36, color: 'black', fontWeight: 'bold', paddingVertical: 40 }}>{language == 'en' ? english.language.selectSim : vi.language.selectSim}</Text>
                            :
                            <Text style={{ fontSize: 36, color: 'black', marginBottom: 20 }}>{language == 'en' ? english.language.selectTicket : vi.language.selectTicket}</Text>}
                        {language == 'en' ? StaticData.chooseServices.lang.en.items.map((item) =>


                            <View style={{
                                width: 970, backgroundColor: '#FFFFFF', borderRadius: 32,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 3,
                                },
                                shadowOpacity: 0.27,
                                shadowRadius: 4.65,
                                elevation: 6,
                                paddingHorizontal: 35, paddingVertical: 35,
                                marginBottom: 64,
                                marginLeft: 12
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: 620 }}>
                                        <Text style={{ fontSize: 18, color: 'black' }}>{item.title}</Text>
                                        <Text style={{ fontSize: 48, color: 'black', fontWeight: 700 }}>{item.code}</Text>
                                        <Text style={{ marginTop: 24, fontSize: 18, color: 'black' }}>{item.description.title}</Text>
                                        {item.description.content.map((ite) =>
                                            <Text style={{ color: 'black', fontSize: 24 }}>{'.' + ite}</Text>
                                        )}
                                        <Text style={{ fontSize: 20, marginTop: 24 }}>{item?.note}</Text>
                                        <Text style={{ fontSize: 18, color: 'black', marginTop: 24 }}>{english.language.price + ':'}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <MoneyText style={{ color: '#FF2F48', fontSize: 36, fontWeight: '600' }} value={item.price.vnd} delimiter={'.'} suffix={' VND'} />
                                            <Text style={{ color: 'black', fontSize: 20 }}>{` (~ $${item.price.usd})`}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Image resizeMode='contain' style={{ height: 255, width: 200 }} source={{ uri: item.icon }} />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 64 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center', opacity: item.quantity == 1 ? .3 : null }}
                                            activeOpacity={.7}
                                            onPress={(() => item.quantity > 1 ? minusSim(item) : null)}
                                        >
                                            <Image source={require('../../Image/remove.png')} />
                                        </TouchableOpacity>
                                        <View style={{ width: 204, height: 72, marginHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={require('../../Image/borderquantity.png')} />
                                            <Text style={{ fontSize: 30, color: 'black', position: 'absolute' }}>{item?.quantity}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center', opacity: item.quantity == sumSim ? .3 : null }}
                                            activeOpacity={.7}
                                            onPress={() => item.quantity < sumSim ? countSim(item) : null}
                                        >
                                            <Image source={require('../../Image/plus.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={{ width: 416, height: 72, justifyContent: 'center', alignItems: 'center' }}
                                        activeOpacity={.7}
                                        onPress={(() => handleOrder(item))}
                                    >
                                        <Image source={require('../../Image/buttonbynow.png')} />
                                        <Text style={{ fontSize: 24, color: 'white', position: 'absolute' }}>{language == 'en' ? english.button.buyNow : vi.button.buyNow}</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                        )
                            :
                            StaticData.chooseServices.lang?.vi.items.map((item) =>
                                <View style={{
                                    width: 970, backgroundColor: '#FFFFFF', borderRadius: 32,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 3,
                                    },
                                    shadowOpacity: 0.27,
                                    shadowRadius: 4.65,
                                    elevation: 6,
                                    paddingHorizontal: 35, paddingVertical: 35,
                                    marginBottom: 64,
                                    marginLeft: 12
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ width: 620 }}>
                                            <Text style={{ fontSize: 18, color: 'black' }}>{item.title}</Text>
                                            <Text style={{ fontSize: 48, color: 'black', fontWeight: 700 }}>{item.code}</Text>
                                            <Text style={{ marginTop: 24, fontSize: 18, color: 'black' }}>{item.description.title}</Text>
                                            {item.description.content.map((ite) =>
                                                <Text style={{ color: 'black', fontSize: 24 }}>{'.' + ite}</Text>
                                            )}
                                            {item?.note == '' ? null : <Text style={{ fontSize: 20, marginTop: 24 }}>{item?.note}</Text>}
                                            <Text style={{ fontSize: 18, color: 'black', marginTop: 24 }}>{english.language.price + ':'}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                                <MoneyText style={{ color: '#FF2F48', fontSize: 36, fontWeight: '600' }} value={item.price.vnd} delimiter={'.'} suffix={' VND'} />
                                                <Text style={{ color: 'black', fontSize: 20 }}>{` (~ $${item.price.usd})`}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Image resizeMode='contain' style={{ height: 255, width: 200 }} source={{ uri: item.icon }} />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 64 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity
                                                style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center', opacity: item.quantity == 1 ? .3 : null }}
                                                activeOpacity={.7}

                                                onPress={(() => item.quantity > 1 ? minusSim(item) : null)}
                                            >
                                                <Image source={require('../../Image/remove.png')} />
                                            </TouchableOpacity>
                                            <View style={{ width: 204, height: 72, marginHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image source={require('../../Image/borderquantity.png')} />
                                                <Text style={{ fontSize: 30, color: 'black', position: 'absolute' }}>{item.quantity}</Text>
                                            </View>
                                            <TouchableOpacity
                                                style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center', opacity: item.quantity == sumSim ? .3 : null }}
                                                activeOpacity={.7}
                                                onPress={() => item.quantity < sumSim ? countSim(item) : null}
                                            >
                                                <Image source={require('../../Image/plus.png')} />
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity
                                            style={{ width: 416, height: 72, justifyContent: 'center', alignItems: 'center' }}
                                            activeOpacity={.7}
                                            onPress={(() => handleOrder(item))}
                                        >
                                            <Image source={require('../../Image/buttonbynow.png')} />
                                            <Text style={{ fontSize: 24, color: 'white', position: 'absolute' }}>{language == 'en' ? english.button.buyNow : vi.button.buyNow}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                    </ScrollView>
                    <View style={{ width: 990, backgroundColor: 'white', alignItems: 'center', paddingTop: 48 }}>
                        <TouchableOpacity style={{ width: 283, height: 72, justifyContent: 'center', alignItems: 'center' }}
                            activeOpacity={.7}
                            onPress={(() => goBack())}
                        >
                            <Image source={require('../../Image/buttonborder.png')} />
                            <Text style={{ color: '#FF2F48', fontSize: 24, position: 'absolute' }}>{language == 'en' ? english.button.back : vi.button.back}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }, [language, renderUI]);

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
            style={{
                width: 1080, height: 1920,
                backgroundColor: '#FF2F48'
            }}>
            <Header value={StaticData.chooseServices.code} colorCode={StaticData.chooseServices.colorCode} props={navigation} />
            {renderItemServices}
            <Language style={{ position: 'absolute' }} />
            {Bottom}
        </View>
    );
};
const mapStateToProps = state => {
    const { language } = state.language;
    const { camera } = state
    return {
        language,
        camera
    }
}
export default connect(mapStateToProps)(ChooseTypeServicesScreen);