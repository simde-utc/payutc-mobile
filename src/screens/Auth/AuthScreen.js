/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import {
	Alert,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	View,
	TouchableOpacity,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { connect } from 'react-redux';
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
			showLogo: true,
		};

		this.switchLang = this.switchLang.bind(this);
		this.dismissWrong = this.dismissWrong.bind(this);
		this.handleNavigationOnFocus = this.handleNavigationOnFocus.bind(this);
		this.keyboardWillShow = this.keyboardWillShow.bind(this);
		this.keyboardWillHide = this.keyboardWillHide.bind(this);
	}

	componentDidMount() {
		const { navigation } = this.props;

		this.subscriptions = [navigation.addListener('willFocus', this.handleNavigationOnFocus)];

		this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
	}

	componentWillUnmount() {
		this.subscriptions.forEach(subscription => subscription.remove());
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
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

	keyboardWillShow() {
		this.setState({ showLogo: false });
	}

	keyboardWillHide() {
		this.setState({ showLogo: true });
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

		return !login || !password;
	}

	areTermsValidated() {
		const { terms } = this.props;

		return terms.version === TERMS_VERSION;
	}

	checkGingerStatus(login) {
		const { dispatch, navigation } = this.props;

		dispatch(
			Config.spinner({
				visible: true,
				textContent: t('ginger_verification'),
			})
		);

		Ginger.getInformation(login)
			.then(() => {
				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				this.setState({ needValidation: true });

				return navigation.navigate('PayutcTerms', { quick: true });
			})
			.catch(() => this.openNouvoPopup());
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

	renderLogo() {
		const { showLogo } = this.state;

		const logo = (
			<Image
				source={showLogo ? Logo : null}
				resizeMode="contain"
				style={{ height: '20%', marginBottom: 30 }}
			/>
		);

		return showLogo ? logo : null;
	}

	render() {
		const { lang, navigation } = this.props;
		const { login, password } = this.state;

		return (
			<>
				<BlockTemplate
					roundedTop
					roundedBottom
					borderRadius={45}
					style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}
					onPress={this.switchLang}
				>
					<Text
						style={{
							fontSize: 14,
							fontWeight: 'bold',
							color: colors.disabled,
							marginRight: 5,
						}}
					>
						{g(`langs.${lang}`)}
					</Text>

					<FontAwesomeIcon icon={['fas', 'globe']} size={14} color={colors.disabled} />
				</BlockTemplate>

				<KeyboardAvoidingView
					behavior="padding"
					style={{
						flex: 1,
						flexDirection: 'column',
						backgroundColor: colors.background,
						justifyContent: 'center',
					}}
				>
					{this.renderLogo()}

					<View style={{ padding: 30 }}>
						<BlockTemplate
							roundedTop
							roundedBottom
							borderRadius={45}
							style={{ marginBottom: 15, padding: 15, flexDirection: 'row' }}
						>
							<FontAwesomeIcon
								icon={['fas', 'user']}
								size={30}
								color={login ? colors.primary : colors.disabled}
							/>

							<TextInput
								style={{
									flex: 1,
									fontSize: 18,
									fontWeight: 'bold',
									color: colors.primary,
									marginLeft: 10,
								}}
								keyboardType="email-address"
								keyboardAppearance={colors.generalAspect}
								autoCapitalize="none"
								placeholder={t('login_label')}
								placeholderTextColor={colors.disabled}
								textContentType="none"
								autoCorrect={false}
								ref={input => (this.loginInput = input)}
								onChangeText={login => this.onLoginChange(login)}
								onSubmitEditing={() => this.passwordInput.focus()}
								blurOnSubmit={false}
								clearButtonMode="always"
								value={login}
							/>
						</BlockTemplate>

						<BlockTemplate
							roundedTop
							roundedBottom
							borderRadius={45}
							style={{ flexDirection: 'row', padding: 15 }}
						>
							<FontAwesomeIcon
								icon={['fas', 'key']}
								size={30}
								color={password ? colors.primary : colors.disabled}
							/>

							<TextInput
								style={{
									flex: 1,
									fontSize: 18,
									fontWeight: 'bold',
									color: colors.primary,
									marginLeft: 10,
								}}
								keyboardType="default"
								keyboardAppearance={colors.generalAspect}
								autoCapitalize="none"
								secureTextEntry
								placeholder={t('password_label')}
								placeholderTextColor={colors.disabled}
								textContentType="none"
								autoCorrect={false}
								ref={input => (this.passwordInput = input)}
								onChangeText={pwd => this.onPasswordChange(pwd)}
								onSubmitEditing={() => !this.isButtonDisabled() && this.submit()}
								clearButtonMode="always"
								value={password}
							/>
						</BlockTemplate>

						<View>
							<BlockTemplate
								roundedTop
								roundedBottom
								borderRadius={45}
								customBackground={this.isButtonDisabled() ? colors.disabled : colors.primary}
								disabled={this.isButtonDisabled()}
								onPress={() => this.submit()}
								style={{ marginTop: 30, padding: 15 }}
							>
								<Text
									style={{
										fontSize: 18,
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
									style={{
										fontSize: 12,
										fontWeight: 'bold',
										color: colors.secondary,
										marginHorizontal: 15,
										marginVertical: 5,
										textAlign: 'center',
									}}
								>
									{t('valid_terms', { button: t('button') })}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</>
		);
	}
}

const mapStateToProps = ({ config: { lang, terms } }) => ({ lang, terms });

export default connect(mapStateToProps)(AuthScreen);
