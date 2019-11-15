/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/Home/HomeScreen';
import RefillScreen from '../screens/Home/RefillScreen';
import PaymentScreen from '../screens/Home/PaymentScreen';
import TransferScreen from '../screens/Home/TransferScreen';
import HistoryScreen from '../screens/History/HistoryScreen';
import StatsScreen from '../screens/Stats/StatsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import AboutScreen from '../screens/Settings/AboutScreen';
import TermsScreen from '../screens/Settings/TermsScreen';
import LicenseScreen from '../screens/Settings/LicenseScreen';
import DependenciesScreen from '../screens/Settings/DependenciesScreen';
import ContributorsScreen from '../screens/Settings/ContributorsScreen';
import ChangelogScreen from '../screens/Settings/ChangelogScreen';
import ProfileScreen from '../screens/Settings/ProfileScreen';
import ChangePinScreen from '../screens/Settings/ChangePinScreen';

const MainNavigator = createStackNavigator(
	{
		Home: HomeScreen,
		Refill: RefillScreen,
		Payment: PaymentScreen,
		Transfer: TransferScreen,
		History: HistoryScreen,
		Stats: StatsScreen,
		Settings: SettingsScreen,
		About: AboutScreen,
		Terms: TermsScreen,
		License: LicenseScreen,
		Dependencies: DependenciesScreen,
		Contributors: ContributorsScreen,
		Changelog: ChangelogScreen,
		Profile: ProfileScreen,
		ChangePin: ChangePinScreen,
	},
	{}
);

export default MainNavigator;
