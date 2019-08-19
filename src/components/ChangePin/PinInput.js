/**
 * @author Aymeric Obled <aymeric.obled@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { TextInput, View } from 'react-native';
import colors from '../../styles/colors';

export default function PinInput({ value, error, maxLength, onChange, tintColor, autofocus }) {
	return (
		<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
			<TextInput
				style={{
					fontSize: 70,
					fontWeight: 'bold',
					color: error == null ? tintColor : colors.error,
					alignSelf: 'center',
					textAlign: 'center',
					width: value ? 'auto' : 180,
					padding: 0,
					margin: 0,
				}}
				secureTextEntry
				keyboardType="decimal-pad"
				placeholder={value ? '' : '****'}
				maxLength={maxLength}
				autoFocus={autofocus}
				autoCorrect={false}
				onChangeText={value => onChange(value)}
				value={value}
			/>
		</View>
	);
}
