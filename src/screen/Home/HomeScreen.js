/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';

export default class HomeScreen extends React.PureComponent {
	static navigationOptions = {
		title: 'HomeScreen',
		headerForceInset: { top: 'never' },
	};

	render() {
		return (
			<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
				<Text>HomeScreen Top</Text>
				<Text>HomeScreen Bottom</Text>
			</View>
		);
	}
}
