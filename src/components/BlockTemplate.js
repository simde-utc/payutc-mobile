/**
 * Classe créée pour uniformiser styliquement les blocs, notamment sur la page d'accueil.
 * Le bloc peut devenir cliquable en précisant le propriété "onPress".
 *
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import colors from '../styles/colors';

export default class BlockTemplate extends React.Component {
	getShadowStyle() {
		const { shadow, borderForAndroid } = this.props;

		if (shadow && Platform.OS === 'ios') {
			return {
				shadowColor: colors.shadow,
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: shadow ? 0.1 : 0,
				shadowRadius: 10,
				elevation: 1,
			};
		}

		if (borderForAndroid && Platform.OS === 'android') {
			return {
				borderWidth: 1,
				borderColor: colors.border,
			};
		}

		return {};
	}

	render() {
		const {
			children,
			roundedTop,
			roundedBottom,
			onPress,
			onLongPress,
			disabled,
			customBackground,
			style,
		} = this.props;

		return (
			<TouchableOpacity
				onPress={onPress}
				onLongPress={onLongPress}
				disabled={disabled}
				activeOpacity={onPress ? 0.2 : 1}
				style={[
					{
						backgroundColor: customBackground || colors.backgroundBlock,
						padding: 10,
						borderTopLeftRadius: roundedTop ? 10 : 0,
						borderTopRightRadius: roundedTop ? 10 : 0,
						borderBottomLeftRadius: roundedBottom ? 10 : 0,
						borderBottomRightRadius: roundedBottom ? 10 : 0,
					},
					this.getShadowStyle(),
					style,
				]}
			>
				{children}
			</TouchableOpacity>
		);
	}
}
