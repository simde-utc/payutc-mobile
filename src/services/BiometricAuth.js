/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Platform, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { BiometricAuth as t } from '../utils/i18n';
import ModalBlockTemplate from '../components/Modal/ModalBlockTemplate';
import colors from '../styles/colors';

export const defaultSecurity = ['transfer', 'refill', 'badge-locking'];
export const advancedSecurity = ['transfer', 'refill', 'badge-locking', 'app-opening'];

export default class BiometricAuth extends React.PureComponent {
	static hasHardware() {
		return LocalAuthentication.hasHardwareAsync();
	}

	constructor(props) {
		super(props);
		this.androidModal = React.createRef();
	}

	authenticate(successCallback, errorCallback, message = t('default_message')) {
		const { restrictions, action } = this.props;

		BiometricAuth.hasHardware()
			.then(hasHardware => {
				if (!hasHardware) {
					successCallback();
				}
			})
			.catch(() => {});

		if (action != null && !restrictions.includes(action)) {
			successCallback();
			return;
		}

		if (Platform.OS === 'android') this.androidModal.open();

		return LocalAuthentication.authenticateAsync({
			promptMessage: message,
		})
			.then(message => {
				this.androidModal.close();

				if (message.success && successCallback) successCallback();
				else if (message.error && errorCallback) errorCallback();
			})
			.catch(() => this.androidModal.close());
	}

	render() {
		return (
			<ModalBlockTemplate ref={ref => (this.androidModal = ref)}>
				<View
					style={{
						padding: 10,
						flexDirection: 'column',
						justifyContent: 'space-around',
					}}
				>
					<Text
						style={{
							fontSize: 18,
							fontWeight: 'bold',
							textAlign: 'center',
							color: colors.secondary,
							marginBottom: 5,
						}}
					>
						{t('title')}
					</Text>

					<Text style={{ fontSize: 16, textAlign: 'center', color: colors.secondary }}>
						{t('default_message')}
					</Text>

					<FontAwesomeIcon
						icon={['fa', 'fingerprint']}
						size={75}
						style={{ color: colors.secondary, marginTop: 15, alignSelf: 'center' }}
					/>
				</View>
			</ModalBlockTemplate>
		);
	}
}
