/**
 * First screen in order to load every data.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, Text, Image, Platform, NativeModules, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { TERMS_VERSION } from './Settings/TermsScreen';
import PayUTC from '../services/PayUTC';
import CASAuth from '../services/CASAuth';
import Storage from '../services/Storage';
import payutcLogo from '../images/payutc-logo.png';
import colors from '../styles/colors';
import { Config } from '../redux/actions';
import i18n, { AppLoader as t } from '../utils/i18n';
import config from '../../config';
import configExemple from '../../config.example';

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

	areTermsValidated() {
		const { terms } = this.props;

		return terms.version === TERMS_VERSION;
	}

	loadData() {
		this.setState({
			lazyText: 'loading',
		});

		return PayUTC.getData()
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
				return PayUTC.connectWithCas(login, password);
			})
			.catch(() => {
				this.setState({
					lazyText: 'connect_cas',
				});

				return CASAuth.login(login, password)
					.then(() => {
						return PayUTC.connectWithCas(login, password);
					})
					.catch(() => {
						return this.reinitData();
					});
			});
	}

	login(data) {
		if (!this.areTermsValidated()) {
			this.setState({ screen: 'Auth', data });

			return false;
		}

		if (data.type === PayUTC.CAS_AUTH_TYPE) {
			return this.checkCasConnection(data.ticket, data.login, data.password);
		}
		if (data.type === PayUTC.EMAIL_AUTH_TYPE) {
			return PayUTC.connectWithEmail(data.login, data.password);
		}

		return this.reinitData();
	}

	reinitData() {
		this.setState({
			lazyText: 'reset_data',
			screen: 'Auth',
		});

		return new Promise.all(Storage.removeData('config'), PayUTC.forget());
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

				return this.loadData();
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
