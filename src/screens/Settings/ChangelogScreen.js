/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { FlatList, Linking, ScrollView, Text, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import VersionNumber from 'react-native-version-number';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ValidationScreen from '../../components/ValidationScreen';
import BlockTemplate from '../../components/BlockTemplate';
import List from '../../components/List';
import { GitHub } from '../../redux/actions';
import GitHubService from '../../services/GitHub';
import colors from '../../styles/colors';
import { Changelog as t } from '../../utils/i18n';
import { IOS_STORE_URL, ANDROID_STORE_URL } from '../../../config';
import fr from '../../changelogs/fr';
import en from '../../changelogs/en';

const CHANGELOGS = {
	fr,
	en,
};

class ChangelogScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
	});

	componentDidMount() {
		const { dispatch } = this.props;

		dispatch(GitHub.getLastestRelease());
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
		const { appVersion } = VersionNumber;

		if (!appVersion || !tagName || `v${appVersion}` === tagName) {
			return t('go_to_store');
		}

		return t('update_store', { version: tagName });
	}

	render() {
		const { lang } = this.props;
		const changelog = CHANGELOGS[lang];

		return (
			<ValidationScreen
				buttonColor={colors.primary}
				text={this.getStoreText()}
				onPress={() => Linking.openURL(Platform.OS === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL)}
			>
				<ScrollView style={{ backgroundColor: colors.backgroundLight }}>
					<View style={{ padding: 15 }}>
						<FlatList
							data={Object.keys(changelog)}
							keyExtractor={version => version}
							renderItem={({ item: version }) => {
								const versionUrl = GitHubService.getVersionUrl(version);
								const onPress = () => Linking.openURL(versionUrl);

								return (
									<>
										<List
											title={t('version', { version })}
											onPress={onPress}
											items={changelog[version]}
											keyExtractor={item => `${version}.${item.title || item}`}
											renderItem={item => ChangelogScreen.renderItem(item, 15)}
										/>
										<BlockTemplate roundedBottom onPress={onPress}>
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
									</>
								);
							}}
							ItemSeparatorComponent={<View style={{ height: 15 }} />}
						/>
					</View>
				</ScrollView>
			</ValidationScreen>
		);
	}
}

const mapStateToProps = ({ github, config: { lang } }) => {
	const release = github.getLastestRelease();

	return {
		lang,
		release: release.getData({}),
	};
};

export default connect(mapStateToProps)(ChangelogScreen);
