import React from 'react';
import { Text, View, Modal, TouchableOpacity, Image } from 'react-native';
import { english, vi } from '../../Lib/Language';
const ModalErrors = (props) => {
    const { showErros, closePopup, language } = props;
    return (
        <Modal
            transparent={true}
            visible={showErros}
        >
            {console.log('language', language)}
            <View style={{ flex: 1, backgroundColor: '#000000AA', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', borderRadius: 32, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 80, paddingVertical: 80 }}>
                    <Image
                        style={{ width: 140, height: 140, marginBottom: 26 }}
                        source={require('../../Image/IconError.png')} />
                    <Text style={{ fontSize: 48, color: '#FF2F48', fontWeight: '700', marginBottom: 24, }}>{language == 'en' ? english.modalErorrs.txtTitle : vi.modalErorrs.txtTitle}</Text>
                    <Text style={{ fontSize: 24, marginBottom: 24, width: 792, textAlign: 'center', color: 'black' }}>{language == 'en' ? english.modalErorrs.txtPlease : vi.modalErorrs.txtPlease}<Text style={{ fontWeight: 'bold' }}>{' "IN" '}</Text><Text>{language == 'en' ? english.modalErorrs.txtClick : vi.modalErorrs.txtClick}</Text></Text>
                    <Text style={{ fontSize: 24, marginBottom: 24, width: 792, textAlign: 'center', color: 'black' }}>{language == 'en' ? english.modalErorrs.txtIfNotClick : vi.modalErorrs.txtIfNotClick}<Text style={{ fontWeight: 'bold' }}>{language == 'en' ? '"' + english.button.txtCancel + '"' : '"' + vi.button.txtCancel + '"'}</Text><Text>{language == 'en' ? english.modalErorrs.txtThenClick : vi.modalErorrs.txtThenClick}</Text><Text style={{ fontWeight: 'bold' }}>{language == 'en' ? english.modalErorrs.txtalreadypaid : vi.modalErorrs.txtalreadypaid}</Text><Text>{language == 'en' ? english.modalErorrs.txtButton : vi.modalErorrs.txtButton}</Text></Text>
                    <TouchableOpacity style={{ width: 283, height: 72, borderRadius: 8, backgroundColor: '#FF2F48', justifyContent: 'center', alignItems: 'center', marginTop: 38 }}
                        onPress={() => closePopup()}
                    >
                        <Text style={{ color: 'white', fontSize: 24 }}>{language == 'en' ? english.modalErorrs.txtButtomClick : vi.modalErorrs.txtButtomClick}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default ModalErrors;