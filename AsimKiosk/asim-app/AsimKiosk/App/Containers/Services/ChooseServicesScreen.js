import React from 'react';
import { Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Header from '../../Components/Header/Header';
import Language from '../../Components/Header/Language';
import { connect } from 'react-redux';
import { english, vi } from '../../Lib/Language';
import StaticData from '../../Variables/StaticData';
import RNFS from 'react-native-fs';
import GlobalService from '../../Service/GlobalService';
import SimService from '../../Service/SimService';

const ChooseServicesScreen = props => {
  const { navigation, language } = props;
  const { goBack } = navigation;

  //---------------------------------state--------------------------------------------------
  const [products, setProducts] = React.useState(StaticData.dataResource.data.products);
  var simService;
  var globalService;
  //---------------------------------effect--------------------------------------------------
  React.useEffect(() => {
    const onFocus = () => {
      simService = new SimService();
      globalService = new GlobalService();
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

  //---------------------------------function--------------------------------------------------

  const handleChooseSim = React.useCallback(async (simType) => {
    var checkQuantity = await globalService.checkQuantity();
    var chekSimServices = simService.chooseTypeServices(simType, checkQuantity);
    if (!checkQuantity.status) {
      if (StaticData.mantainanceType <= 2) {
        StaticData.mantainanceType = 2;
      }
      navigation.navigate('MaintenanceScreen');
    } else {
      if (chekSimServices) {
        navigation.navigate('ChooseTypeServicesScreen');
      }
    }
  }, []);

  //---------------------------------child ui--------------------------------------------------
  const renderSim = React.useMemo(() => {
    return (
      <View style={{ width: 1080, height: 1608, position: 'absolute', marginTop: 216, borderTopLeftRadius: 50, borderTopRightRadius: 50, alignItems: 'center' }}>
        <Image
          source={require('../../Image/bgIsChooseServices.png')}
        />
        <View style={{ position: 'absolute', width: 1080, height: 1558, alignItems: 'center' }}>
          <ScrollView style={{ paddingTop: 80 }}>
            {products.map(item => (
              <View style={{ paddingHorizontal: 56, }}>
                <Text style={{ fontSize: 40, color: 'white', marginBottom: 24 }}>
                  {language == 'en'
                    ? item?.lang?.en?.product_title
                    : item?.lang?.vi?.product_title}
                </Text>
                <View>
                  <Image
                    source={{
                      uri:
                        language == 'en' ?
                          `file://${RNFS.DocumentDirectoryPath}/${item?.lang?.en?.imageKey}`
                          :
                          `file://${RNFS.DocumentDirectoryPath}/${item?.lang?.vi?.imageKey}`,
                    }}
                    style={{ width: 968, height: 466, marginBottom: 40, resizeMode: 'stretch', borderRadius: 20 }}
                  />
                  <TouchableOpacity
                    style={{ width: 210, height: 68, position: 'absolute', bottom: 120, left: 433, backgroundColor: '#C8EB4B', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => handleChooseSim(item)}
                  >
                    <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A1A1A' }}>
                      {language == 'en' ? 'BUY NOW!' : 'MUA NGAY!'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={{ width: 283, height: 72,justifyContent: 'center', alignItems: 'center', marginTop: 50 }}
            activeOpacity={0.7}
            onPress={() => { goBack() }}
          >
            <Text style={{ color: 'white', fontSize: 24 }}>{language == 'en' ? english.button.back : vi.button.back}</Text>
            <Image style={{position:'absolute'}} source={require('../../Image/buttonbackwhite.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [language]);

  const Bottom = React.useMemo(() => {
    return (
      <View
        style={{ bottom: 0, position: 'absolute', width: 1080, height: 96, marginLeft: 56,flexDirection:'row',alignItems:'center',marginBottom:9}}>
          <Image style={{marginRight:20}} source={require('../../Image/telephone.png')}/>
        <Text style={{ fontSize: 28, color: 'white' }}>{"Hotline: " + '19001900 - Line 1'}</Text>
      </View>
    );
  }, []);

  //---------------------------------return--------------------------------------------------
  return (
    <View style={{ width: 1080, height: 1920, backgroundColor: '#FF2F48' }}
      onStartShouldSetResponder={() => StaticData.isActive = true}
    >
      <Header value={'LOCAL_SIM'} colorCode={['#FF2F48', '#FF2F48']} props={navigation} code={'ChooseServicesScreen'} />
      {renderSim}
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
export default connect(mapStateToProps)(ChooseServicesScreen);
