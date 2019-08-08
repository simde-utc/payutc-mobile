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
import Payed from './Payed';
import Received from './Received';

export default class Item extends React.PureComponent {
	static renderTransaction(transaction) {
		switch (transaction.type) {
			case 'PURCHASE': {
				if (transaction.quantity > 0)
					return (
						<Payed
							name={transaction.name}
							amount={transaction.amount}
							quantity={transaction.quantity}
						/>
					);
				if (transaction.quantity < 0)
					return (
						<Received
							name={`${t('refund')} ${transaction.name}`}
							amount={Math.abs(transaction.amount)}
							quantity={transaction.quantity}
						/>
					);
			}
			case 'VIROUT': {
				return (
					<Payed
						name={`${t('virout')} ${transaction.firstname} ${transaction.lastname}`}
						amount={transaction.amount}
						message={transaction.name}
					/>
				);
			}
			case 'VIRIN': {
				return (
					<Received
						name={`${t('virin')} ${transaction.firstname} ${transaction.lastname}`}
						amount={transaction.amount}
						message={transaction.name}
					/>
				);
			}
			case 'RECHARGE': {
				return <Received name={t('refill')} amount={transaction.amount} />;
			}
			default:
				return <Text>{t('unsupported_transaction')}</Text>;
		}
	}

	render() {
		const { transaction, customBackground } = this.props;

		return (
			<BlockTemplate customBackground={customBackground}>
				<Text style={{ fontSize: 10, color: colors.secondary, marginBottom: 3 }}>
					{beautifyDateTime(transaction.date)} {transaction.fun ? `• ${transaction.fun}` : null}
				</Text>
				{Item.renderTransaction(transaction)}
			</BlockTemplate>
		);
	}
}
