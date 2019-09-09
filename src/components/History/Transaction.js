/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import colors from '../../styles/colors';
import { floatToEuro } from '../../utils/amount';
import { beautifyDateTime } from '../../utils/date';

export default function Transaction({
	title,
	amount,
	quantity,
	date,
	location,
	message,
	positive,
}) {
	return (
		<View>
			<Text style={{ fontSize: 10, color: colors.secondary, marginBottom: 3 }}>
				{beautifyDateTime(date)} {location ? `• ${location}` : null}
			</Text>
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
						<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
							{title} {quantity && quantity > 1 ? `x${quantity}` : null}
						</Text>
						{message ? (
							<Text style={{ fontSize: 12, color: colors.secondary }}>{message}</Text>
						) : null}
					</View>
					<Text
						style={{
							fontSize: 14,
							fontWeight: 'bold',
							color: positive ? colors.more : colors.less,
						}}
					>
						{positive ? '+' : '-'} {floatToEuro(amount / 100)}
					</Text>
				</View>
			</View>
		</View>
	);
}
