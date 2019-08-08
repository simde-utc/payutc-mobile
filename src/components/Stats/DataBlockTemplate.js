/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import BlockTemplate from '../BlockTemplate';
import colors from '../../styles/colors';

export default class DataBlockTemplate extends React.PureComponent {
	renderDescription() {
		const { description } = this.props;

		return (
			<Text
				style={{
					fontSize: 14,
					fontWeight: 'bold',
					color: colors.secondary,
					textAlign: 'center',
					width: 125,
				}}
			>
				{description}
			</Text>
		);
	}

	render() {
		const { head, headTintColor, reversed, shadow } = this.props;

		return (
			<BlockTemplate
				shadow={shadow}
				style={{
					borderTopLeftRadius: '50%',
					borderTopRightRadius: '50%',
					borderBottomLeftRadius: '50%',
					borderBottomRightRadius: '50%',
				}}
			>
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
					{reversed ? this.renderDescription() : null}
					<Text
						style={{
							fontSize: 20,
							fontWeight: 'bold',
							color: headTintColor || colors.primary,
							textAlign: 'center',
						}}
					>
						{head}
					</Text>
					{!reversed ? this.renderDescription() : null}
				</View>
			</BlockTemplate>
		);
	}
}
