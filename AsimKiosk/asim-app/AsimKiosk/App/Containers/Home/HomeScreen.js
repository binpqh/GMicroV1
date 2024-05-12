import React from 'react';
import { View, Image, TouchableOpacity, FlatList } from 'react-native';
import { connect, } from 'react-redux';
import StaticData from '../../Variables/StaticData';
import RNFS from 'react-native-fs';
import Header from '../../Components/Header/Header';
// API
///////////////////==============================================;
const HomeScreen = props => {
  const { navigation, camera } = props;

  //====================================state================================
  const flatListRef = React.useRef(null);
  const currentIndexRef = React.useRef(0);
  const [intervalId, setIntervalId] = React.useState(null);
  //-----------------------------effect---------------------------
  React.useEffect(async () => {
    StaticData.navigation = navigation;
    if (!StaticData.dataResource.status) {
      if (StaticData.mantainanceType <= 2) {
        StaticData.mantainanceType = 2;
      }
      navigation.navigate('MaintenanceScreen');
    }
    const onFocus = () => {
      if (StaticData.video == 1) {
        StaticData.video = -1;
      }
    };
    const onBlur = () => {
    };
    const unsubscribeBlur = navigation.addListener('blur', onBlur);
    const unsubscribeFocus = navigation.addListener('focus', onFocus);
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (currentIndexRef.current + 1) % StaticData.dataResource.data.banners.length;
        flatListRef.current.scrollToIndex({
          animated: true,
          index: nextIndex
        });
        currentIndexRef.current = nextIndex;
      }
    }, StaticData.dataResource.data.config.timeoutBanner ?? 10000);
    return () => clearInterval(intervalId);
  }, [intervalId]);

  const handleScroll = (event) => {
    const currentIndex = Math.floor(event.nativeEvent.contentOffset.x / 1080);
    currentIndexRef.current = currentIndex;
  };
  //------------------------------func---------------------------------------
  const handleBuyNow = React.useCallback(() => {
    StaticData.time = 8;
    if (StaticData.dataResource.data.products) {
      navigation.navigate('ChooseServicesScreen');
      StaticData.video = 1;
    }
  }, [camera]);

  //------------------------------render child ui---------------------------------------

  const renderHomeScreen = React.useMemo(() => {
    const renderItem = ({ item, index }) => (
      <View style={{ width: 1080, alignItems: 'center' }}>
        <Image
          source={{ uri: `file://${RNFS.DocumentDirectoryPath}/${item}` }}
          style={{ width: 1080, height: 1920 }}
        />
      </View>
    );
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={StaticData.dataResource.data.banners}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onTouchStart={() => clearInterval(intervalId)}
        />
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 243, alignItems: 'center', width: '100%' }}
          onPress={() => handleBuyNow()}
          activeOpacity={0.7}
        >
          <Image
            style={{ width: 666, height: 114 }}
            source={require('../../Image/buyNowVNpass.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }, [camera, intervalId]);
  //------------------------------render ui-----------------------------
  return (
    <View
      onStartShouldSetResponder={() => StaticData.isActive = true}
      style={{ width: 1080, height: 1920, justifyContent: 'center', alignItems: 'center', }}>
      <Header value={'LOCAL_SIM'} colorCode={['#FF2F48', '#FF2F48']} props={navigation}/>
      <View style={{ position: 'absolute' }}>{renderHomeScreen}</View>
    </View>
  );
};

const mapStateToProps = state => {
  const { camera } = state
  const { language } = state.language;
  return {
    language,
    camera
  };
};
export default connect(mapStateToProps)(HomeScreen);
