/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import BlockTemplate from './BlockTemplate';
import colors from '../styles/colors';
import { _ } from '../utils/i18n';

export default function TabsBlockTemplate({
	tabs,
	style,
	roundedTop,
	roundedBottom,
	shadow,
	disabled,
	tintColor,
	onChange,
	value,
	justifyContent,
	children,
	offsetLeft,
	offsetRight,
	backgroundColor,
}) {
	const tabValues = Object.values(tabs);
	const tabKeys = Object.keys(tabs);

	return (
		<BlockTemplate
			roundedTop={roundedTop}
			roundedBottom={roundedBottom}
			shadow={shadow}
			style={[{ padding: 0 }, style]}
			customBackground={backgroundColor || colors.background}
		>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					marginRight: 0,
					paddingRight: 0,
					flexGrow: 1,
					flexDirection: 'row',
					justifyContent: justifyContent || 'space-between',
					flexWrap: 'nowrap',
					backgroundColor: backgroundColor || colors.background,
					borderTopLeftRadius: roundedTop ? 10 : 0,
					borderTopRightRadius: roundedTop ? 10 : 0,
					borderBottomLeftRadius: roundedBottom ? 10 : 0,
					borderBottomRightRadius: roundedBottom ? 10 : 0,
				}}
				style={{
					backgroundColor: backgroundColor || colors.background,
					paddingLeft: offsetLeft || 0,
					paddingRight: offsetRight || 0,
				}}
			>
				{tabValues.map((tab, index) => {
					const key = tabKeys[index];
					const title = tab.title || (tab.lazyTitle ? _(tab.lazyTitle) : tab);

					return (
						<BlockTemplate
							roundedTop
							roundedBottom
							key={title}
							disabled={disabled}
							customBackground={value === key && !disabled ? tintColor : null}
							style={{
								marginRight: 10,
								borderWidth: value === key ? 0 : 1,
								borderColor: colors.border,
							}}
							onPress={() => {
								Haptics.selectionAsync().catch();
								onChange(key);
							}}
						>
							<Text
								style={{
									fontSize: 14,
									fontWeight: 'bold',
									color: disabled
										? colors.disabled
										: value === key
										? colors.backgroundBlock
										: tintColor,
								}}
							>
								{title}
							</Text>
						</BlockTemplate>
					);
				})}
				<View style={{ width: offsetRight || 0 }} />
			</ScrollView>
			{children}
			{tabs[value] ? tabs[value].children : null}
		</BlockTemplate>
	);
}
