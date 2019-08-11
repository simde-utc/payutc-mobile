/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import colors from '../styles/colors';
import i18n from '../utils/i18n';
import Storage from '../services/Storage';

export const CONFIG = 'CONFIG';

export const configState = {
	spinner: {
		visible: false,
		color: colors.white,
		textStyle: {
			color: colors.white,
			textAlign: 'center',
			paddingHorizontal: 15,
		},
	},
	lang: 'fr',
};

export const configReducer = (state = configState, { type, config, data }) => {
	if (type.endsWith(CONFIG)) {
		state = Object.assign({}, state);

		switch (config) {
			case 'set':
				i18n.locale = data.lang;

				return data;

			case 'setLang':
				i18n.locale = data;
				state.lang = data;

				break;

			default:
				state[config] = Object.assign(state[config], data);
		}

		Storage.setData('config', state);
	}

	return state;
};
