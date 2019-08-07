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

const HomeNavigator = createStackNavigator(
	{
		Home: HomeScreen,
		Refill: RefillScreen,
		Payment: PaymentScreen,
		Transfer: TransferScreen,
	},
	{}
);

export default HomeNavigator;
