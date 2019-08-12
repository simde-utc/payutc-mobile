/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View, Linking } from 'react-native';
import colors from '../../styles/colors';
import LinkButton from '../../components/LinkButton';
import Paragraphe from '../../components/Paragraphe';
import { About as t } from '../../utils/i18n';
import GitHub from '../../services/GitHub';

const buttons = ['Legal', 'Dependencies', 'License', 'Contributors'];

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
					{buttons.map(button => (
						<View key={button}>
							<View style={{ height: 15 }} />
							<LinkButton
								text={t(button.toLowerCase())}
								onPress={() => navigation.navigate(button)}
							/>
						</View>
					))}
					<View style={{ height: 15 }} />
					<LinkButton
						text={t('report_bug')}
						color={colors.less}
						onPress={() => Linking.openURL(GitHub.getIssueUrl())}
					/>
					<View style={{ height: 15 }} />
					<Paragraphe
						title={t('developed_github')}
						description={t('developed_disc')}
						titleColor={colors.transfer}
						onPress={() => Linking.openURL(GitHub.getUrl())}
					/>
				</ScrollView>
			</View>
		);
	}
}
