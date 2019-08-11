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
import { far } from '@fortawesome/free-regular-svg-icons';

import PayUTC from '../services/PayUTC';
import CASAuth from '../services/CASAuth';
import Storage from '../services/Storage';
import payutcLogo from '../images/payutc-logo.png';
import styles from '../styles';
import colors from '../styles/colors';
import { Config } from '../redux/actions';
import { _, AppLoader as t } from '../utils/i18n';

class AppLoaderScreen extends React.Component {
	static loadLibrairies() {
		library.add(fas, far);
	}

	static handleError(error) {
		console.warn(error);
	}

	constructor(props) {
		super(props);

		this.state = {
			lazyText: null,
			screen: 'Auth',
		};
	}

	componentWillMount() {
		this.bootstrap()
			.then(this.appLoaded.bind(this))
			.catch(error => AppLoaderScreen.handleError.bind(this, error));
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

		return Storage.getData('config').then(data => {
			const { dispatch } = this.props;

			if (data) {
				data.spinner.visible = false;

				dispatch(Config.set(data));
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
		});
	}

	appLoaded() {
		const { navigation } = this.props;
		const { screen } = this.state;

		navigation.navigate(screen);
	}

	render() {
		const { lazyText } = this.state;

		return (
			<View style={styles.container.center}>
				<Image source={payutcLogo} style={styles.img.logoStyle} resizeMode="contain" />
				<ActivityIndicator size="large" color={colors.yellow} />
				<Text
					style={[
						styles.get('text.h3', 'text.center', 'text.h3'),
						{ height: 100, width: 250, marginTop: 10 },
					]}
				>
					{lazyText ? t(lazyText) : _('loading_text_replacement')}
				</Text>
			</View>
		);
	}
}

export default connect()(AppLoaderScreen);
