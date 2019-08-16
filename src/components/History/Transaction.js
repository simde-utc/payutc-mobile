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
import { floatToEuro } from '../../utils';

export const SALE = 'sale';
export const TRANSFER = 'transfer_';
export const TRANSFER_OUT = 'transfer_out';
export const TRANSFER_IN = 'transfer_in';
export const REFILL = 'refill';

export default function Transaction({ name, amount, quantity, message, sign, signTintColor }) {
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
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
						{name} {quantity && quantity > 1 ? `x${quantity}` : null}
					</Text>
					{message ? (
						<Text style={{ fontSize: 12, color: colors.secondary }}>{message}</Text>
					) : null}
				</View>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: signTintColor }}>
					{sign} {floatToEuro(amount / 100)}
				</Text>
			</View>
		</View>
	);
}
