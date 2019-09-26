/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, TextInput, View, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import colors from '../../styles/colors';

export default function AmountInput({
	value,
	error,
	maxLength,
	onChange,
	tintColor,
	autoFocus,
	blurOnSubmit,
	setRef,
	onSubmitEditing,
}) {
	return (
		<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
			<TextInput
				style={{
					fontSize: 65,
					fontWeight: 'bold',
					color: error == null ? tintColor : colors.error,
					alignSelf: 'center',
					textAlign: 'right',
					width: Platform.OS === 'ios' || value ? 'auto' : 180,
					padding: 0,
					margin: 0,
				}}
				keyboardType="decimal-pad"
				keyboardAppearance={colors.generalAspect}
				placeholder={value ? '' : '00,00'}
				maxLength={maxLength}
				autoFocus={autoFocus}
				autoCorrect={false}
				onChangeText={value => {
					Haptics.selectionAsync().catch();
					onChange(value);
				}}
				value={value}
				blurOnSubmit={blurOnSubmit}
				ref={setRef}
				onSubmitEditing={onSubmitEditing}
			/>
			<Text
				style={{
					fontSize: 65,
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
