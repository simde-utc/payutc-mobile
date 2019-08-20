/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, Text, Switch } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import BlockTemplate from './BlockTemplate';
import colors from '../styles/colors';

export default function Paragraphe({
	title,
	titleColor,
	description,
	descriptionColor,
	style,
	onPress,
	link,
	children,
}) {
	return (
		<BlockTemplate roundedTop roundedBottom shadow onPress={onPress} style={style}>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<View style={{ flex: 1, flexDirection: 'column' }}>
					<Text
						style={{
							fontSize: 16,
							fontWeight: 'bold',
							color: titleColor || colors.secondary,
						}}
					>
						{title}
					</Text>
					<Text
						style={{
							fontSize: 13,
							color: descriptionColor || colors.secondary,
						}}
					>
						{description}
					</Text>
					{children}
				</View>
				{link ? (
					<FontAwesomeIcon
						icon={['fas', 'angle-right']}
						size={20}
						color={titleColor || colors.secondary}
						style={{ marginLeft: 10 }}
					/>
				) : null}
			</View>
		</BlockTemplate>
	);
}
