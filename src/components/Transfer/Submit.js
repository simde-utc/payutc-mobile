/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import LinkButton from '../LinkButton';
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
			<LinkButton
				text={t('transfer_button')}
				color={colors.backgroundLight}
				backgroundColor={colors.lightBlue}
				disabled={disabled}
				onPress={() => this.submit()}
			/>
		);
	}
}

export default connect()(Submit);
