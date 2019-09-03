/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Linking, ScrollView, Text, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ValidationScreen from '../../components/ValidationScreen';
import BlockTemplate from '../../components/BlockTemplate';
import TitleParams from '../../components/TitleParams';
import TabsBlockTemplate from '../../components/TabsBlockTemplate';
import List from '../../components/List';
import { GitHub, Config } from '../../redux/actions';
import GitHubService from '../../services/GitHub';
import colors from '../../styles/colors';
import { _, Changelog as t, Global as g } from '../../utils/i18n';
import { IOS_STORE_URL, ANDROID_STORE_URL } from '../../../config';
import appJson from '../../../app.json';

class ChangelogScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
	});

	componentDidMount() {
		const { lang, dispatch } = this.props;

		dispatch(GitHub.getLastestRelease());
		dispatch(GitHub.getChangelog(lang));
	}

	componentDidUpdate({ lang: prevLang }) {
		const { lang, dispatch } = this.props;

		if (lang !== prevLang) {
			dispatch(GitHub.getChangelog(lang));
		}
	}

	static renderItem(item, fontSize) {
		if (item.title && item.data) {
			const { title, data } = item;

			return (
				<>
					{ChangelogScreen.renderItem(title, fontSize)}
					<View
						style={{
							backgroundColor: colors.backgroundBlock,
							paddingLeft: '5%',
						}}
					>
						<List
							items={data}
							keyExtractor={item => `${title}.${item.title || item}`}
							renderItem={item => ChangelogScreen.renderItem(item, fontSize - 1)}
						/>
					</View>
				</>
			);
		}

		return (
			<BlockTemplate>
				<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
					<FontAwesomeIcon icon={['fas', 'angle-right']} size={14} color={colors.secondary} />
					<Text
						style={{
							fontSize,
							marginLeft: 5,
							marginRight: 10,
							fontWeight: 'bold',
							color: colors.secondary,
						}}
					>
						{item}
					</Text>
				</View>
			</BlockTemplate>
		);
	}

	getStoreText() {
		const {
			release: { tag_name: tagName },
		} = this.props;
		const { versionName } = appJson;

		if (!versionName || !tagName || `v${versionName}` === tagName) {
			return t('go_to_store');
		}

		return t('update_store', { version: tagName });
	}

	setLang(lang) {
		const { dispatch } = this.props;

		dispatch(Config.setLang(lang));
	}

	renderLoading() {
		const { changelogFetching } = this.props;

		return (
			<View style={{ paddingBottom: 15 }}>
				<List
					title={_('loading_text_replacement')}
					loading={changelogFetching}
					renderFooter={
						<BlockTemplate roundedBottom customBackground={colors.backgroundBlockAlt}>
							<Text
								style={{
									fontSize: 12,
									fontWeight: 'bold',
									color: colors.transfer,
								}}
							>
								{_('loading_text_replacement')}
							</Text>
						</BlockTemplate>
					}
				/>
			</View>
		);
	}

	renderChangelog() {
		const { changelog, changelogFetching } = this.props;
		const appVersion = `v${appJson.versionName}`;

		if (changelogFetching) {
			return (
				<View style={{ padding: 15, paddingBottom: 0 }}>
					{this.renderLoading()}
					{this.renderLoading()}
				</View>
			);
		}

		return (
			<View style={{ padding: 15, paddingBottom: 0 }}>
				{changelog.map(({ version, data }) => {
					const versionUrl = GitHubService.getVersionUrl(version);
					const onPress = () => Linking.openURL(versionUrl);

					return (
						<View style={{ paddingBottom: 15 }} key={version}>
							<List
								title={t(appVersion === version ? 'actual_version' : 'version', { version })}
								onPress={onPress}
								items={data}
								keyExtractor={item => `${version}.${item.title || item}`}
								renderItem={item => ChangelogScreen.renderItem(item, 15)}
								renderFooter={
									<BlockTemplate
										roundedBottom
										onPress={onPress}
										customBackground={colors.backgroundBlockAlt}
									>
										<Text
											style={{
												fontSize: 12,
												fontWeight: 'bold',
												color: colors.transfer,
											}}
										>
											{versionUrl.replace(/http(s?):\/\//, '')}
										</Text>
									</BlockTemplate>
								}
							/>
						</View>
					);
				})}
			</View>
		);
	}

	render() {
		const { lang, navigation } = this.props;
		const titled = navigation.getParam('titled');

		return (
			<ValidationScreen
				buttonColor={colors.primary}
				text={this.getStoreText()}
				onPress={() => Linking.openURL(Platform.OS === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL)}
			>
				<ScrollView style={{ backgroundColor: colors.backgroundLight }}>
					{titled ? (
						<TitleParams title={t('title')} settingText={g(`langs.${lang}`)}>
							<TabsBlockTemplate
								roundedBottom
								text={t('lang')}
								tintColor={colors.secondary}
								value={lang}
								onChange={this.setLang.bind(this)}
								style={{ margin: 15, marginTop: 0, borderTopWidth: 0 }}
								tabs={g('langs')}
							/>
						</TitleParams>
					) : null}
					{this.renderChangelog()}
				</ScrollView>
			</ValidationScreen>
		);
	}
}

const mapStateToProps = ({ github, config: { lang } }) => {
	const release = github.getLastestRelease();
	const changelog = github.getChangelog();

	return {
		lang,
		release: release.getData({}),
		changelog: changelog.getData([]),
		changelogFetching: changelog.isFetching(),
	};
};

export default connect(mapStateToProps)(ChangelogScreen);
