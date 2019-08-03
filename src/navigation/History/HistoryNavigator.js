/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { createStackNavigator } from 'react-navigation';
import HistoryScreen from '../../screens/History/HistoryScreen';

const HistoryNavigator = createStackNavigator(
	{
		History: HistoryScreen,
	},
	{}
);

export default HistoryNavigator;
