/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
import { AppState } from 'react-native';
import MainNavigator from '../MainNavigator';
import BiometricAuthScreen from '../../screens/Auth/BiometricAuthScreen';

const BiometricAuthSwitch = createSwitchNavigator(
	{
		BiometricAuth: BiometricAuthScreen,
		Main: MainNavigator,
	},
	{
		initialRouteName: 'BiometricAuth',
	}
);

class BiometricAuthNavigator extends React.Component {
	static router = BiometricAuthSwitch.router;

	constructor(props) {
		super(props);
		this.state = {
			appState: AppState.currentState,
		};
	}

	componentDidMount() {
		AppState.addEventListener('change', this.handleAppStateChange);
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this.handleAppStateChange);
	}

	handleAppStateChange = nextAppState => {
		const { navigation } = this.props;
		const { appState } = this.state;

		if (appState === 'background' && nextAppState === 'active') {
			navigation.navigate('BiometricAuth');
		}

		this.setState({ appState: nextAppState });
	};

	render() {
		const { navigation } = this.props;

		return <BiometricAuthSwitch navigation={navigation} />;
	}
}

export default BiometricAuthNavigator;
