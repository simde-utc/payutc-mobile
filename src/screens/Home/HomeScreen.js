/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, Text } from 'react-native';
import colors from '../../styles/colors';

export default class HomeScreen extends React.PureComponent {
	static navigationOptions = {
		title: 'HomeScreen',
		headerTintColor: colors.primary,
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
	};

	render() {
		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight }}>
				<Text>HomeScreen ScrollView Top</Text>
			</ScrollView>
		);
	}
}
