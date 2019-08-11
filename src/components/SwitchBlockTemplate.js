/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Switch, View } from 'react-native';
import BlockTemplate from './BlockTemplate';

export default function SwitchBlockTemplate({
	children,
	roundedTop,
	roundedBottom,
	shadow,
	onPress,
	disabled,
	customBackground,
	value,
	onValueChange,
	tintColor,
}) {
	return (
		<BlockTemplate
			roundedTop={roundedTop}
			roundedBottom={roundedBottom}
			shadow={shadow}
			onPress={onPress}
			disabled={disabled}
			customBackground={customBackground}
		>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				{children}
				<Switch
					style={{ marginLeft: 10 }}
					value={value}
					onValueChange={value => onValueChange(value)}
					trackColor={{ true: tintColor }}
					disabled={disabled}
				/>
			</View>
		</BlockTemplate>
	);
}
