/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { createStackNavigator } from 'react-navigation';
import SettingsScreen from '../../screens/Settings/SettingsScreen';
import AboutScreen from '../../screens/Settings/AboutScreen';
import TermsScreen from '../../screens/Settings/TermsScreen';
import LicenseScreen from '../../screens/Settings/LicenseScreen';
import DependenciesScreen from '../../screens/Settings/DependenciesScreen';
import ContributorsScreen from '../../screens/Settings/ContributorsScreen';
import ChangelogScreen from '../../screens/Settings/ChangelogScreen';
import ProfileScreen from '../../screens/Settings/ProfileScreen';

const SettingsNavigator = createStackNavigator(
	{
		Settings: SettingsScreen,
		About: AboutScreen,
		Terms: TermsScreen,
		License: LicenseScreen,
		Dependencies: DependenciesScreen,
		Contributors: ContributorsScreen,
		Changelog: ChangelogScreen,
		Profile: ProfileScreen,
	},
	{}
);

export default SettingsNavigator;
