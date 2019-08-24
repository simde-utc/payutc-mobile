/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import BlockTemplate from './BlockTemplate';
import colors from '../styles/colors';

export default function Paragraphe({
	title,
	titleColor,
	description,
	descriptionColor,
	style,
	disabled,
	disabledText,
	onPress,
	link,
	children,
}) {
	return (
		<BlockTemplate
			roundedTop
			roundedBottom
			shadow
			onPress={disabled ? null : onPress}
			style={style}
		>
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
							color: disabled ? colors.disabled : titleColor || colors.secondary,
						}}
					>
						{title}
					</Text>
					<Text
						style={{
							fontSize: 13,
							color: disabled ? colors.disabled : descriptionColor || colors.secondary,
						}}
					>
						{description}
					</Text>
					{disabled && disabledText ? (
						<Text style={{ fontSize: 13, color: colors.secondary, marginTop: 3 }}>
							{disabledText}
						</Text>
					) : null}
					{children}
				</View>
				{link ? (
					<FontAwesomeIcon
						icon={['fas', 'angle-right']}
						size={20}
						color={disabled ? colors.disabled : titleColor || colors.secondary}
						style={{ marginLeft: 10 }}
					/>
				) : null}
			</View>
		</BlockTemplate>
	);
}
