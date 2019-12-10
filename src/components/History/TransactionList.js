/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View } from 'react-native';
import * as Haptics from 'expo-haptics';
import BlockTemplate from '../BlockTemplate';
import { History as t } from '../../utils/i18n';
import Transaction from './Transaction';
import colors from '../../styles/colors';
import { removeUselessEOL } from '../../utils';

export default class TransactionList extends React.Component {
	static getTransaction(transaction) {
		switch (transaction.type) {
			case 'PURCHASE': {
				return {
					id: transaction.id,
					type: 'PURCHASE',
					title: `${transaction.quantity < 0 ? `${t('refund')} ` : ''}${transaction.name}`,
					amount: Math.abs(transaction.amount),
					quantity: transaction.quantity,
					positive: transaction.quantity < 0,
					location: transaction.fun,
					date: transaction.date,
					productId: transaction.product_id,
				};
			}
			case 'VIROUT': {
				return {
					id: transaction.id,
					type: 'TRANSFER',
					title: `${t('virout')} ${transaction.firstname} ${transaction.lastname}`,
					amount: transaction.amount,
					quantity: transaction.quantity,
					message: removeUselessEOL(transaction.name),
					positive: false,
					location: transaction.fun,
					date: transaction.date,
				};
			}
			case 'VIRIN': {
				return {
					id: transaction.id,
					type: 'TRANSFER',
					title: `${t('virin')} ${transaction.firstname} ${transaction.lastname}`,
					amount: transaction.amount,
					quantity: transaction.quantity,
					message: removeUselessEOL(transaction.name),
					positive: true,
					location: transaction.fun,
					date: transaction.date,
				};
			}
			case 'RECHARGE': {
				return {
					id: transaction.id,
					type: 'REFILL',
					title: t('refill'),
					amount: transaction.amount,
					positive: true,
					location: transaction.fun,
					date: transaction.date,
				};
			}
			default:
				return null;
		}
	}

	renderTransaction(formattedTransaction) {
		const { expand } = this.props;

		return (
			<Transaction
				expanded={expand}
				id={formattedTransaction.id}
				type={formattedTransaction.type}
				title={formattedTransaction.title}
				amount={formattedTransaction.amount}
				quantity={formattedTransaction.quantity}
				message={formattedTransaction.message}
				date={formattedTransaction.date}
				location={formattedTransaction.location}
				positive={formattedTransaction.positive}
				productId={formattedTransaction.productId}
			/>
		);
	}

	render() {
		const { transactions, expand, select, unselect } = this.props;

		return (
			<BlockTemplate
				customBackground={expand ? colors.backgroundBlock : colors.backgroundBlockAlt}
				roundedTop
				roundedBottom
				onPress={() => {
					Haptics.selectionAsync().catch();
					if (expand) {
						unselect();
					} else {
						select();
					}
				}}
			>
				{transactions.map((transaction, index) => (
					<View
						key={transaction.id.toString()}
						style={{ marginBottom: index === transactions.length - 1 ? 0 : 15 }}
					>
						{this.renderTransaction(TransactionList.getTransaction(transaction))}
					</View>
				))}
			</BlockTemplate>
		);
	}
}
