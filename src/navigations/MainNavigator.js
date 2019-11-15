/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { createStackNavigator } from 'react-navigation';
import HomeNavigator from './HomeNavigator';
import RefillNavigator from './RefillNavigator';
import TransferNavigator from './TransferNavigator';

const MainNavigator = createStackNavigator(
	{
		Home: HomeNavigator,
		Refill: RefillNavigator,
		Transfer: TransferNavigator,
	},
	{
		headerMode: 'none',
		mode: 'modal',
	}
);

export default MainNavigator;
