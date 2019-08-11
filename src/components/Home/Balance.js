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

export default class Balance extends React.Component {
	getWeekAmount() {
		const { weekAmount } = this.props;

		return floatToEuro(Math.abs(weekAmount));
	}

	getWeekAmountColor() {
		const { weekAmount } = this.props;

		if (weekAmount < 0) {
			return colors.more;
		}

		if (weekAmount === 0) {
			return colors.yellow;
		}

		return colors.less;
	}

	getWeekAmountText() {
		const { weekAmount } = this.props;
		const amount = Math.abs(weekAmount);

		if (amount !== weekAmount) {
			return t('week_positive', { count: Math.floor(amount) });
		}

		return t('week_negative', { count: Math.floor(amount) });
	}

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
				<Text style={{ fontSize: 13, color: colors.secondary }}>
					{loading ? (
						_('loading_text_replacement')
					) : (
						<Text style={{ fontWeight: 'bold', color: this.getWeekAmountColor() }}>
							{this.getWeekAmount()}
						</Text>
					)}{' '}
					{this.getWeekAmountText()}
				</Text>
			</BlockTemplate>
		);
	}
}
