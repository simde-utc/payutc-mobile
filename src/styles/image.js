/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { StyleSheet } from 'react-native';

export const thumbnail = {
	resizeMode: 'contain',
	width: 40,
	height: 40,
};

export const avatar = {
	...thumbnail,
	borderRadius: 20,
};

export const bigThumbnail = {
	resizeMode: 'contain',
	width: 100,
	height: 100,
};

export const bigAvatar = {
	...bigThumbnail,
	borderRadius: 50,
	resizeMode: 'cover',
};

export const logoStyle = {
	height: '15%',
	width: '82%',
	marginBottom: 35,
};

export default StyleSheet.create({
	thumbnail,
	avatar,
	bigThumbnail,
	bigAvatar,
	logoStyle,
});
