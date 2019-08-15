/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, Text } from 'react-native';
import BlockTemplate from './BlockTemplate';
import colors from '../styles/colors';

export default function ValidationScreen({ text, children, buttonColor, disabled, onPress }) {
	return (
		<View style={{ flex: 1 }}>
			{children}
			<BlockTemplate
				roundedTop
				roundedBottom
				shadow
				customBackground={buttonColor}
				disabled={disabled}
				style={{ margin: 5 }}
				onPress={onPress}
			>
				<Text
					style={{
						fontSize: 18,
						fontWeight: 'bold',
						textAlign: 'center',
						color: colors.backgroundBlock,
					}}
				>
					{text}
				</Text>
			</BlockTemplate>
		</View>
	);
}
