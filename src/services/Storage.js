/**
 * Permet de gérer les données stockées localement.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license AGPL-3.0
 */

import { AsyncStorage } from 'react-native';

class Storage {
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
}

export default new Storage();
