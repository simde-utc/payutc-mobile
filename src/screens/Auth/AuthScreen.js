/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, Image, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import Logo from '../../images/payutc-logo.png';
import CASAuth from '../../services/CASAuth';
import PayUTC from '../../services/PayUTC';
import { Config } from '../../redux/actions';
import { _, Auth as t, Global as g } from '../../utils/i18n';

class AuthScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		header: null,
		headerVisible: false,
	});

	constructor(props) {
		super(props);

		this.state = {
			login: null,
			password: null,
		};

		this.switchLang = this.switchLang.bind(this);
	}

	onLoginChange(login) {
		this.setState({ login });
	}

	onPasswordChange(password) {
		this.setState({ password });
	}

	switchLang() {
		const { lang, dispatch } = this.props;

		const langs = g('langs');
		const langKeys = Object.keys(langs);
		const currentIndex = langKeys.indexOf(lang);

		dispatch(Config.setLang(langKeys[(currentIndex + 1) % langKeys.length]));
	}

	isButtonDisabled() {
		const { login, password } = this.state;

		return login == null || password == null;
	}

	connectWithCas() {
		const { dispatch } = this.props;
		const { login, password } = this.state;

		dispatch(
			Config.spinner({
				visible: true,
				textContent: t('cas_connection'),
			})
		);

		return CASAuth.login(login, password).then(() => {
			dispatch(
				Config.spinner({
					visible: true,
					textContent: t('payutc_connection'),
				})
			);

			return PayUTC.connectWithCas(login, password);
		});
	}

	connectWithEmail() {
		const { dispatch } = this.props;
		const { login, password } = this.state;

		dispatch(
			Config.spinner({
				visible: true,
				textContent: t('payutc_connection'),
			})
		);

		return PayUTC.connectWithEmail(login, password);
	}

	submit() {
		const { navigation, dispatch } = this.props;
		const { login } = this.state;
		let promise;

		if (login.includes('@')) {
			promise = this.connectWithEmail();
		} else {
			promise = this.connectWithCas();
		}

		promise
			.then(() => {
				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				navigation.navigate('Home');
			})
			.catch(e => {
				console.log(e);

				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				Alert.alert(t('title'), t('bad_login_password'), [{ text: _('continue') }], {
					cancelable: true,
				});
			});
	}

	render() {
		const { lang, navigation } = this.props;
		const { login, password } = this.state;

		return (
			<KeyboardAwareScrollView
				style={{ flex: 1, backgroundColor: colors.backgroundLight, padding: 40, paddingTop: 20 }}
			>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'flex-end',
						paddingBottom: 20,
					}}
				>
					<BlockTemplate
						roundedTop
						roundedBottom
						shadow
						style={{ paddingVertical: 5 }}
						onPress={this.switchLang}
					>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
							<Text
								style={{
									fontSize: 14,
									fontWeight: 'bold',
									color: colors.secondary,
									marginRight: 5,
								}}
							>
								{g(`langs.${lang}`)}
							</Text>
							<FontAwesomeIcon icon={['fas', 'globe']} size={14} color={colors.secondary} />
						</View>
					</BlockTemplate>
				</View>
				<View style={{ alignItems: 'center', marginBottom: 40 }}>
					<Image source={Logo} resizeMode="contain" style={{ height: 180, width: 180 }} />
				</View>
				<BlockTemplate roundedTop roundedBottom shadow>
					<Text
						style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary, marginBottom: 5 }}
					>
						{t('login_label')}
					</Text>
					<TextInput
						style={{
							fontSize: 18,
							color: colors.primary,
						}}
						keyboardType="email-address"
						autoCapitalize="none"
						placeholder={t('login_placeholder')}
						selectionColor={colors.primary}
						textContentType="none"
						autoCorrect={false}
						onChangeText={login => this.onLoginChange(login)}
						value={login}
					/>
				</BlockTemplate>
				<View style={{ marginTop: 20 }} />
				<BlockTemplate roundedTop roundedBottom shadow>
					<Text
						style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary, marginBottom: 5 }}
					>
						{t('password_label')}
					</Text>
					<TextInput
						style={{
							fontSize: 18,
							color: colors.primary,
						}}
						keyboardType="default"
						autoCapitalize="none"
						secureTextEntry
						placeholder={t('password_placeholder')}
						selectionColor={colors.primary}
						textContentType="none"
						autoCorrect={false}
						onChangeText={pwd => this.onPasswordChange(pwd)}
						value={password}
					/>
				</BlockTemplate>
				<View style={{ marginTop: 20 }} />
				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					customBackground={this.isButtonDisabled() ? colors.disabled : colors.primary}
					disabled={this.isButtonDisabled()}
					onPress={() => this.submit()}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: 'bold',
							textAlign: 'center',
							color: colors.backgroundBlock,
						}}
					>
						{t('button')}
					</Text>
				</BlockTemplate>
				<TouchableOpacity onPress={() => navigation.navigate('About')}>
					<Text
						style={{ paddingTop: 3, color: colors.secondary, fontSize: 12, textAlign: 'center' }}
					>
						{t('valid_terms', { button: t('button') })}
					</Text>
				</TouchableOpacity>
			</KeyboardAwareScrollView>
		);
	}
}

const mapStateToProps = ({ config: { lang } }) => ({ lang });

export default connect(mapStateToProps)(AuthScreen);
