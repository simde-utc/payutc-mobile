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
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { _, BiometricAuth as t } from '../utils/i18n';
import colors from '../styles/colors';
import BlockTemplate from '../components/BlockTemplate';

export const defaultSecurity = ['TRANSFER', 'REFILL', 'BADGE_LOCKING'];
export const advancedSecurity = ['TRANSFER', 'REFILL', 'BADGE_LOCKING', 'APP_OPENING'];

export default class BiometricAuth extends React.PureComponent {
	static async hasHardware() {
		return LocalAuthentication.hasHardwareAsync();
	}

	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			accepted: false,
		};
	}

	async authenticate(successCallback, errorCallback) {
		const { restrictions, action } = this.props;

		if (action != null && !restrictions.includes(action)) {
			successCallback();
			return;
		}

		const hasHardware = await BiometricAuth.hasHardware();
		if (!hasHardware) {
			successCallback();
			return;
		}

		try {
			this.setState({ showModal: true });

			if (Platform.OS === 'android') {
				Haptics.notificationAsync('error').catch();
			}

			const authentication = await LocalAuthentication.authenticateAsync({
				promptMessage: t('default_message'),
			});

			this.setState({ showModal: false });

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
			this.setState({ showModal: false });
			await LocalAuthentication.cancelAuthenticate();
		}
	}

	render() {
		const { showModal, accepted } = this.state;

		if (Platform.OS === 'ios') {
			return (
				<Modal animationType="fade" transparent visible={showModal}>
					<BlurView tint={colors.generalAspect} intensity={75} style={{ flex: 1 }} />
				</Modal>
			);
		}

		if (Platform.OS === 'android') {
			return (
				<Modal animationType="slide" transparent visible={showModal}>
					<BlurView tint={colors.generalAspect} intensity={75} style={{ flex: 3 }} />
					<BlockTemplate
						roundedTop
						style={{
							flex: 2,
							backgroundColor: colors.backgroundBlockAlt,
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

						<BlockTemplate
							roundedTop
							roundedBottom
							borderForAndroid
							shadow
							onPress={() => this.cancel()}
						>
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
}
