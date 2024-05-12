import React from 'react';
import { Text, View, Image } from 'react-native';
const hotline = {
    phone: ' Hotline: 19001900 - Line 1'
}
const SystemMaintenance = props => {

    const renderSystemMaintenance = React.useMemo(() => {
        return (
            <View>
                <View>
                    <Image
                        style={{ width: '100%', height: 494 }}
                        source={require('../Image/LogoSystemLocal.png')} />
                </View>
                <View style={{ marginTop: 346, alignItems: 'center', paddingHorizontal: 143 }}>
                    <Image source={require('../Image/Maintenance.png')} />
                    <Text style={{ marginTop: 32, color: '#E71F45', fontSize: 48, fontWeight: 700 }}>{"We’ll be right back!"}</Text>
                    <Text style={{ marginTop: 16, color: 'black', fontSize: 24, fontWeight: 400 }}>{"Sorry, we are down for maintenance but will be back in no time!"}</Text>
                </View>
            </View>
        )
    }, []);

    const Bottom = React.useMemo(() => {
        return (
            <View style={{ bottom: 0, position: 'absolute', width: 1080, height: 96, justifyContent: 'center', paddingLeft: 56, backgroundColor: '#FF2F48' }}>
                <Text style={{ fontSize: 28, color: 'white' }}>{hotline.phone}</Text>
            </View>
        );
    }, []);
    return (
        <View
            style={{
                width: 1080, height: 1920,
                backgroundColor: 'white',
                position: 'absolute'
            }}>
            {renderSystemMaintenance}
            {Bottom}
        </View>
    );
};
export default SystemMaintenance;