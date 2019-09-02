/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, Image, Text, TextInput, View, TouchableOpacity, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import { TERMS_VERSION } from '../Settings/TermsScreen';
import Logo from '../../images/payutc-logo.png';
import CASAuth from '../../services/CASAuth';
import PayUTC from '../../services/PayUTC';
import Ginger from '../../services/Ginger';
import { Config } from '../../redux/actions';
import { _, Auth as t, Global as g } from '../../utils/i18n';
import { isUserExt } from '../../utils';

class AuthScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		header: null,
		headerVisible: false,
		headerTruncatedBackTitle: _('back'),
	});

	constructor(props) {
		super(props);

		this.state = {
			login: null,
			password: null,
			needValidation: false,
		};

		this.switchLang = this.switchLang.bind(this);
		this.dismissWrong = this.dismissWrong.bind(this);
		this.handleNavigationOnFocus = this.handleNavigationOnFocus.bind(this);
	}

	componentDidMount() {
		const { navigation } = this.props;

		this.subscriptions = [navigation.addListener('willFocus', this.handleNavigationOnFocus)];
	}

	componentWillUnmount() {
		this.subscriptions.forEach(subscription => subscription.remove());
	}

	onLoginChange(login) {
		this.setState({ login });
	}

	onPasswordChange(password) {
		this.setState({ password });
	}

	// https://facebook.github.io/react-native/docs/alert.html#ios
	getAlertButtons() {
		if (Platform.OS === 'ios') {
			return [
				{
					text: _('ok'),
					onPress: this.dismissWrong,
				},
			];
		}

		return [
			{},
			{
				text: _('ok'),
				onPress: this.dismissWrong,
			},
		];
	}

	handleNavigationOnFocus({ action: { params } }) {
		const { needValidation } = this.state;

		if (needValidation && this.areTermsValidated() && !this.isButtonDisabled()) {
			this.setState({ needValidation: false });

			this.submit();
		} else if (this.isButtonDisabled()) {
			this.setState(prevState => ({
				...prevState,
				login: params ? params.login : prevState.login,
			}));
		}
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

	areTermsValidated() {
		const { terms } = this.props;

		return terms.version === TERMS_VERSION;
	}

	checkGingerStatus(login) {
		const { dispatch } = this.props;

		dispatch(
			Config.spinner({
				visible: true,
				textContent: t('ginger_verification'),
			})
		);

		Ginger.getInformation(login)
			.catch(() => this.openWrongCas())
			.then(() => this.openNouvoPopup());
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

		return CASAuth.login(login, password)
			.then(() => {
				dispatch(
					Config.spinner({
						visible: true,
						textContent: t('payutc_connection'),
					})
				);

				return PayUTC.connectWithCas(login, password)
					.then(() => this.goHome())
					.catch(() => this.checkGingerStatus(login));
			})
			.catch(() => this.openWrongCas());
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

		PayUTC.connectWithEmail(login, password)
			.then(() => this.goHome())
			.catch(() => this.openWrongExt());
	}

	submit() {
		const { navigation } = this.props;
		const { login } = this.state;

		if (!this.areTermsValidated()) {
			this.setState({ needValidation: true });

			return navigation.navigate('Terms', { quick: true });
		}

		if (isUserExt(login)) {
			this.connectWithEmail();
		} else {
			this.connectWithCas();
		}
	}

	goHome() {
		const { navigation, dispatch } = this.props;

		dispatch(
			Config.spinner({
				visible: false,
			})
		);

		navigation.navigate('Home');
	}

	openWrongExt() {
		Alert.alert(
			t('bad_login_password'),
			t('wrong_ext'),
			[
				{
					text: t('i_am_cas'),
					style: 'neutral',
					onPress: () => this.openWrongCas(),
				},
				...this.getAlertButtons(),
			],
			{
				cancelable: true,
				onDismiss: this.dismissWrong,
			}
		);
	}

	openWrongCas() {
		Alert.alert(
			t('bad_login_password'),
			t('wrong_cas'),
			[
				{
					text: t('i_am_ext'),
					style: 'neutral',
					onPress: () => this.openWrongExt(),
				},
				...this.getAlertButtons(),
			],
			{
				cancelable: true,
				onDismiss: this.dismissWrong,
			}
		);
	}

	openNouvoPopup() {
		Alert.alert(t('hey_nouvo'), t('wrong_nouvo'), this.getAlertButtons(), {
			cancelable: true,
			onDismiss: this.dismissWrong,
		});
	}

	dismissWrong() {
		const { dispatch } = this.props;

		dispatch(
			Config.spinner({
				visible: false,
			})
		);
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
							padding: 0,
							margin: 0,
						}}
						keyboardType="email-address"
						autoCapitalize="none"
						placeholder={t('login_placeholder')}
						textContentType="none"
						autoCorrect={false}
						onChangeText={login => this.onLoginChange(login)}
						onSubmitEditing={() => this.passwordInput.focus()}
						blurOnSubmit={false}
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
							padding: 0,
							margin: 0,
						}}
						keyboardType="default"
						autoCapitalize="none"
						secureTextEntry
						placeholder={t('password_placeholder')}
						textContentType="none"
						autoCorrect={false}
						ref={input => (this.passwordInput = input)}
						onChangeText={pwd => this.onPasswordChange(pwd)}
						onSubmitEditing={() => !this.isButtonDisabled() && this.submit()}
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

const mapStateToProps = ({ config: { lang, terms } }) => ({ lang, terms });

export default connect(mapStateToProps)(AuthScreen);
