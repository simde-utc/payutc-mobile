/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Button, Text, View } from 'react-native';

export default class AuthScreen extends React.PureComponent {
	static navigationOptions = {
		title: 'AuthScreen',
		headerForceInset: { top: 'never' },
	};

	render() {
		const { navigation } = this.props;

		return (
			<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
				<Text>AuthScreen Top</Text>

				<Button onPress={() => navigation.navigate('Home')} title="Login..." />

				<Text>AuthScreen Bottom</Text>
			</View>
		);
	}
}
