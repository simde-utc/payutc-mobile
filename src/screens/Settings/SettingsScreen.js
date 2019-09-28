/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import {
	Linking,
	RefreshControl,
	ScrollView,
	Text,
	View,
	Platform,
	TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors from '../../styles/colors';
import themes from '../../../assets/themes.json';
import TabsBlockTemplate from '../../components/TabsBlockTemplate';
import Paragraphe from '../../components/Paragraphe';
import LinkButton from '../../components/LinkButton';
import { _, Global as g, Settings as t } from '../../utils/i18n';
import { Config, PayUTC } from '../../redux/actions';
import { PAYUTC_EMAIL, IOS_STORE_URL, ANDROID_STORE_URL } from '../../../config';
import BlockTemplate from '../../components/BlockTemplate';
import GitHubService from '../../services/GitHub';

class SettingsScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
		headerTruncatedBackTitle: _('back'),
	});

	static getThemes() {
		const tabs = {};
		const keys = Object.keys(themes);

		for (const key in keys) {
			const name = keys[key];
			if (!themes[name].hidden) tabs[name] = t(`themes.${name}`);
		}

		return tabs;
	}

	constructor(props) {
		super(props);

		this.setLang = this.setLang.bind(this);
		this.setTheme = this.setTheme.bind(this);
	}

	onRefresh() {
		const { detailsFetching, dispatch } = this.props;

		if (!detailsFetching) {
			dispatch(PayUTC.getWalletDetails());
		}
	}

	setLang(lang) {
		const { dispatch } = this.props;

		dispatch(Config.setLang(lang));
	}

	setTheme(theme) {
		const { dispatch } = this.props;

		dispatch(Config.setTheme(theme));
	}

	render() {
		const { details, detailsFetching, lang, theme, navigation } = this.props;

		const repoUrl = GitHubService.getLocalesUrl();

		return (
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={detailsFetching}
						onRefresh={() => this.onRefresh()}
						colors={[colors.secondary]}
						tintColor={colors.secondary}
					/>
				}
				style={{ backgroundColor: colors.background }}
			>
				<BlockTemplate roundedTop roundedBottom shadow style={{ margin: 15, marginBottom: 0 }}>
					<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary }}>
						{t('title')}
					</Text>
				</BlockTemplate>

				<TabsBlockTemplate
					roundedTop
					roundedBottom
					shadow
					text={t('lang')}
					tintColor={colors.secondary}
					value={lang}
					onChange={this.setLang}
					tabs={g('langs')}
					justifyContent="flex-start"
					style={{ margin: 15 }}
				>
					<TouchableOpacity
						style={{
							margin: 10,
							marginTop: 0,
							flex: 1,
							flexDirection: 'row',
							justifyContent: 'flex-start',
						}}
						onPress={() => Linking.openURL(repoUrl)}
					>
						<Text
							style={{
								fontSize: 13,
								fontWeight: 'bold',
								textDecorationLine: 'underline',
								color: colors.secondary,
								marginRight: 5,
							}}
						>
							{t('translate')}
						</Text>
						<FontAwesomeIcon
							icon={['fas', 'external-link-alt' || 'sliders-h']}
							size={13}
							color={colors.secondary}
						/>
					</TouchableOpacity>
				</TabsBlockTemplate>

				<TabsBlockTemplate
					roundedTop
					roundedBottom
					shadow
					text={t('theme')}
					tintColor={colors.secondary}
					value={theme}
					onChange={this.setTheme}
					tabs={SettingsScreen.getThemes()}
					justifyContent="flex-start"
					style={{ margin: 15, marginTop: 0 }}
				/>

				<Paragraphe
					style={{ margin: 15, marginTop: 0 }}
					title={
						detailsFetching
							? _('loading_text_replacement')
							: `${details.user.first_name} ${details.user.last_name}`
					}
					description={t('profile_desc')}
					onPress={() => navigation.navigate('Profile')}
					titleColor={colors.primary}
					link
				/>

				<View
					style={{
						marginHorizontal: 50,
						borderBottomWidth: 1,
						borderBottomColor: colors.backgroundBlock,
					}}
				/>

				<LinkButton
					text={t('about')}
					onPress={() => navigation.navigate('About')}
					style={{ margin: 15 }}
				/>

				<LinkButton
					text={t('contact_us')}
					onPress={() =>
						Linking.openURL(`mailto:${PAYUTC_EMAIL}?subject=[App] &body=${t('mail_body')}`)
					}
					style={{ margin: 15, marginTop: 0 }}
				/>

				<LinkButton
					text={t('opinion')}
					color={colors.primary}
					onPress={() => Linking.openURL(Platform.OS === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL)}
					style={{ margin: 15, marginTop: 0 }}
				/>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ payutc, config: { lang, theme } }) => {
	const details = payutc.getWalletDetails();

	return {
		lang,
		theme,
		details: details.getData({}),
		detailsFetching: details.isFetching(),
		detailsFetched: details.isFetched(),
	};
};

export default connect(mapStateToProps)(SettingsScreen);
