/**
 * @author Aymeric Obled <aymeric.obled@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Platform, TextInput, View } from 'react-native';
import colors from '../../styles/colors';

export default class PinInput extends React.Component {
	getWidth() {
		const { value } = this.props;

		if (Platform.OS === 'ios') {
			return 'auto';
		}

		return value.length ? (value.length - 1) * 20 + 40 : 152;
	}

	render() {
		const { value, error, maxLength, onChange, tintColor, autofocus } = this.props;

		return (
			<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
				<TextInput
					style={{
						fontSize: 65,
						fontWeight: 'bold',
						color: error == null ? tintColor : colors.error,
						alignSelf: 'center',
						textAlign: 'right',
						width: this.getWidth(),
						padding: 0,
						margin: 0,
					}}
					secureTextEntry
					keyboardType="decimal-pad"
					placeholder={value ? '' : '0000'}
					maxLength={maxLength}
					autoFocus={autofocus}
					autoCorrect={false}
					onChangeText={value => onChange(value)}
					value={value}
				/>
			</View>
		);
	}
}
