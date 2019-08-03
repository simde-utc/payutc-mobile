/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator, SafeAreaView } from 'react-navigation';
import AppLoader from './src/screens/AppLoader';
import MainNavigator from './src/navigations/MainNavigator';
import AuthNavigator from './src/navigations/Auth/AuthNavigator';
import colors from './src/styles/colors';

const AppNavigator = createSwitchNavigator(
	{
		Loading: AppLoader,
		Auth: AuthNavigator,
		Main: MainNavigator,
	},
	{
		initialRouteName: 'Loading',
	}
);

const AppContainer = createAppContainer(AppNavigator);

const marginTop = StatusBar.currentHeight || 20;

export default function App() {
	return (
		<SafeAreaView style={{ flex: 1, marginTop }} forceInset={{ bottom: 'never' }}>
			<StatusBar backgroundColor={colors.yellow} translucent />
			<AppContainer />
		</SafeAreaView>
	);
}
