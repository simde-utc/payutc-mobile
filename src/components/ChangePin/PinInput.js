/**
 * @author Aymeric Obled <aymeric.obled@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Platform, TextInput, View } from 'react-native';
import colors from '../../styles/colors';

export default function PinInput({ value, error, maxLength, onChange, tintColor, autofocus }) {
	return (
		<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
			<TextInput
				style={{
					fontSize: 65,
					fontWeight: 'bold',
					color: error == null ? tintColor : colors.error,
					alignSelf: 'center',
					textAlign: 'right',
					width: Platform.OS === 'ios' || value ? 'auto' : 200,
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
