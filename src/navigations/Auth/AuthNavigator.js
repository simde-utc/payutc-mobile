/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import AuthScreen from '../../screens/Auth/AuthScreen';
import AboutScreen from '../../screens/Settings/AboutScreen';
import LicenseScreen from '../../screens/Settings/LicenseScreen';

const AuthNavigator = createStackNavigator(
	{
		Auth: AuthScreen,
		About: AboutScreen,
		License: LicenseScreen,
		Legal: () => <Text>Mentions légales</Text>,
	},
	{}
);

export default AuthNavigator;
