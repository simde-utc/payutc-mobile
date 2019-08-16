/**
 * First screen in order to load every data.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, Text, Image, Platform, NativeModules, Alert, ActivityIndicator } from 'react-native';
import VersionNumber from 'react-native-version-number';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { TERMS_VERSION } from './Settings/TermsScreen';
import PayUTCService from '../services/PayUTC';
import CASAuth from '../services/CASAuth';
import Storage from '../services/Storage';
import payutcLogo from '../images/payutc-logo.png';
import colors from '../styles/colors';
import { PayUTC, GitHub, Config } from '../redux/actions';
import i18n, { _, AppLoader as t } from '../utils/i18n';
import config from '../../config';
import configExemple from '../../config.example';

const REGEX_VERSION = /^([0-9])+\.([0-9])+\.([0-9])-*.*$/;
const REGEX_DEPRECATED_VERSION = /# Deprecated versions: < v(.*)$/;

class AppLoaderScreen extends React.Component {
	static loadLibrairies() {
		library.add(fas);
	}

	static handleError(error) {
		console.warn(error);
	}

	static checkConfigs() {
		const keys = Object.keys(config);
		const exampleKeys = Object.keys(configExemple);

		if (
			keys.length !== exampleKeys.length ||
			!exampleKeys.sort().some((value, index) => value === keys.sort()[index])
		) {
			console.warn(t('config_keys_error'));
		} else if (Object.values(config).some(value => value === '' || value === null)) {
			console.warn(t('config_values_error'));
		}
	}

	static isVersionDeprecated(appVersion, maxVersion) {
		const [x1, y1, z1] = appVersion.match(REGEX_VERSION).slice(1);
		const [x2, y2, z2] = maxVersion.match(REGEX_VERSION).slice(1);

		return x1 <= x2 && y1 <= y2 && z1 < z2;
	}

	constructor(props) {
		super(props);

		this.state = {
			lazyText: null,
			screen: 'Auth',
			data: {},
		};
	}

	componentDidMount() {
		this.bootstrap()
			.then(this.appLoaded.bind(this))
			.catch(error => AppLoaderScreen.handleError.bind(this, error));
	}

	checkApp() {
		const { dispatch, navigation } = this.props;

		this.setState({
			lazyText: 'checking',
		});

		const action = GitHub.getLastestRelease();
		dispatch(action);

		return action.payload.then(([{ body, tag_name: tagName }]) => {
			const { appVersion } = VersionNumber;

			if (appVersion && tagName && `v${appVersion}` !== tagName) {
				const matches = body.match(REGEX_DEPRECATED_VERSION);

				if (
					matches &&
					matches.length === 2 &&
					AppLoaderScreen.isVersionDeprecated(appVersion, matches[1])
				) {
					Alert.alert(
						t('need_update'),
						t('new_update', { version: tagName }),
						[
							{
								text: _('ok'),
							},
						],
						{ cancelable: false }
					);

					return this.setState({ screen: 'Changelog', data: { titled: true } });
				}

				this.setState({
					data: {
						message: t('new_update', { version: tagName }),
						backgroundColor: colors.transfer,
						onPress: () => navigation.navigate('Changelog'),
					},
				});
			}

			return this.loadData();
		});
	}

	areTermsValidated() {
		const { terms } = this.props;

		return terms.version === TERMS_VERSION;
	}

	loadUserData() {
		const { dispatch } = this.props;
		const action = PayUTC.getWalletDetails();

		this.setState({
			lazyText: 'fetch_user_data',
		});

		dispatch(action);

		return action.payload;
	}

	loadData() {
		this.setState({
			lazyText: 'loading',
		});

		return PayUTCService.getData()
			.then(data => {
				if (data) {
					this.setState({
						lazyText: 'reconnection',
						screen: 'Home',
					});

					return this.login(data);
				}

				return false;
			})
			.catch(() => {
				return this.reinitData();
			});
	}

	checkCasConnection(ticket, login, password) {
		return CASAuth.isTicketValid(ticket)
			.then(() => {
				return PayUTCService.connectWithCas(login, password).then(() => this.loadUserData());
			})
			.catch(() => {
				this.setState({
					lazyText: 'connect_cas',
				});

				return CASAuth.login(login, password)
					.then(() => {
						return PayUTCService.connectWithCas(login, password).then(() => this.loadUserData());
					})
					.catch(() => {
						return this.reinitData(login);
					});
			});
	}

	login(data) {
		if (!this.areTermsValidated()) {
			Alert.alert(
				t('need_terms'),
				t('new_terms'),
				[
					{
						text: _('ok'),
					},
				],
				{ cancelable: false }
			);

			return this.setState({ screen: 'Auth', data });
		}

		if (data.type === PayUTCService.CAS_AUTH_TYPE) {
			return this.checkCasConnection(data.ticket, data.login, data.password);
		}
		if (data.type === PayUTCService.EMAIL_AUTH_TYPE) {
			return PayUTCService.connectWithEmail(data.login, data.password).then(() =>
				this.loadUserData()
			);
		}

		return this.reinitData();
	}

	reinitData(login = '') {
		const { dispatch } = this.props;

		this.setState({
			lazyText: 'reset_data',
			screen: 'Auth',
			data: { login },
		});

		dispatch(Config.wipe());

		return PayUTCService.forget();
	}

	bootstrap() {
		AppLoaderScreen.loadLibrairies();

		i18n.locale = 'fr';

		return Storage.getData('config')
			.then(config => {
				const { dispatch } = this.props;

				if (config) {
					config.spinner.visible = false;

					dispatch(Config.set(config));
				} else {
					let lang;

					if (Platform.OS === 'ios') {
						lang = NativeModules.SettingsManager.settings.AppleLocale;
					} else {
						lang = NativeModules.I18nManager.localeIdentifier;
					}

					dispatch(Config.setLang(lang.split('_')[0]));
				}

				return this.checkApp();
			})
			.catch(() => this.reinitData());
	}

	appLoaded() {
		const { navigation } = this.props;
		const { screen, data } = this.state;

		AppLoaderScreen.checkConfigs();

		navigation.navigate(screen, data);
	}

	render() {
		const { lazyText } = this.state;

		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Image
					source={payutcLogo}
					style={{ height: '15%', width: '82%', marginBottom: 35 }}
					resizeMode="contain"
				/>
				<ActivityIndicator size="large" color={colors.secondary} />
				<Text
					style={{
						height: 100,
						width: 250,
						marginTop: 10,
						fontWeight: 'bold',
						fontSize: 18,
						textAlign: 'center',
						color: colors.secondary,
					}}
				>
					{lazyText ? t(lazyText) : ''}
				</Text>
			</View>
		);
	}
}

const mapStateToProps = ({ config: { terms } }) => ({ terms });

export default connect(mapStateToProps)(AppLoaderScreen);
