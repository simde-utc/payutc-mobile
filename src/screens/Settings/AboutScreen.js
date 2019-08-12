/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import colors from '../../styles/colors';
import LinkButton from '../../components/LinkButton';
import { About as t } from '../../utils/i18n';

export default class AboutScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
	});

	render() {
		const { navigation } = this.props;

		return (
			<View style={{ flex: 1, backgroundColor: colors.backgroundLight, paddingHorizontal: 15 }}>
				<ScrollView>
					<View style={{ height: 15 }} />
					<LinkButton text={t('legal')} onPress={() => navigation.navigate('Legal')} />
					<View style={{ height: 15 }} />
					<LinkButton text={t('license')} onPress={() => navigation.navigate('License')} />
				</ScrollView>
			</View>
		);
	}
}
