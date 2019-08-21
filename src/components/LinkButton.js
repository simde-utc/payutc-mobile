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

export default function LinkButton({
	text,
	color,
	children,
	backgroundColor,
	disabled,
	disabledText,
	onPress,
	notRoundedTop,
	notRoundedBottom,
	noShadow,
	style,
}) {
	return (
		<BlockTemplate
			roundedTop={!notRoundedTop}
			roundedBottom={!notRoundedBottom}
			shadow={!noShadow}
			onPress={onPress}
			disabled={disabled}
			customBackground={disabled ? colors.disabled : backgroundColor}
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
				{children || (
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								color: color || colors.secondary,
							}}
						>
							{text}
						</Text>
						{disabled && disabledText ? (
							<Text
								style={{
									fontSize: 13,
									color: colors.secondary,
								}}
							>
								{disabledText}
							</Text>
						) : null}
					</View>
				)}
				<FontAwesomeIcon
					icon={['fas', 'angle-right']}
					size={20}
					color={color || colors.secondary}
				/>
			</View>
		</BlockTemplate>
	);
}
