/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import HomeNavigator from './Home/HomeNavigator';

const MainNavigator = createBottomTabNavigator(
	{
		Home: HomeNavigator,
	},
	{}
);

export default MainNavigator;
