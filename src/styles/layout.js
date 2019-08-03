/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { StyleSheet } from 'react-native';
import colors from './colors';
import { createStyleFromList, spaces } from './variables';

// Background colors
export const bgColors = createStyleFromList(colors, 'backgroundColor');
export const borderColors = createStyleFromList(colors, 'borderColor');

// Containers
export const containers = StyleSheet.create({
	default: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: colors.white,
		width: '100%',
	},
	center: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: colors.white,
		justifyContent: 'center',
		width: '100%',
		height: '100%',
	},
	padded: {
		paddingHorizontal: spaces.md,
		paddingVertical: spaces.sm,
	},
});

// Paddings
export const padding = {
	p: createStyleFromList(spaces, 'padding'),
	py: createStyleFromList(spaces, 'paddingHorizontal'),
	px: createStyleFromList(spaces, 'paddingVertical'),
	pt: createStyleFromList(spaces, 'paddingTop'),
	pb: createStyleFromList(spaces, 'paddingBottom'),
	pl: createStyleFromList(spaces, 'paddingLeft'),
	pr: createStyleFromList(spaces, 'paddingRight'),
};

// Margins
export const margin = {
	m: createStyleFromList(spaces, 'margin'),
	my: createStyleFromList(spaces, 'marginHorizontal'),
	mx: createStyleFromList(spaces, 'marginVertical'),
	mt: createStyleFromList(spaces, 'marginTop'),
	mb: createStyleFromList(spaces, 'marginBottom'),
	ml: createStyleFromList(spaces, 'marginLeft'),
	mr: createStyleFromList(spaces, 'marginRight'),
};

export default {
	container: containers,
	bg: bgColors,
	border: borderColors,
	...padding,
	...margin,
};
