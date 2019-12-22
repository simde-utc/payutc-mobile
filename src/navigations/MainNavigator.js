/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import HomeNavigator from './HomeNavigator';
import RefillNavigator from './RefillNavigator';
import TransferNavigator from './TransferNavigator';

const Main = createStackNavigator(
	{
		Home: HomeNavigator,
		Refill: RefillNavigator,
		Transfer: TransferNavigator,
	},
	{
		headerMode: 'none',
		mode: 'modal',
	}
);

class MainNavigator extends React.Component {
	static router = Main.router;

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
		const { navigation, restrictions } = this.props;
		const { appState } = this.state;

		if (
			appState === 'background' &&
			nextAppState === 'active' &&
			restrictions.includes('APP_OPENING')
		) {
			navigation.navigate('BiometricAuth');
		} else this.setState({ appState: nextAppState });
	};

	render() {
		const { navigation } = this.props;

		return <Main {...this.props} navigation={navigation} />;
	}
}

const mapStateToProps = ({ config: { restrictions } }) => ({ restrictions });

export default connect(mapStateToProps)(MainNavigator);
