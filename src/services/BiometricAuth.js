/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { BiometricAuth as t } from '../utils/i18n';

export const defaultSecurity = ['transfer', 'refill', 'badge-locking'];
export const advancedSecurity = ['transfer', 'refill', 'badge-locking', 'app-opening'];

export default class BiometricAuth {
	static hasHardware() {
		return LocalAuthentication.hasHardwareAsync()
			.then(hasHardware => {
				return hasHardware;
			})
			.catch(() => {
				return false;
			});
	}

	static isActionRestricted(restrictions, action) {
		return restrictions.includes(action);
	}

	static authenticate(successCallback, errorCallback, message = t('default_message')) {
		if (!BiometricAuth.hasHardware()) {
			return;
		}

		return LocalAuthentication.authenticateAsync({
			promptMessage: message,
		})
			.then(message => {
				if (message.success) {
					successCallback();
				} else if (message.error) {
					errorCallback();
				}
			})
			.catch(() => errorCallback());
	}
}
