/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import BlockTemplate from './BlockTemplate';
import colors from '../styles/colors';

export default function Paragraphe({ message, color, backgroundColor, onPress }) {
	return (
		<BlockTemplate
			roundedTop
			roundedBottom
			shadow
			style={{ backgroundColor: backgroundColor || colors.more }}
			onPress={onPress}
		>
			<Text
				style={{
					fontSize: 16,
					fontWeight: 'bold',
					color: color || colors.backgroundBlock,
				}}
			>
				{message}
			</Text>
		</BlockTemplate>
	);
}
