/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import SettingsScreen from '../../screens/Settings/SettingsScreen';

const SettingsNavigator = createStackNavigator(
	{
		Settings: SettingsScreen,
		About: () => <Text>À propos</Text>,
		Legal: () => <Text>Mentions légales</Text>,
	},
	{}
);

export default SettingsNavigator;
