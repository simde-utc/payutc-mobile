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
import { _ } from '../../utils/i18n';

export default class DataBlockTemplate extends React.PureComponent {
	render() {
		const { head, description, headTintColor, reversed } = this.props;

		return (
			<BlockTemplate
				roundedTop
				roundedBottoms
				style={{
					borderTopLeftRadius: '50%',
					borderTopRightRadius: '50%',
					borderBottomLeftRadius: '50%',
					borderBottomRightRadius: '50%',
				}}
			>
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
					{reversed ? (
						<Text
							style={{
								fontSize: 14,
								fontWeight: 'bold',
								color: colors.secondary,
								textAlign: 'center',
								width: 125,
							}}
						>
							{description}{' '}
						</Text>
					) : null}
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
					{!reversed ? (
						<Text
							style={{
								fontSize: 14,
								fontWeight: 'bold',
								color: colors.secondary,
								textAlign: 'center',
								width: 125,
							}}
						>
							{description}{' '}
						</Text>
					) : null}
				</View>
			</BlockTemplate>
		);
	}
}
