/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';
import { _, Refill as t } from '../../utils/i18n';
import { floatToEuro } from '../../utils';

export default class Submit extends React.PureComponent {
	isAmountValid() {
		// String must be valid in order to parse the amount
		if (!this.isStringValid()) {
			return false;
		}
		const { value } = this.state;
		const { minAmount, maxAmount } = this.props;
		const valueAsFloat = parseFloat(value.replace(',', '.'));
		return valueAsFloat >= minAmount && valueAsFloat <= maxAmount;
	}

	submit() {
		if (!this.isAmountValid()) {
			const { onAmountErrorChange } = this.props;

			return onAmountErrorChange(
				`${t('bad_amount')} ${floatToEuro(minAmount)} ${_('and').toLowerCase()} ${floatToEuro(
					maxAmount
				)}.`
			);
		}

		const { value } = this.state;
		const valueAsFloat = parseFloat(value.replace(',', '.'));

		alert(`Rechargement de ${valueAsFloat}`);
	}

	render() {
		const { disabled } = this.props;

		return (
			<BlockTemplate
				roundedTop
				roundedBottom
				shadow
				onPress={() => this.submit()}
				disabled={disabled}
				customBackground={disabled ? colors.disabled : colors.more}
			>
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text
						style={{
							fontSize: 16,
							fontWeight: 'bold',
							color: colors.backgroundLight,
						}}
					>
						{t('pay')}
					</Text>
					<Ionicons name="md-arrow-forward" size={20} color={colors.backgroundLight} />
				</View>
			</BlockTemplate>
		);
	}
}
