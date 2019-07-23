/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { createAppContainer, createSwitchNavigator, SafeAreaView } from 'react-navigation';
import MainNavigator from './src/navigation/MainNavigator';
import AuthNavigator from './src/navigation/Auth/AuthNavigator';

const AppNavigator = createSwitchNavigator(
	{
		Auth: AuthNavigator,
		Main: MainNavigator,
	},
	{
		initialRouteName: 'Auth',
	}
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
	return (
		<SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: 'never' }}>
			<AppContainer />
		</SafeAreaView>
	);
}
