/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';
import { Config, PayUTC } from '../../redux/actions';
import { Transfer as t } from '../../utils/i18n';
import { floatToEuro } from '../../utils';

class Submit extends React.PureComponent {
	isAmountValid(credit) {
		const { minAmount, amount } = this.props;
		const amountAsFloat = parseFloat(amount.replace(',', '.'));

		return amountAsFloat >= minAmount && amountAsFloat <= credit;
	}

	submit() {
		const { dispatch, navigation } = this.props;

		dispatch(
			Config.spinner({
				visible: true,
				textContent: t('transfer_checks'),
			})
		);

		const action = PayUTC.getWalletDetails();
		dispatch(action);

		action.payload.then(([data]) => {
			const credit = data.credit / 100;

			if (!this.isAmountValid(credit)) {
				const { minAmount, onAmountErrorChange } = this.props;

				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				return onAmountErrorChange(
					t('bad_amount', { min: floatToEuro(minAmount), max: floatToEuro(credit) })
				);
			}

			const { amount, recipient, message } = this.props;
			const amountAsFloat = parseFloat(amount.replace(',', '.'));

			dispatch(
				Config.spinner({
					visible: true,
					textContent: t('transfering'),
				})
			);

			const action = PayUTC.transfer(amountAsFloat * 100, recipient.id, message);
			dispatch(action);

			action.payload
				.then(() => {
					dispatch(
						Config.spinner({
							visible: false,
						})
					);

					dispatch(PayUTC.getWalletDetails());
					dispatch(PayUTC.getHistory());

					navigation.navigate('Home', {
						message: t('transfer_confirmed', {
							amount: floatToEuro(amountAsFloat),
							name: recipient.name,
						}),
					});
				})
				.catch(() => {
					dispatch(
						Config.spinner({
							visible: false,
						})
					);
				});
		});
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
				customBackground={disabled ? colors.disabled : colors.lightBlue}
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

export default connect()(Submit);
