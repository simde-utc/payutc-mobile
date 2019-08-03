/**
 * @author Alexandre Brasseur <alexandre.brasseur@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { StyleSheet } from 'react-native';

/**
 * Helper to create a Style Sheet from a list of variables and a property
 *
 * @param      {Object}     list      Un objet plat (clé: variable) dont la clé sera la clé du StyleSheet
 *                                    et la variable la valeur de la propriété
 * @param      {string}     property  La propriété à régler pour chaque clé
 * @return     {StyleSheet}
 */
export const createStyleFromList = (list, property) =>
	StyleSheet.create(
		Object.keys(list).reduce((acc, key) => {
			acc[key] = { [property]: list[key] };
			return acc;
		}, {})
	);

export const spaces = {
	none: 0,
	xs: 5,
	sm: 10,
	md: 15,
	lg: 25,
	xl: 50,
	xxl: 75,
};
