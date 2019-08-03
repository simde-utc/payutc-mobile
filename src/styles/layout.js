import { StyleSheet } from 'react-native';
import { createStyleFromList, colors, spaces } from './variables';

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

const blockSize = 47;

// Block
export const blocks = StyleSheet.create({
	grid: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignContent: 'space-between',
		paddingHorizontal: `${(2 * (100 - blockSize * 2)) / 3}%`,
	},
	folder: {
		justifyContent: 'space-between',
		alignContent: 'space-between',
		paddingHorizontal: 0,
		marginBottom: 10,
	},
	block: {
		width: '100%',
		height: '100%',
		marginBottom: 10,
	},
	'1-1': {
		width: '100%',
		aspectRatio: 1,
	},
	'1-2': {
		width: '100%',
		aspectRatio: 2 * (100 / (blockSize * 2)),
	},
	'2-2': {
		width: `${blockSize}%`,
		aspectRatio: 1,
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
	block: blocks,
	bg: bgColors,
	border: borderColors,
	...padding,
	...margin,
};
