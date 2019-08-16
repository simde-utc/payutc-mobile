/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';
import { History as t } from '../../utils/i18n';
import { beautifyDateTime } from '../../utils';
import Transaction from './Transaction';

export default class Item extends React.Component {
	static renderTransaction(transaction) {
		switch (transaction.type) {
			case 'PURCHASE': {
				if (transaction.quantity > 0)
					return (
						<Transaction
							name={transaction.name}
							amount={transaction.amount}
							quantity={transaction.quantity}
							sign="-"
							signTintColor={colors.less}
						/>
					);
				if (transaction.quantity < 0)
					return (
						<Transaction
							name={`${t('refund')} ${transaction.name}`}
							amount={Math.abs(transaction.amount)}
							quantity={transaction.quantity}
							sign="+"
							signTintColor={colors.more}
						/>
					);
			}
			case 'VIROUT': {
				return (
					<Transaction
						name={`${t('virout')} ${transaction.firstname} ${transaction.lastname}`}
						amount={transaction.amount}
						message={transaction.name}
						sign="-"
						signTintColor={colors.less}
					/>
				);
			}
			case 'VIRIN': {
				return (
					<Transaction
						name={`${t('virin')} ${transaction.firstname} ${transaction.lastname}`}
						amount={transaction.amount}
						message={transaction.name}
						sign="+"
						signTintColor={colors.more}
					/>
				);
			}
			case 'RECHARGE': {
				return (
					<Transaction
						name={t('refill')}
						amount={transaction.amount}
						sign="+"
						signTintColor={colors.more}
					/>
				);
			}
			default:
				return <Text>{t('unsupported_transaction')}</Text>;
		}
	}

	render() {
		const { transaction, customBackground, roundedTop, roundedBottom, shadow } = this.props;

		return (
			<BlockTemplate
				customBackground={customBackground}
				roundedTop={roundedTop}
				roundedBottom={roundedBottom}
				shadow={shadow}
			>
				<Text style={{ fontSize: 10, color: colors.secondary, marginBottom: 3 }}>
					{beautifyDateTime(transaction.date)} {transaction.fun ? `• ${transaction.fun}` : null}
				</Text>
				{Item.renderTransaction(transaction)}
			</BlockTemplate>
		);
	}
}
