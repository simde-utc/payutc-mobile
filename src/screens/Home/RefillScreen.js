/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import colors from '../../styles/colors';
import AmountForm from '../../components/Refill/AmountForm';
import Submit from '../../components/Refill/Submit';
import { _, Refill as t } from '../../utils/i18n';
import { isAmountValid } from '../../utils';

export default class RefillScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerTintColor: colors.more,
		headerForceInset: { top: 'never' },
		headerBackTitle: t('back_button_title'),
		headerTruncatedBackTitle: _('back'),
	});

	constructor(props) {
		super(props);

		this.state = {
			amount: '',
			amountError: null,
		};

		this.handleAmountChange = this.handleAmountChange.bind(this);
		this.handleAmountErrorChange = this.handleAmountErrorChange.bind(this);
	}

	isButtonDisabled() {
		const { amount, amountError } = this.state;

		return amountError != null || !parseFloat(amount.replace(',', '.')) || !isAmountValid(amount);
	}

	handleAmountChange(amount) {
		const { amount: prevAmount } = this.state;

		if (!isAmountValid(amount)) {
			if (!isAmountValid(prevAmount) || amount === ',' || amount === '.') {
				this.setState({ amountError: t('amount_error') });
			} else {
				this.setState({ amount, amountError: t('amount_error') });
			}
		} else {
			this.setState({ amount, amountError: null });
		}
	}

	handleAmountErrorChange(error) {
		this.setState({ amountError: error });
	}

	render() {
		const { navigation } = this.props;
		const { amount, amountError } = this.state;

		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight, padding: 15 }}>
				<View style={{ paddingBottom: 15 }}>
					<AmountForm amount={amount} error={amountError} onChange={this.handleAmountChange} />
				</View>
				<View style={{ paddingBottom: 15 }}>
					<Submit
						amount={amount}
						disabled={this.isButtonDisabled()}
						navigation={navigation}
						onAmountErrorChange={this.handleAmountErrorChange}
					/>
				</View>
			</ScrollView>
		);
	}
}
