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
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import PayUTC from '../services/PayUTC';
import CASAuth from '../services/CASAuth';
import payutcLogo from '../images/payutc-logo.png';
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
		const { dispatch } = this.props;

		dispatch(Config.setLang('fr'));

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
					{text}
				</Text>
			</View>
		);
	}
}

export default connect()(AppLoaderScreen);
