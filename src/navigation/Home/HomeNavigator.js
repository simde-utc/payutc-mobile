/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../../screens/Home/HomeScreen';

const HomeNavigator = createStackNavigator(
	{
		Home: HomeScreen,
	},
	{}
);

export default HomeNavigator;
