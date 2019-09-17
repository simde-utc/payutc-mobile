/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import BlockTemplate from '../BlockTemplate';
import { History as t } from '../../utils/i18n';
import Transaction from './Transaction';
import TransactionModal from './TransactionModal';

export default class Item extends React.Component {
	static getTransaction(transaction) {
		switch (transaction.type) {
			case 'PURCHASE': {
				return {
					title: `${transaction.quantity < 0 ? `${t('refund')} ` : ''}${transaction.name}`,
					amount: Math.abs(transaction.amount),
					quantity: transaction.quantity,
					positive: transaction.quantity < 0,
					location: transaction.fun,
					date: transaction.date,
				};
			}
			case 'VIROUT': {
				return {
					title: `${t('virout')} ${transaction.firstname} ${transaction.lastname}`,
					amount: transaction.amount,
					quantity: transaction.quantity,
					message: transaction.name.trim('\n'),
					positive: false,
					location: transaction.fun,
					date: transaction.date,
				};
			}
			case 'VIRIN': {
				return {
					title: `${t('virin')} ${transaction.firstname} ${transaction.lastname}`,
					amount: transaction.amount,
					quantity: transaction.quantity,
					message: transaction.name.trim('\n'),
					positive: true,
					location: transaction.fun,
					date: transaction.date,
				};
			}
			case 'RECHARGE': {
				return {
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

	static renderTransaction(formattedTransaction) {
		return (
			<Transaction
				title={formattedTransaction.title}
				amount={formattedTransaction.amount}
				quantity={formattedTransaction.quantity}
				message={formattedTransaction.message}
				date={formattedTransaction.date}
				location={formattedTransaction.location}
				positive={formattedTransaction.positive}
			/>
		);
	}

	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
		};
	}

	renderModalTransaction(formattedTransaction) {
		return (
			<TransactionModal
				title={formattedTransaction.title}
				amount={formattedTransaction.amount}
				quantity={formattedTransaction.quantity}
				message={formattedTransaction.message}
				date={formattedTransaction.date}
				location={formattedTransaction.location}
				positive={formattedTransaction.positive}
				onClose={() => this.setState({ showModal: false })}
			/>
		);
	}

	render() {
		const { transaction, customBackground, roundedTop, roundedBottom, shadow } = this.props;
		const { showModal } = this.state;

		const formattedTransaction = Item.getTransaction(transaction);

		return (
			<BlockTemplate
				customBackground={customBackground}
				roundedTop={roundedTop}
				roundedBottom={roundedBottom}
				shadow={shadow}
				onPress={() => this.setState({ showModal: true })}
			>
				{showModal ? this.renderModalTransaction(formattedTransaction) : null}
				{Item.renderTransaction(formattedTransaction)}
			</BlockTemplate>
		);
	}
}
