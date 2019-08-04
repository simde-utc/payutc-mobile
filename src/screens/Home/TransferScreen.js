/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AmountForm from '../../components/Transfer/AmountForm';
import MessageForm from '../../components/Transfer/MessageForm';
import RecipientForm from '../../components/Transfer/RecipientForm';
import Submit from '../../components/Transfer/Submit';
import colors from '../../styles/colors';
import { Transfer as t } from '../../utils/i18n';
import PayUTC from '../../services/PayUTC';

const FORMAT = /^\d+(,\d{1,2})?$/;

export default class TransferScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerTintColor: colors.primary,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);

		this.state = {
			message: null,
			amount: null,
			recipient: null,
		};

		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.handleAmountChange = this.handleAmountChange.bind(this);
		this.handleAmountErrorChange = this.handleAmountErrorChange.bind(this);
		this.handleRecipientChange = this.handleRecipientChange.bind(this);
	}

	handleMessageChange(text) {
		this.setState({ message: text });
	}

	isStringValid() {
		const { amount } = this.state;

		if (amount == null) {
			return false;
		}

		return amount.match(FORMAT) != null;
	}

	handleAmountChange(value) {
		this.setState({ amount: value, amountError: null });
	}

	handleAmountErrorChange(error) {
		this.setState({ amountError: error });
	}

	isButtonDisabled() {
		const { recipient, amountError } = this.state;

		return recipient == null || !this.isStringValid() || amountError != null;
	}

	handleRecipientChange(recipient) {
		PayUTC.getUserAutoComplete(recipient).then(data => console.log(data));

		this.setState({ recipient });
	}

	render() {
		const minAmount = 0.01;
		const { message, amount, amountError, recipient } = this.state;
		const { navigation } = this.props;
		const credit = navigation.getParam('credit');

		return (
			<KeyboardAwareScrollView style={{ backgroundColor: colors.backgroundLight }}>
				<View style={{ padding: 15 }}>
					<RecipientForm onChange={this.handleRecipientChange} />
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<AmountForm error={amountError} onChange={this.handleAmountChange} />
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<MessageForm onChange={this.handleMessageChange} />
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<Submit
						recipient={recipient}
						message={message}
						amount={amount}
						minAmount={minAmount}
						onAmountErrorChange={this.handleAmountErrorChange}
						disabled={this.isButtonDisabled()}
						credit={credit}
					/>
				</View>
			</KeyboardAwareScrollView>
		);
	}
}
