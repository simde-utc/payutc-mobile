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
import Transaction, { SALE, TRANSFER_OUT, TRANSFER_IN, REFILL } from './Transaction';

export default class Item extends React.Component {
	static renderTransaction({ type, variation, quantity, item, other_name }) {
		switch (type) {
			case SALE: {
				if (quantity > 0)
					return (
						<Transaction
							name={item}
							amount={variation}
							quantity={quantity}
							sign=""
							signTintColor={colors.less}
						/>
					);
				if (quantity < 0)
					return (
						<Transaction
							name={`${t('refund')} ${item}`}
							amount={Math.abs(variation)}
							quantity={quantity}
							sign="+"
							signTintColor={colors.more}
						/>
					);
			}
			case TRANSFER_OUT: {
				return (
					<Transaction
						name={`${t('virout')} ${other_name}`}
						amount={variation}
						message={item}
						sign=""
						signTintColor={colors.less}
					/>
				);
			}
			case TRANSFER_IN: {
				return (
					<Transaction
						name={`${t('virin')} ${other_name}`}
						amount={variation}
						message={item}
						sign="+"
						signTintColor={colors.more}
					/>
				);
			}
			case REFILL: {
				return (
					<Transaction name={t('refill')} amount={variation} sign="+" signTintColor={colors.more} />
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
					{beautifyDateTime(transaction.date)}{' '}
					{transaction.fundation ? `• ${transaction.fundation}` : null}
				</Text>
				{Item.renderTransaction(transaction)}
			</BlockTemplate>
		);
	}
}
