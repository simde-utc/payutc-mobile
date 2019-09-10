/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import themes from '../../assets/themes.json';
import colors from '../styles/colors';
import i18n from '../utils/i18n';
import Storage from '../services/Storage';

export const CONFIG = 'CONFIG';

export const configState = {
	lang: 'en',
	spinner: {
		visible: false,
		color: colors.secondary,
		textStyle: {
			color: colors.secondary,
			textAlign: 'center',
			paddingHorizontal: 15,
		},
	},
	preferences: {
		selectedDate: '0',
		selectedHistoryCategory: '0',
		selectedStatCategory: '0',
	},
	theme: 'light',
	terms: {
		version: 0,
		date: '',
	},
};

export const configReducer = (state = configState, { type, config, data }) => {
	if (type.endsWith(CONFIG)) {
		state = Object.assign({}, state);

		switch (config) {
			case 'set':
				i18n.locale = data.lang;

				return Object.assign(state, data);

			case 'setLang':
				i18n.locale = data;
				state.lang = data;

				break;

			case 'setTheme':
				state.theme = data;
				const theme = themes[data];
				const keys = Object.keys(theme);

				for (const key in keys) {
					const name = keys[key];

					colors[name] = theme[name];
				}

				state.spinner.color = theme.secondary;
				state.spinner.textStyle.color = theme.secondary;

				break;

			case 'wipe':
				state = Object.assign({}, configState, { lang: state.lang });

				break;

			default:
				state[config] = Object.assign(state[config] || {}, data);
		}

		Storage.setData('config', state);
	}

	return state;
};
