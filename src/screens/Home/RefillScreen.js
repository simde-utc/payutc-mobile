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
import { Refill as t } from '../../utils/i18n';
import { isAmountValid } from '../../utils';

export default class RefillScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerTintColor: colors.more,
		headerForceInset: { top: 'never' },
	};

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
		const { amountError: prevError } = this.state;

		if (!isAmountValid(amount)) {
			if (prevError || amount === ',' || amount === '.') {
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
