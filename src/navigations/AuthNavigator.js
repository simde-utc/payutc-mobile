/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { createStackNavigator } from 'react-navigation';
import AuthScreen from '../screens/Auth/AuthScreen';
import AboutScreen from '../screens/Settings/AboutScreen';
import TermsScreen from '../screens/Settings/TermsScreen';
import PayutcTermsScreen from '../screens/Auth/TermsScreen';
import LicenseScreen from '../screens/Settings/LicenseScreen';
import DependenciesScreen from '../screens/Settings/DependenciesScreen';
import ContributorsScreen from '../screens/Settings/ContributorsScreen';
import ChangelogScreen from '../screens/Settings/ChangelogScreen';

const AuthNavigator = createStackNavigator(
	{
		Auth: AuthScreen,
		About: AboutScreen,
		Terms: TermsScreen,
		PayutcTerms: PayutcTermsScreen,
		License: LicenseScreen,
		Dependencies: DependenciesScreen,
		Contributors: ContributorsScreen,
		Changelog: ChangelogScreen,
	},
	{}
);

export default AuthNavigator;
