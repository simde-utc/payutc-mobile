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
import { _, Transfer as t } from '../../utils/i18n';
import { floatToEuro } from '../../utils';

export default class Submit extends React.PureComponent {
	isAmountValid() {
		const { minAmount, amount, credit } = this.props;
		const amountAsFloat = parseFloat(amount.replace(',', '.'));
		// TODO: We should check the actual balance instead of the props one
		return amountAsFloat >= minAmount && amountAsFloat <= credit;
	}

	submit() {
		if (!this.isAmountValid()) {
			const { minAmount, onAmountErrorChange, credit } = this.props;
			onAmountErrorChange(
				`${t('bad_amount')} ${floatToEuro(minAmount)} ${_('and').toLowerCase()} ${floatToEuro(
					credit
				)}.`
			);
			return;
		}

		const { amount, recipient } = this.props;
		const amountAsFloat = parseFloat(amount.replace(',', '.'));

		alert(`Transfert de ${amountAsFloat} à ${recipient}`);
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
				customBackground={disabled ? colors.disabled : colors.primary}
			>
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text
						style={{
							fontSize: 18,
							fontWeight: 'bold',
							color: colors.backgroundBlock,
						}}
					>
						{t('transfer_button')}
					</Text>
					<Ionicons name="md-arrow-forward" size={20} color={colors.backgroundBlock} />
				</View>
			</BlockTemplate>
		);
	}
}
