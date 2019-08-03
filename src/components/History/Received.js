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
import BlockTemplate from '../BlockTemplate';
import { History as t } from '../../utils/i18n';
import { floatToEuro } from '../../utils';

export default class Received extends React.PureComponent {
	render() {
		const { name, amount, quantity, message } = this.props;

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
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
						{name} {quantity && quantity > 1 ? `x${quantity}` : null}
					</Text>
					<View style={{ width: 10 }} />
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.more }}>
						+ {floatToEuro(amount / 100)}
					</Text>
				</View>
				{message ? <Text style={{ fontSize: 12, color: colors.secondary }}>{message}</Text> : null}
			</View>
		);
	}
}
