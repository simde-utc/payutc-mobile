/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

export const getCardType = code => {
	if (!code) return null;

	const codeStr = code.toString().replace(/\s+/g, '');

	if (codeStr.match(/^4\d*$/)) {
		return 'Visa';
	}

	if (codeStr.match(/^(5([12345])|22)\d*$/)) {
		return 'Mastercard';
	}

	return null;
};

export const cardColors = {
	visa: '#1a1f71',
	mastercard: '#ff5f01',
};

export default getCardType;
