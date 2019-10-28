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
import { removeUselessEOL } from '../../utils';
import ModalContainerView from '../Modal/ModalContainerView';
import TransactionModalChildren from '../Modal/TransactionModalChildren';

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
					message: removeUselessEOL(transaction.name),
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
					message: removeUselessEOL(transaction.name),
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
		this.transactionModal = React.createRef();
	}

	render() {
		const { transaction, customBackground, roundedTop, roundedBottom, shadow } = this.props;

		const formattedTransaction = Item.getTransaction(transaction);

		return (
			<ModalContainerView
				ref={ref => (this.transactionModal = ref)}
				modalChildren={
					<TransactionModalChildren
						title={formattedTransaction.title}
						amount={formattedTransaction.amount}
						quantity={formattedTransaction.quantity}
						message={formattedTransaction.message}
						date={formattedTransaction.date}
						location={formattedTransaction.location}
						positive={formattedTransaction.positive}
					/>
				}
			>
				<BlockTemplate
					customBackground={customBackground}
					roundedTop={roundedTop}
					roundedBottom={roundedBottom}
					shadow={shadow}
					onPress={() => this.transactionModal.open()}
				>
					{Item.renderTransaction(formattedTransaction)}
				</BlockTemplate>
			</ModalContainerView>
		);
	}
}
