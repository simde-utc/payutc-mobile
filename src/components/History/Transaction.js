/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import { History as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import { floatToEuro } from '../../utils/amount';
import { beautifyDate } from '../../utils/date';

export default function Transaction(props) {
	const {
		id,
		title,
		amount,
		quantity,
		date,
		location,
		message,
		positive,
		productId,
		expanded,
	} = props;
	const tintColor = positive ? colors.more : colors.secondary;

	return (
		<View>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
				}}
			>
				<View style={{ flex: 1, flexWrap: 'wrap', marginRight: 10 }}>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: tintColor }}>
						{title} {quantity && quantity > 1 ? `x${quantity}` : null}
					</Text>

					<Text style={{ fontSize: 10, color: tintColor, marginBottom: 3 }}>
						{beautifyDate(date)} {location ? `• ${location}` : null}
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

				<Text
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						color: tintColor,
						alignSelf: 'center',
					}}
				>
					{positive ? '+' : '-'} {floatToEuro(amount / 100)}
				</Text>
			</View>
		</View>
	);
}
