/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, TextInput, View } from 'react-native';
import colors from '../../styles/colors';

export default function AmountInput({ value, error, maxLength, onChange, tintColor, autofocus }) {
	return (
		<View style={{ flexDirection: 'row' }}>
			<TextInput
				style={{
					fontSize: 70,
					fontWeight: 'bold',
					color: error == null ? tintColor : colors.error,
					alignSelf: 'center',
					textAlign: 'right',
				}}
				keyboardType="decimal-pad"
				placeholder="00,00"
				maxLength={maxLength}
				selectionColor={error == null ? tintColor : colors.error}
				autoFocus={autofocus}
				textContentType="none"
				autoCorrect={false}
				onChangeText={value => onChange(value)}
				value={value}
			/>
			<Text
				style={{
					fontSize: 70,
					fontWeight: 'bold',
					color: error == null ? tintColor : colors.error,
				}}
			>
				{' '}
				€
			</Text>
		</View>
	);
}
