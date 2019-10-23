/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, YellowBox } from 'react-native';
import { createAppContainer, createSwitchNavigator, SafeAreaView } from 'react-navigation';
import { connect, Provider } from 'react-redux';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import AppLoader from './src/screens/AppLoader';
import ChangelogScreen from './src/screens/Settings/ChangelogScreen';
import AuthNavigator from './src/navigations/Auth/AuthNavigator';
import store from './src/redux/store';
import colors from './src/styles/colors';
import MainNavigator from './src/navigations/MainNavigator';
import BiometricAuthScreen from './src/screens/Auth/BiometricAuthScreen';

const styles = StyleSheet.create({
	defaultFontFamily: {
		fontFamily: 'Roboto',
	},
});

// Bug: https://github.com/simde-utc/payutc-mobile/issues/226
if (Platform.OS === 'android') {
	const oldRender = Text.render;
	Text.render = function render(...args) {
		const origin = oldRender.call(this, ...args);
		return React.cloneElement(origin, {
			style: [styles.defaultFontFamily, origin.props.style],
		});
	};
}

const AppNavigator = createSwitchNavigator(
	{
		Loading: AppLoader,
		Auth: AuthNavigator,
		BiometricAuth: BiometricAuthScreen,
		Main: MainNavigator,
		Changelog: ChangelogScreen,
	},
	{
		initialRouteName: 'Loading',
	}
);

YellowBox.ignoreWarnings(['Async Storage', 'WebView']);

const AppContainer = createAppContainer(AppNavigator);

const paddingTop = StatusBar.currentHeight || 20;

const mapStateToProps = ({ config }) => ({ config });

const ConnectedApp = connect(mapStateToProps)(({ config }) => (
	<SafeAreaView style={{ flex: 1, paddingTop, backgroundColor: colors.backgroundBlock }}>
		<StatusBar backgroundColor={colors.primary} translucent />
		<SpinnerOverlay {...config.spinner} />
		<AppContainer screenProps={{ config }} />
	</SafeAreaView>
));

export default function App() {
	return (
		<Provider store={store}>
			<ConnectedApp />
		</Provider>
	);
}
