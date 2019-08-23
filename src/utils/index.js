/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

export const forceTextLength = (text, length = 2, remplacement = '0') => {
	text = `${text}`;

	while (text.length < length) {
		text = remplacement + text;
	}

	return text;
};

export default {
	forceTextLength,
};
