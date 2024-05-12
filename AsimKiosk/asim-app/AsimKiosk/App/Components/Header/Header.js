import React from 'react';
import { View, Image, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute } from '@react-navigation/native';
import StaticData from '../../Variables/StaticData';
import { useFocusEffect } from '@react-navigation/native';

export default Header = (value) => {
    const route = useRoute();
    const { navigation } = value.props;

    useFocusEffect(
        React.useCallback(async () => {
            StaticData.routerName = route.name;
        }, [navigation])
    );
    return (
        <View>
            <LinearGradient
                colors={value?.value == 'LOCAL_SIM' ? value.colorCode : value.colorCode}
                style={{ width: 1080, height: 268 }} >
                <View style={{ marginTop: 90, marginHorizontal: 56, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            {value?.code == 'ChooseServicesScreen'?<Image source={{ uri: StaticData?.dataResource?.data?.icon }}
                                style={{ width: 481, height: 72 }}
                            />:<Image source={{ uri: StaticData?.chooseServices?.icon }}
                            style={{ width: value?.value == 'LOCAL_SIM' ? 181 : 252, height: value?.value == 'LOCAL_SIM' ? 80 : 84 }}
                        />}    
                    </View>
                </View>
            </LinearGradient>
        </View>

    );
};