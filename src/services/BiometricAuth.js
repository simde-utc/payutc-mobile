/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Modal, Platform, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { _, BiometricAuth as t } from '../utils/i18n';
import colors from '../styles/colors';
import BlockTemplate from '../components/BlockTemplate';

export const defaultSecurity = ['transfer', 'refill', 'badge-locking'];
export const advancedSecurity = ['transfer', 'refill', 'badge-locking', 'app-opening'];

export default class BiometricAuth extends React.PureComponent {
	static async hasHardware() {
		return LocalAuthentication.hasHardwareAsync();
	}

	constructor(props) {
		super(props);
		this.state = {
			showAndroidModal: false,
			accepted: false,
		};
	}

	async authenticate(successCallback, errorCallback, message = t('default_message')) {
		const { restrictions, action } = this.props;

		const hasHardware = await BiometricAuth.hasHardware();
		if (!hasHardware) {
			successCallback();
			return;
		}

		if (action != null && !restrictions.includes(action)) {
			successCallback();
			return;
		}

		try {
			this.setState({ showAndroidModal: true });

			const authentication = await LocalAuthentication.authenticateAsync({
				promptMessage: message,
			});

			this.setState({ showAndroidModal: false });

			if (authentication.success) {
				successCallback();
			} else {
				errorCallback();
			}
		} catch (e) {
			console.warn(e);
		}
	}

	async cancel() {
		if (Platform.OS === 'android') {
			this.setState({ showAndroidModal: false });
			await LocalAuthentication.cancelAuthenticate();
		}
	}

	render() {
		const { showAndroidModal, accepted } = this.state;

		return (
			<Modal
				animationType="slide"
				transparent
				visible={Platform.OS === 'android' && showAndroidModal}
			>
				<View style={{ flex: 3 }} />
				<BlockTemplate
					roundedTop
					style={{
						flex: 2,
						backgroundColor: colors.backgroundBlock,
						alignItems: 'center',
						justifyContent: 'space-around',
					}}
				>
					<View>
						<Text
							style={{
								fontSize: 18,
								fontWeight: 'bold',
								textAlign: 'center',
								color: colors.secondary,
							}}
						>
							{t('title')}
						</Text>

						<Text style={{ fontSize: 16, color: colors.secondary }}>{t('default_message')}</Text>

						<FontAwesomeIcon
							icon={['fa', 'fingerprint']}
							size={75}
							style={{
								color: accepted ? colors.primary : colors.secondary,
								marginTop: 15,
								alignSelf: 'center',
							}}
						/>
					</View>

					<BlockTemplate roundedTop roundedBottom shadow onPress={() => this.cancel()}>
						<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
							<FontAwesomeIcon
								icon={['fa', 'times']}
								size={20}
								style={{ color: colors.secondary }}
							/>
							<Text
								style={{
									marginLeft: 15,
									fontSize: 15,
									fontWeight: 'bold',
									color: colors.secondary,
								}}
							>
								{_('cancel')}
							</Text>
						</View>
					</BlockTemplate>
				</BlockTemplate>
			</Modal>
		);
	}
}
