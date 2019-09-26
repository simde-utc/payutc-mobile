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
	text,
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
}) {
	const tabValues = Object.values(tabs);
	const tabKeys = Object.keys(tabs);

	return (
		<BlockTemplate
			roundedTop={roundedTop}
			roundedBottom={roundedBottom}
			shadow={shadow}
			style={[{ padding: 0 }, style]}
			customBackground={colors.backgroundBlock}
		>
			{text ? (
				<Text
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						color: colors.secondary,
						margin: 10,
						marginBottom: 0,
					}}
				>
					{text}
				</Text>
			) : null}
			<View
				style={{
					backgroundColor: colors.backgroundBlock,
					margin: 5,
					padding: 5,
				}}
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
						backgroundColor: colors.backgroundBlock,
						borderTopLeftRadius: roundedTop ? 10 : 0,
						borderTopRightRadius: roundedTop ? 10 : 0,
						borderBottomLeftRadius: roundedBottom ? 10 : 0,
						borderBottomRightRadius: roundedBottom ? 10 : 0,
					}}
					style={{
						backgroundColor: colors.backgroundBlock,
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
									borderColor: colors.borderLight,
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
				</ScrollView>
			</View>
			<View
				style={{
					backgroundColor: colors.backgroundBlock,
					borderBottomWidth: tabValues.filter(tab => tab.children).length ? 1 : 0,
					borderBottomColor: colors.backgroundLight,
				}}
			/>
			{children}
			{tabs[value] ? tabs[value].children : null}
		</BlockTemplate>
	);
}
