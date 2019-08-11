/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import colors from '../styles/colors';
import i18n from '../utils/i18n';

export const CONFIG = 'CONFIG';

export const configState = {
	spinner: {
		visible: false,
		color: colors.backgroundBlock,
		textStyle: {
			color: colors.backgroundBlock,
			textAlign: 'center',
			paddingHorizontal: 15,
		},
	},
	lang: 'fr',
};

export const configReducer = (state = configState, action) => {
	if (action.type.endsWith(CONFIG)) {
		state = Object.assign({}, state);

		switch (action.config) {
			case 'setLang':
				i18n.locale = action.data;
				state.lang = action.data;

				break;

			default:
				state[action.config] = Object.assign(state[action.config], action.data);
		}
	}

	return state;
};
