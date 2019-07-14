/**
 * Permet de gérer les données stockées localement
 * @author Alexandre Brasseur <alexandre.brasseur@etu.utc.fr>
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 * */

import { AsyncStorage } from 'react-native';
import CryptoJS from 'crypto-js';

class Storage {
	static encryptionKey;

	// ========== Normal Storage ==========

	getData = async key => {
		if (!key) throw 'Clé non définie !';

		try {
			const data = await AsyncStorage.getItem(key);
			return this.parseData(data);
		} catch (err) {
			throw 'Impossible de récupérer les données';
		}
	};

	setData = async (key, value) => {
		if (!key) throw 'Clé non définie !';
		if (!value) throw 'Valeur non définie !';

		const data = await this.stringifyData(value);
		return AsyncStorage.setItem(key, data);
	};

	removeData = async key => {
		if (!key) throw 'Clé non définie !';

		return AsyncStorage.removeItem(key);
	};

	// ========== Encrypted Storage ==========

	getSensitiveData = async key => {
		if (!key) throw 'Clé non définie !';

		try {
			const data = await AsyncStorage.getItem(key);
			const bytes = CryptoJS.AES.decrypt(data, await this.getEncryptionKey());

			return this.parseData(bytes.toString(CryptoJS.enc.Utf8), true);
		} catch (err) {
			throw 'Impossible de récupérer les données';
		}
	};

	setSensitiveData = async (key, value) => {
		if (!key) throw 'Clé non définie !';
		if (!value) throw 'Valeur non définie !';

		const data = await this.stringifyData(value, true);
		const bytes = CryptoJS.AES.encrypt(data, await this.getEncryptionKey());

		return AsyncStorage.setItem(key, bytes.toString());
	};

	removeSensitiveData = async key => {
		if (!key) throw 'Clé non définie !';

		return AsyncStorage.removeItem(key);
	};

	// ========== Helpers ==========

	stringifyData = async data => {
		try {
			return JSON.stringify(data);
		} catch (error) {
			console.log('error : ', error);
			throw 'Impossible de convertir les données en string.';
		}
	};

	parseData = async data => {
		try {
			return JSON.parse(data);
		} catch (error) {
			throw 'Impossible de parser les données récupérées.';
		}
	};

	setEncryptionKey = key => {
		Storage.encryptionKey = key;
	};

	getEncryptionKey = () => {
		return Storage.encryptionKey;
	};
}

export default new Storage();
