/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { AppState } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation';
import { connect } from 'react-redux';
import HomeNavigator from './Home/HomeNavigator';
import colors from '../styles/colors';
import { Navigation as t } from '../utils/i18n';
import HistoryNavigator from './History/HistoryNavigator';
import StatsNavigator from './Stats/StatsNavigator';
import SettingsNavigator from './Settings/SettingsNavigator';

const ICON_SIZE = 22;

const focusableIoniconFactory = icon => {
	const focusedIcon = ({ focused }) => (
		<FontAwesomeIcon
			icon={icon}
			size={ICON_SIZE}
			color={focused ? colors.primary : colors.secondary}
			style={{ paddingTop: 3 }}
		/>
	);

	return focusedIcon;
};

const Main = createBottomTabNavigator(
	{
		Home: {
			screen: HomeNavigator,
			navigationOptions: () => ({
				title: t('home'),
				tabBarIcon: focusableIoniconFactory(['fas', 'home']),
			}),
		},

		History: {
			screen: HistoryNavigator,
			navigationOptions: () => ({
				title: t('history'),
				tabBarIcon: focusableIoniconFactory(['fas', 'list']),
			}),
		},

		Stats: {
			screen: StatsNavigator,
			navigationOptions: () => ({
				title: t('stats'),
				tabBarIcon: focusableIoniconFactory(['fas', 'chart-pie']),
			}),
		},

		Settings: {
			screen: SettingsNavigator,
			navigationOptions: () => ({
				title: t('settings'),
				tabBarIcon: focusableIoniconFactory(['fas', 'cogs']),
			}),
		},
	},
	{
		tabBarComponent: props => {
			const customProps = {
				activeTintColor: colors.primary,
				inactiveTintColor: colors.secondary,
				activeBackgroundColor: colors.backgroundBlock,
				inactiveBackgroundColor: colors.backgroundBlock,
				style: {
					borderTopColor: colors.border,
				},
			};

			return <BottomTabBar {...props} {...customProps} showLabel />;
		},
		tabBarOptions: {
			safeAreaInset: { bottom: 'never', top: 'never' },
		},
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
