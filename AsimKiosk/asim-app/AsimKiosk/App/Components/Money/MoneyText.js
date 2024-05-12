import React from 'react';
import { Text } from 'react-native';
import { TextMask } from 'react-native-masked-text';

export default class MoneyText extends React.Component {

    render() {
        const { value, delimiter, style, suffix, customOpt, prefix } = this.props;
        if (value) {
            return (
                <Text numberOfLines={1} style={style}>
                    {prefix ? (prefix == "-" && prefix || prefix + ' ') : null}
                    <TextMask
                        value={value} type={'money'}
                        options={customOpt || { delimiter: delimiter || '.', precision: 0, unit: '', separator: ' ' }}
                    />
                    {suffix ? '' + suffix : null}
                </Text>
            );
        } else {
            return null;
        }
    }
};
