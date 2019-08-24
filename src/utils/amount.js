/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

export const AMOUNT_FORMAT = /^(?!0\d)\d{1,2}([.,]\d{1,2})?$/;

export const floatToEuro = float => {
	return `${float < 0 ? '- ' : ''}${Math.abs(float)
		.toFixed(2)
		.toString()
		.replace('.', ',')} €`;
};

export const isAmountValid = amount => !amount || amount.toString().match(AMOUNT_FORMAT);

export default {
	AMOUNT_FORMAT,
	floatToEuro,
	isAmountValid,
};
