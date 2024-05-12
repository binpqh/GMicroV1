import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import LanguageActions from '../../Redux/LanguageRedux';
import { connect } from 'react-redux';
import StaticData from '../../Variables/StaticData';

const Language = (props) => {
    const { language } = props;
    const [optionsLanguage, setOptionsLanguage] = React.useState(false);

    const handleOptionLanguage = React.useCallback(() => {
        setOptionsLanguage(!optionsLanguage);
    }, [optionsLanguage]);

    return (
        <View style={{ marginTop: 110, marginLeft: 811, position: 'absolute' }}
            onStartShouldSetResponder={() => StaticData.isActive = true}
        >
            <TouchableOpacity
                style={{ width: 229, height: 57, flexDirection: 'row', alignItems: 'center' }}
                activeOpacity={.7}
                onPress={() => handleOptionLanguage()}
            >
                {language == 'en' ? <Image style={{ width: 33, height: 24, marginRight: 12, marginLeft: 24 }} source={require('../../Image/flagsen.png')} /> : <Image style={{ width: 33, height: 24, marginRight: 12, marginLeft: 24 }} source={require('../../Image/flagsVN.png')} />}
                <Text style={{ fontSize: 24, color: 'white' }}>{language === 'en' ? 'English' : 'Việt Nam'}</Text>
                <Image style={{ position: 'absolute' }} source={require('../../Image/languageborder.png')} />
            </TouchableOpacity>
            {optionsLanguage ?
                <View>
                    <TouchableOpacity
                        style={{ width: 229, height: 57, marginTop: 1.5, backgroundColor: 'white', opacity: .9, flexDirection: 'row', alignItems: 'center', borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
                        onPress={() => { props.changeLanguage('en'), setOptionsLanguage(false) }}
                    >
                        <Image style={{ width: 33, height: 24, marginRight: 12, marginLeft: 24 }} source={require('../../Image/flagsen.png')} />
                        <Text style={{ fontSize: 24, color: 'black' }}>{'English'}</Text>
                    </TouchableOpacity>
                    <View style={{ height: 1, backgroundColor: '#0000001f', opacity: .9 }} />
                    <TouchableOpacity
                        style={{ width: 229, height: 57, backgroundColor: 'white', opacity: .9, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }}
                        onPress={() => { props.changeLanguage('vi'), setOptionsLanguage(false) }}
                    >
                        <Image style={{ width: 33, height: 24, marginRight: 12, marginLeft: 24 }} source={require('../../Image/flagsVN.png')} />
                        <Text style={{ fontSize: 24, color: 'black' }}>{'Việt Nam'}</Text>
                    </TouchableOpacity>
                </View>
                : null
            }
        </View>
    );
};
const mapStateToProps = state => {
    const { language } = state.language;
    return {
        language
    };
}

const mapDispatchToProps = dispatch => ({
    changeLanguage: (language) => dispatch(LanguageActions.changeLanguage(language))
})
export default connect(mapStateToProps, mapDispatchToProps)(Language);