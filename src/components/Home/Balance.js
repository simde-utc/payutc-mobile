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
import { _, Home as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import { floatToEuro } from '../../utils';

export default class Balance extends React.PureComponent {
	render() {
		const { amount, name, loading } = this.props;

		return (
			<BlockTemplate roundedTop roundedBottom shadow>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
					{loading ? _('loading_text_replacement') : t('your_balance', { name })}
				</Text>
				{amount || loading ? (
					<Text style={{ fontSize: 70, fontWeight: 'bold', color: colors.primary, lineHeight: 75 }}>
						{loading ? _('loading_text_replacement') : floatToEuro(amount)}
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
