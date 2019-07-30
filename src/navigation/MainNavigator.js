/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Image, Text } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation';

import HomeOn from '../images/navbar/home-on.png';
import HomeOff from '../images/navbar/home-off.png';
import HomeNavigator from './Home/HomeNavigator';
import colors from '../styles/colors';

const ICON_SIZE = 25;

const focusableIconFactory = (On, Off) => {
	const focusedIcon = ({ focused }) => (
		<Image source={focused ? On : Off} style={{ height: ICON_SIZE, width: ICON_SIZE }} resizeMode="contain" />
	);

	return focusedIcon;
};

const focusableIoniconFactory = iconName => {
	const focusedIcon = ({ focused }) => (
		<Ionicons name={iconName} size={25} color={focused ? colors.primary : colors.secondary} />
	);

	return focusedIcon;
};

const MainNavigator = createBottomTabNavigator(
	{
		Home: {
			screen: HomeNavigator,
			navigationOptions: () => ({
				title: 'Home',
				tabBarIcon: focusableIconFactory(HomeOn, HomeOff),
			}),
		},

		Stats: {
			screen: () => <Text>Stats</Text>,
			navigationOptions: () => ({
				title: 'Stats',
				tabBarIcon: focusableIoniconFactory('ios-stats'),
			}),
		},

		Transfer: {
			screen: () => <Text>Transfer</Text>,
			navigationOptions: () => ({
				title: 'Transfer',
				tabBarIcon: focusableIoniconFactory('ios-share-alt'),
			}),
		},

		Settings: {
			screen: () => <Text>Settings</Text>,
			navigationOptions: () => ({
				title: 'Settings',
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
				borderTopWidth: 0,
			},
		},
	}
);

export default MainNavigator;
