/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React, { Component } from 'react';
import { LayoutAnimation, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { History as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import { floatToEuro } from '../../utils/amount';
import { beautifyDate, beautifyDateTime } from '../../utils/date';

export default class Transaction extends Component {
	static getTransactionIcon = type => {
		switch (type.toUpperCase()) {
			case 'PURCHASE':
				return 'shopping-basket';
			case 'TRANSFER':
				return 'share';
			case 'REFILL':
				return 'plus-circle';
			default:
				return '';
		}
	};

	render() {
		const {
			id,
			type,
			title,
			amount,
			quantity,
			date,
			location,
			message,
			positive,
			productId,
			expanded,
		} = this.props;
		const tintColor = positive
			? colors.more
			: type.toUpperCase() === 'TRANSFER'
			? colors.transfer
			: colors.secondary;

		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
				}}
				onLayout={() => {
					LayoutAnimation.configureNext(LayoutAnimation.create(100, 'linear', 'opacity'));
				}}
			>
				<FontAwesomeIcon
					icon={['fas', Transaction.getTransactionIcon(type)]}
					size={20}
					color={`${tintColor}95`}
					style={{ alignSelf: 'center' }}
				/>

				<View
					style={{ borderLeftWidth: 1, borderLeftColor: `${tintColor}15`, marginHorizontal: 10 }}
				/>

				<View style={{ flex: 1, flexWrap: 'wrap', marginRight: 10 }}>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: tintColor }}>
						{title} {quantity && quantity > 1 ? `x${quantity}` : null}
					</Text>

					<Text style={{ fontSize: 10, color: tintColor, marginBottom: 3 }}>
						{expanded ? beautifyDateTime(date) : beautifyDate(date)}{' '}
						{location ? `• ${location}` : null}
					</Text>

					{message ? (
						<Text
							numberOfLines={expanded ? null : 2}
							style={{ fontSize: 12, color: `${tintColor}95`, marginTop: 3 }}
						>
							{message}
						</Text>
					) : null}

					{expanded ? (
						<>
							<Text
								numberOfLines={expanded ? null : 2}
								style={{ fontSize: 12, color: `${tintColor}95`, marginTop: 3 }}
							>
								{t('transaction_*', { number: id })}
							</Text>
							{productId ? (
								<Text
									numberOfLines={expanded ? null : 2}
									style={{ fontSize: 12, color: `${tintColor}95` }}
								>
									{t('product_*', { number: productId })}
								</Text>
							) : null}
						</>
					) : null}
				</View>

				<View style={{ alignSelf: 'center' }}>
					<Text
						style={{
							fontSize: 15,
							fontWeight: 'bold',
							color: tintColor,
						}}
					>
						{positive ? '+' : '-'} {floatToEuro(amount / 100)}
					</Text>
				</View>
			</View>
		);
	}
}
