/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

export const floatToEuro = float => {
	return `${float < 0 ? '- ' : ''}${Math.abs(float)
		.toFixed(2)
		.toString()
		.replace('.', ',')} €`;
};
