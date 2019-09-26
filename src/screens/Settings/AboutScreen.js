/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View, Linking, Text } from 'react-native';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import LinkButton from '../../components/LinkButton';
import Paragraphe from '../../components/Paragraphe';
import { _, About as t } from '../../utils/i18n';
import appJson from '../../../app.json';
import { GitHub } from '../../redux/actions';
import GitHubService from '../../services/GitHub';

const buttons = ['Terms', 'Dependencies', 'License', 'Contributors'];

class AboutScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: {
			borderBottomWidth: 0,
			backgroundColor: colors.backgroundBlock,
		},
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
		headerTruncatedBackTitle: _('back'),
	});

	componentDidMount() {
		const { dispatch } = this.props;

		dispatch(GitHub.getLastestRelease());
	}

	getApplicationStatus() {
		const {
			release: { tag_name: tagName },
			releaseFetching,
			navigation,
		} = this.props;
		let { versionName } = appJson;

		if (releaseFetching) {
			return [_('loading_text_replacement'), null, _('loading_text_replacement'), () => {}];
		}

		if (!tagName || !versionName) {
			return [
				t('dev_version'),
				colors.more,
				t('in_development'),
				() => navigation.navigate('Changelog'),
			];
		}

		versionName = `v${versionName}`;

		if (tagName === versionName) {
			return [
				t('up_to_date'),
				colors.more,
				t('actual_version', { current: versionName }),
				() => navigation.navigate('Changelog'),
			];
		}

		return [
			t('need_update'),
			colors.less,
			t('update_version', { current: versionName, next: tagName }),
			() => navigation.navigate('Changelog'),
		];
	}

	render() {
		const { navigation } = this.props;
		const repoUrl = GitHubService.getRepoUrl();
		const [titleStatus, titleColor, descriptionStatus, onPressStatus] = this.getApplicationStatus();

		return (
			<ScrollView style={{ backgroundColor: colors.background }}>
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
						onPress={() => Linking.openURL(GitHubService.getIssueUrl())}
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
