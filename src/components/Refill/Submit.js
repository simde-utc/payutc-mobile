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
import { Refill as t } from '../../utils/i18n';
import { floatToEuro } from '../../utils';
import { PAYUTC_CALLBACK_LINK } from '../../../config';

class Submit extends React.Component {
	isAmountValid(minAmount, maxAmount) {
		const { amount } = this.props;
		const amountAsFloat = parseFloat(amount.replace(',', '.'));

		return amountAsFloat >= minAmount && amountAsFloat <= maxAmount;
	}

	submit() {
		const { dispatch, navigation } = this.props;

		dispatch(
			Config.spinner({
				visible: true,
				textContent: t('refill_checks'),
			})
		);

		const action = PayUTC.getRefillLimits();
		dispatch(action);

		action.payload.then(([{ min, max_reload }]) => {
			const minAmount = min / 100;
			const maxAmount = max_reload / 100;

			if (!this.isAmountValid(minAmount, maxAmount)) {
				const { onAmountErrorChange } = this.props;

				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				return onAmountErrorChange(
					t('bad_amount', { min: floatToEuro(minAmount), max: floatToEuro(maxAmount) })
				);
			}

			const { amount } = this.props;
			const amountAsFloat = parseFloat(amount.replace(',', '.'));

			dispatch(
				Config.spinner({
					visible: true,
					textContent: t('redirect_to_refill'),
				})
			);

			const action = PayUTC.getRefillUrl(amountAsFloat * 100, PAYUTC_CALLBACK_LINK);
			dispatch(action);

			action.payload
				.then(([url]) => {
					dispatch(
						Config.spinner({
							visible: false,
						})
					);

					navigation.navigate('Payment', { url, amount: amountAsFloat });
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
				text={t('pay')}
				color={colors.backgroundLight}
				backgroundColor={colors.more}
				disabled={disabled}
				onPress={() => this.submit()}
			/>
		);
	}
}

export default connect()(Submit);
