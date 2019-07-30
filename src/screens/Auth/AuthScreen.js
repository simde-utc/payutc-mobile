/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Image, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import Logo from '../../images/payutc-logo.png';
import { Auth as t } from '../../utils/i18n';

export default class AuthScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerVisible: false,
	};

	constructor(props) {
		super(props);

		this.state = {
			login: null,
			password: null,
		};
	}

	onLoginChange(login) {
		this.setState({ login });
	}

	onPasswordChange(password) {
		this.setState({ password });
	}

	isButtonDisabled() {
		const { login, password } = this.state;

		return login == null || password == null;
	}

	submit() {
		const { navigation } = this.props;

		navigation.navigate('Home');
	}

	render() {
		const { login, password } = this.state;

		return (
			<KeyboardAwareScrollView
				style={{ flex: 1, backgroundColor: colors.backgroundLight, padding: 40 }}
			>
				<View style={{ alignItems: 'center', marginVertical: 40 }}>
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
			</KeyboardAwareScrollView>
		);
	}
}
