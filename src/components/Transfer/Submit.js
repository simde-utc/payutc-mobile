/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import LinkButton from '../LinkButton';
import { Config, PayUTC } from '../../redux/actions';
import { _, Transfer as t } from '../../utils/i18n';
import { floatToEuro } from '../../utils';

class Submit extends React.Component {
	submiting = false;

	isAmountValid(credit) {
		const { minAmount, amount } = this.props;
		const amountAsFloat = parseFloat(amount.replace(',', '.'));

		return amountAsFloat >= minAmount && amountAsFloat <= credit;
	}

	accept(amountAsFloat, recipient, message) {
		const { dispatch, navigation } = this.props;

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

				this.submiting = false;

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

				this.cancel(dispatch);

				this.submiting = false;
			});
	}

	refuse() {
		const { dispatch } = this.props;

		dispatch(
			Config.spinner({
				visible: false,
			})
		);

		this.submiting = false;
	}

	submit() {
		const { dispatch } = this.props;

		// Avoid multiple sumbits on laggy phones...
		if (this.submiting) {
			return;
		}

		this.submiting = true;

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

				this.submiting = false;

				return onAmountErrorChange(
					t('bad_amount', { min: floatToEuro(minAmount), max: floatToEuro(credit) })
				);
			}

			const { amount, recipient, message } = this.props;
			const amountAsFloat = parseFloat(amount.replace(',', '.'));

			Alert.alert(
				t('confirm_title'),
				t('confirm_message', { amount: floatToEuro(amountAsFloat), name: recipient.name }),
				[
					{ text: _('cancel'), onPress: () => this.refuse() },
					{
						text: t('confirm'),
						onPress: () => this.accept(amountAsFloat, recipient, message),
						style: 'destructive',
					},
				],
				{ cancelable: false }
			);
		});
	}

	render() {
		const { disabled } = this.props;

		return (
			<LinkButton
				text={t('transfer_button')}
				color={colors.backgroundLight}
				backgroundColor={colors.transfer}
				disabled={disabled}
				onPress={() => this.submit()}
			/>
		);
	}
}

export default connect()(Submit);
