/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import BlockTemplate from '../BlockTemplate';
import { Home as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import { floatToEuro } from '../../utils';

export default class Balance extends React.PureComponent {
	render() {
		const { amount } = this.props;

		return (
			<BlockTemplate roundedTop roundedBottom shadow>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
					{t('your_balance')}
				</Text>
				{amount ? (
					<Text style={{ fontSize: 70, fontWeight: 'bold', color: colors.primary, lineHeight: 75 }}>
						{floatToEuro(amount)}
					</Text>
				) : (
					<Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary }}>
						{t('no_balance')}
					</Text>
				)}
			</BlockTemplate>
		);
	}
}
