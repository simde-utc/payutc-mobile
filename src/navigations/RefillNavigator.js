/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { createStackNavigator } from 'react-navigation';
import RefillScreen from '../screens/Home/RefillScreen';
import PaymentScreen from '../screens/Home/PaymentScreen';

const RefillNavigator = createStackNavigator(
	{
		Refill: RefillScreen,
		Payment: PaymentScreen,
	},
	{}
);

export default RefillNavigator;
