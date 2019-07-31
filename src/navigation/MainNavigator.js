/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation';
import HomeNavigator from './Home/HomeNavigator';
import colors from '../styles/colors';
import { Navigation as t } from '../utils/i18n';
import HistoryNavigator from './History/HistoryNavigator';

const ICON_SIZE = 25;

const focusableIoniconFactory = iconName => {
	const focusedIcon = ({ focused }) => (
		<Ionicons
			name={iconName}
			size={ICON_SIZE}
			color={focused ? colors.primary : colors.secondary}
		/>
	);

	return focusedIcon;
};

const MainNavigator = createBottomTabNavigator(
	{
		Home: {
			screen: HomeNavigator,
			navigationOptions: () => ({
				title: t('home'),
				tabBarIcon: focusableIoniconFactory('ios-home'),
			}),
		},

		History: {
			screen: HistoryNavigator,
			navigationOptions: () => ({
				title: t('history'),
				tabBarIcon: focusableIoniconFactory('ios-list'),
			}),
		},

		Stats: {
			screen: () => <Text>Stats</Text>,
			navigationOptions: () => ({
				title: t('stats'),
				tabBarIcon: focusableIoniconFactory('ios-stats'),
			}),
		},

		Settings: {
			screen: () => <Text>Settings</Text>,
			navigationOptions: () => ({
				title: t('settings'),
				tabBarIcon: focusableIoniconFactory('ios-settings'),
			}),
		},
	},
	{
		tabBarOptions: {
			showLabel: true,
			activeTintColor: colors.primary,
			inactiveTintColor: colors.secondary,
			style: {
				borderTopColor: colors.backgroundLight,
			},
		},
	}
);

export default MainNavigator;
