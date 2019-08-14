/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View, Linking, Text, Platform } from 'react-native';
import { connect } from 'react-redux';
import VersionNumber from 'react-native-version-number';
import colors from '../../styles/colors';
import LinkButton from '../../components/LinkButton';
import Paragraphe from '../../components/Paragraphe';
import { _, About as t } from '../../utils/i18n';
import GitHub from '../../services/GitHub';
import { IOS_STORE_URL, ANDROID_STORE_URL } from '../../../config';

const buttons = ['Terms', 'Dependencies', 'License', 'Contributors'];

class AboutScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
		headerTruncatedBackTitle: _('back'),
	});

	getApplicationStatus() {
		const { release, releaseFetching, navigation } = this.props;

		if (releaseFetching) {
			return [_('loading_text_replacement'), colors.less, _('loading_text_replacement'), () => {}];
		}

		if (!release.name) {
			return [
				t('up_to_date'),
				colors.more,
				t('in_development'),
				() => navigation.navigate('Changelog'),
			];
		}

		const appVersion = `v${VersionNumber.appVersion}`;

		if (release.name === appVersion) {
			return [
				t('up_to_date'),
				colors.more,
				t('actual_version', { current: appVersion }),
				() => navigation.navigate('Changelog'),
			];
		}

		return [
			t('need_update'),
			colors.less,
			t('update_version', { current: appVersion, next: release.name }),
			() => Linking.openURL(Platform.OS === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL),
		];
	}

	render() {
		const { navigation } = this.props;
		const repoUrl = GitHub.getRepoUrl();
		const [titleStatus, titleColor, descriptionStatus, onPressStatus] = this.getApplicationStatus();

		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight }}>
				<View style={{ paddingHorizontal: 15 }}>
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
						onPress={() => Linking.openURL(repoUrl)}
					>
						<Text
							style={{
								fontSize: 12,
								fontWeight: 'bold',
								color: colors.transfer,
								marginTop: 12,
							}}
						>
							{repoUrl.replace(/http(s?):\/\//, '')}
						</Text>
					</Paragraphe>
					<View style={{ height: 15 }} />
					<Paragraphe
						title={titleStatus}
						description={descriptionStatus}
						onPress={onPressStatus}
						titleColor={titleColor}
					/>
					<View style={{ height: 15 }} />
				</View>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ github }) => {
	const release = github.getLastestRelease();

	return {
		release: release.getData({}),
		releaseFetching: release.isFetching(),
		releaseFetched: release.isFetched(),
	};
};

export default connect(mapStateToProps)(AboutScreen);
