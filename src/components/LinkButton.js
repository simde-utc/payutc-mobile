/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors from '../styles/colors';
import BlockTemplate from './BlockTemplate';

export default function LinkButton({ text, color, backgroundColor, disabled, onPress, style }) {
	return (
		<BlockTemplate
			roundedTop
			roundedBottom
			shadow
			onPress={onPress}
			disabled={disabled}
			customBackground={disabled ? colors.disabled : backgroundColor}
			style={style}
		>
			<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						color: color || colors.secondary,
					}}
				>
					{text}
				</Text>
				<FontAwesomeIcon
					icon={['fas', 'angle-right']}
					size={20}
					color={color || colors.secondary}
				/>
			</View>
		</BlockTemplate>
	);
}
