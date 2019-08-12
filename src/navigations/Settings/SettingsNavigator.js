/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import SettingsScreen from '../../screens/Settings/SettingsScreen';
import AboutScreen from '../../screens/Settings/AboutScreen';
import LicenseScreen from '../../screens/Settings/LicenseScreen';
import DependenciesScreen from '../../screens/Settings/DependenciesScreen';

const SettingsNavigator = createStackNavigator(
	{
		Settings: SettingsScreen,
		About: AboutScreen,
		License: LicenseScreen,
		Legal: () => <Text>Mentions légales</Text>,
		Dependencies: DependenciesScreen,
	},
	{}
);

export default SettingsNavigator;
