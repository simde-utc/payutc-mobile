/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../../screens/Home/HomeScreen';
import RefillScreen from '../../screens/Home/RefillScreen';
import PaymentScreen from '../../screens/Home/PaymentScreen';
import TransferScreen from '../../screens/Home/TransferScreen';
import HistoryNavigator from '../History/HistoryNavigator';
import SettingsNavigator from '../Settings/SettingsNavigator';
import StatsNavigator from '../Stats/StatsNavigator';

const HomeNavigator = createStackNavigator(
	{
		Home: HomeScreen,
		Refill: RefillScreen,
		Payment: PaymentScreen,
		Transfer: TransferScreen,
		History: HistoryNavigator,
		Stats: StatsNavigator,
		Settings: SettingsNavigator,
	},
	{}
);

export default HomeNavigator;
