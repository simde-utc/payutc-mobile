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

export const colors = {
	background: '#f1f1f1',
	white: '#fff',
	yellow: '#ffd515',
	lightBlue: '#007d94',
	gray: '#6d6f71',
	lightGray: '#8f9293',
	red: '#95193b',
	veryLightGray: '#f9f9f9',
	bdeBack: '#f6d31f',
	paeBack: '#ea762d',
	pteBack: '#239bd2',
	pvdcBack: '#fed41a',
	psecBack: '#95bd0c',
	poleFore: '#f6f8f4',
};

export const spaces = {
	none: 0,
	xs: 5,
	sm: 10,
	md: 15,
	lg: 25,
	xl: 50,
	xxl: 75,
};
