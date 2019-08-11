/**
 * First screen in order to load every data.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import i18nJs from 'i18n-js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import PayUTC from '../services/PayUTC';
import CASAuth from '../services/CASAuth';
import payutcLogo from '../images/payutc-logo.png';
import styles from '../styles';
import colors from '../styles/colors';
import { _, AppLoader as t } from '../utils/i18n';

export default class AppLoaderScreen extends React.Component {
	static loadLocale() {
		i18nJs.locale = 'fr';
	}

	static loadLibrairies() {
		library.add(fas, far);
	}

	static handleError(error) {
		console.warn(error);
	}

	constructor(props) {
		super(props);

		this.state = {
			text: t('loading'),
			screen: 'Auth',
		};
	}

	componentWillMount() {
		this.bootstrap()
			.then(this.appLoaded.bind(this))
			.catch(error => AppLoaderScreen.handleError.bind(this, error));
	}

	checkCasConnection(ticket, login, password) {
		return CASAuth.isTicketValid(ticket)
			.then(() => {
				return PayUTC.connectWithCas(login, password);
			})
			.catch(() => {
				this.setState({
					text: t('connect_cas'),
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
			text: t('reset_data'),
			screen: 'Auth',
		});

		return PayUTC.forget();
	}

	bootstrap() {
		AppLoaderScreen.loadLocale();
		AppLoaderScreen.loadLibrairies();

		this.setState({
			text: _('loading'),
		});

		return PayUTC.getData()
			.then(data => {
				if (data) {
					this.setState({
						text: t('reconnection'),
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

	appLoaded() {
		const { navigation } = this.props;
		const { screen } = this.state;

		navigation.navigate(screen);
	}

	render() {
		const { text } = this.state;

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
					{text}
				</Text>
			</View>
		);
	}
}
