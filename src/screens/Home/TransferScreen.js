/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import AmountForm from '../../components/Transfer/AmountForm';
import MessageForm from '../../components/Transfer/MessageForm';
import RecipientForm from '../../components/Transfer/RecipientForm';
import Submit from '../../components/Transfer/Submit';
import colors from '../../styles/colors';
import { PayUTC } from '../../redux/actions';
import { _, Transfer as t } from '../../utils/i18n';
import { isAmountValid } from '../../utils';

class TransferScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerTintColor: colors.transfer,
		headerForceInset: { top: 'never' },
		headerTruncatedBackTitle: _('back'),
	});

	constructor(props) {
		super(props);

		this.state = {
			message: null,
			amount: '',
			recipient: null,
			suggestions: [],
		};

		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.handleAmountChange = this.handleAmountChange.bind(this);
		this.handleAmountErrorChange = this.handleAmountErrorChange.bind(this);
		this.handleRecipientChange = this.handleRecipientChange.bind(this);
		this.handleRecipientSelected = this.handleRecipientSelected.bind(this);
	}

	componentDidUpdate(prevProps) {
		const { suggestions, suggestionsFetching } = this.props;

		if (prevProps.suggestionsFetching && !suggestionsFetching) {
			switch (suggestions.length) {
				case 0:
					this.setState({ recipientError: t('recipient_not_found'), suggestions: [] });
					break;

				case 1:
					this.handleRecipientSelected(suggestions[0]);

				default:
					this.setState({ recipientError: null, suggestions });
					break;
			}
		}
	}

	handleMessageChange(text) {
		this.setState({ message: text });
	}

	isButtonDisabled() {
		const { recipient, amount, amountError } = this.state;

		return (
			!recipient ||
			amountError != null ||
			!parseFloat(amount.replace(',', '.')) ||
			!isAmountValid(amount)
		);
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

	handleRecipientChange(recipient) {
		const { dispatch } = this.props;

		if (recipient) {
			dispatch(PayUTC.getUserAutoComplete(recipient));
		} else {
			this.setState({ recipientError: null, suggestions: [] });
		}
	}

	handleRecipientSelected(recipient) {
		this.setState({ recipientError: null, recipient });
	}

	render() {
		const minAmount = 0.01;
		const { navigation, suggestionsFetching, history, historyFetching } = this.props;
		const { message, amount, recipientError, amountError, recipient, suggestions } = this.state;

		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight }}>
				<View style={{ padding: 15 }}>
					<RecipientForm
						error={recipientError}
						recipient={recipient}
						suggestions={suggestions}
						suggestionsFetching={suggestionsFetching}
						onChange={this.handleRecipientChange}
						onSelect={this.handleRecipientSelected}
						history={history}
					/>
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<AmountForm amount={amount} error={amountError} onChange={this.handleAmountChange} />
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
						navigation={navigation}
					/>
				</View>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ payutc }) => {
	const suggestions = payutc.getUserAutoComplete();
	const history = payutc.getHistory();

	return {
		suggestions: suggestions.getData([]),
		suggestionsFetching: suggestions.isFetching(),
		history: history.getData({ historique: [] }).historique,
		historyFetching: history.isFetching(),
	};
};

export default connect(mapStateToProps)(TransferScreen);
