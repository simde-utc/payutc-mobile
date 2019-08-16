/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { createStackNavigator } from 'react-navigation';
import StatsScreen from '../../screens/Stats/StatsScreen';

const StatsNavigator = createStackNavigator(
	{
		Stats: StatsScreen,
	},
	{}
);

export default StatsNavigator;
