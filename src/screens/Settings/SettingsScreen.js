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
	Platform,
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
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
import { ANDROID_STORE_URL, IOS_STORE_URL, PAYUTC_EMAIL } from '../../../config';
import GitHubService from '../../services/GitHub';
import BlockTemplate from '../../components/BlockTemplate';
import SwitchBlockTemplate from '../../components/SwitchBlockTemplate';
import BiometricAuth, { advancedSecurity, defaultSecurity } from '../../services/BiometricAuth';

class SettingsScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: {
			borderBottomWidth: 0,
			backgroundColor: colors.backgroundBlock,
		},
		headerTintColor: colors.primary,
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

		this.state = {
			hasBiometricHardware: null,
		};

		this.biometricAuth = React.createRef();

		this.setLang = this.setLang.bind(this);
		this.setTheme = this.setTheme.bind(this);
		this.setRestrictions = this.setRestrictions.bind(this);
		this.setAppOpeningSecurity = this.setAppOpeningSecurity.bind(this);
	}

	componentDidMount() {
		BiometricAuth.hasHardware()
			.then(hasHardware => {
				this.setState({ hasBiometricHardware: hasHardware });
			})
			.catch(() => {});
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

	setRestrictions(enabled) {
		const { dispatch } = this.props;

		this.biometricAuth.authenticate(() =>
			dispatch(Config.setRestrictions(enabled ? defaultSecurity : []))
		);
	}

	setAppOpeningSecurity(advanced) {
		const { dispatch } = this.props;

		dispatch(Config.setRestrictions(advanced ? advancedSecurity : defaultSecurity));
	}

	render() {
		const {
			details,
			detailsFetching,
			lang,
			theme,
			dispatch,
			navigation,
			restrictions,
		} = this.props;
		const { hasBiometricHardware } = this.state;

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
				<Paragraphe
					style={{ margin: 15 }}
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

				<BlockTemplate roundedTop roundedBottom shadow style={{ margin: 15, marginTop: 0 }}>
					<Text
						style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary, marginBottom: 10 }}
					>
						{t('lang')}
					</Text>

					<TabsBlockTemplate
						roundedTop
						roundedBottom
						tintColor={colors.secondary}
						value={lang}
						onChange={this.setLang}
						tabs={g('langs')}
						justifyContent="flex-start"
						backgroundColor={colors.backgroundBlock}
					/>
					<TouchableOpacity
						style={{
							marginTop: 10,
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
				</BlockTemplate>

				<BlockTemplate roundedTop roundedBottom shadow style={{ margin: 15, marginTop: 0 }}>
					<Text
						style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary, marginBottom: 10 }}
					>
						{t('theme')}
					</Text>

					<TabsBlockTemplate
						roundedTop
						roundedBottom
						tintColor={colors.secondary}
						value={theme}
						onChange={this.setTheme}
						tabs={SettingsScreen.getThemes()}
						justifyContent="flex-start"
						backgroundColor={colors.backgroundBlock}
					/>
				</BlockTemplate>

				<BlockTemplate style={{ margin: 15, marginTop: 0 }} roundedTop roundedBottom shadow>
					<Text
						style={{
							fontSize: 16,
							fontWeight: 'bold',
							color: hasBiometricHardware ? colors.secondary : colors.disabled,
						}}
					>
						{t('security')}
					</Text>

					<SwitchBlockTemplate
						value={restrictions.length > 0}
						onValueChange={this.setRestrictions}
						tintColor={colors.primary}
						style={{ marginTop: 10, padding: 0 }}
						disabled={!hasBiometricHardware}
					>
						<View style={{ flex: 1, flexDirection: 'column' }}>
							<Text
								style={{
									fontSize: 13,
									fontWeight: 'bold',
									color: hasBiometricHardware ? colors.secondary : colors.disabled,
								}}
							>
								{t('security_mode')}
							</Text>
							<Text
								style={{
									fontSize: 13,
									color: hasBiometricHardware ? colors.secondary : colors.disabled,
								}}
							>
								{t('security_mode_desc')}
							</Text>
						</View>
					</SwitchBlockTemplate>

					{restrictions.length > 0 ? (
						<SwitchBlockTemplate
							roundedBottom
							value={restrictions.includes('APP_OPENING')}
							onValueChange={this.setAppOpeningSecurity}
							tintColor={colors.primary}
							style={{ marginTop: 10, padding: 0 }}
							disabled={!hasBiometricHardware}
						>
							<View style={{ flex: 1, flexDirection: 'column' }}>
								<Text
									style={{
										fontSize: 13,
										fontWeight: 'bold',
										color: hasBiometricHardware ? colors.secondary : colors.disabled,
									}}
								>
									{t('security_mode_app_opening')}
								</Text>
								<Text
									style={{
										fontSize: 13,
										color: hasBiometricHardware ? colors.secondary : colors.disabled,
									}}
								>
									{t('security_mode_app_opening_desc')}
								</Text>
							</View>
						</SwitchBlockTemplate>
					) : null}
				</BlockTemplate>

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

				<BiometricAuth
					ref={ref => (this.biometricAuth = ref)}
					restrictions={restrictions}
					dispatch={dispatch}
					navigation={navigation}
				/>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ payutc, config: { lang, theme, restrictions } }) => {
	const details = payutc.getWalletDetails();

	return {
		lang,
		theme,
		restrictions,
		details: details.getData({}),
		detailsFetching: details.isFetching(),
		detailsFetched: details.isFetched(),
	};
};

export default connect(mapStateToProps)(SettingsScreen);
