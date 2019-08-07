/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import BlockTemplate from '../BlockTemplate';
import colors from '../../styles/colors';

export default class DataBlockTemplate extends React.PureComponent {
	render() {
		const { head, description, headTintColor } = this.props;

		return (
			<BlockTemplate roundedTop roundedBottom>
				<Text style={{ fontSize: 30, fontWeight: 'bold', color: headTintColor, textAlign: 'center' }}>
					{head}
				</Text>
				<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.secondary, textAlign: 'center' }}>
					{description}
				</Text>
			</BlockTemplate>
		)
	}
}
