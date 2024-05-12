import React from 'react';
import { View, Modal, TouchableOpacity, Image } from 'react-native';
import Video from 'react-native-video';
import StaticData from '../../Variables/StaticData';

const ModalVideo = (props) => {
    const { showErros, closePopup } = props;
    return (
        <Modal
            transparent={true}
            visible={showErros}
        >
            <View style={{ flex: 1, backgroundColor: '#000000AA', justifyContent: 'center' }}>
                <TouchableOpacity style={{ marginBottom: 58, marginLeft: 56 }}
                    onPress={() => closePopup()}
                >
                    <Image
                        style={{ width: 32, height: 32 }}
                        source={require('../../Image/Close.png')}
                    />
                </TouchableOpacity>
                <View style={{ width: '100%', height: 619, }}>
                    <Video
                        source={{ uri: StaticData.dataResource.data?.activeSimInfo.videoUrl }}
                        style={{ width: '100%', height: 619 }}
                    />
                </View>
            </View>
        </Modal>
    );
}

export default ModalVideo;