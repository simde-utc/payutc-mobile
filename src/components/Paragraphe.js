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

export default function Pragraphe({ title, description }) {
	return (
		<BlockTemplate roundedTop roundedBottom shadow>
			<View style={{ flex: 1, flexDirection: 'column' }}>
				<Text
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						color: colors.secondary,
					}}
				>
					{title}
				</Text>
				<Text
					style={{
						fontSize: 13,
						color: colors.secondary,
					}}
				>
					{description}
				</Text>
			</View>
		</BlockTemplate>
	);
}
