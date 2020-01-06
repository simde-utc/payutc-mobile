/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { createStackNavigator } from 'react-navigation';
import TransferScreen from '../screens/Home/TransferScreen';

const TransferNavigator = createStackNavigator(
	{
		Transfer: TransferScreen,
	},
	{}
);

export default TransferNavigator;
