/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import LinkButton from '../../components/LinkButton';
import AmountForm from '../../components/AmountForm';
import MessageForm from '../../components/Transfer/MessageForm';
import RecipientForm from '../../components/Transfer/RecipientForm';
import colors from '../../styles/colors';
import { Config, Ginger, PayUTC } from '../../redux/actions';
import { _, Transfer as t } from '../../utils/i18n';
import { floatToEuro, isAmountValid } from '../../utils/amount';
import BiometricAuth, { TRANSFER } from '../../services/BiometricAuth';

const MIN_AMOUNT = 0.01;

class TransferScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: t('title'),
			headerStyle: {
				borderBottomWidth: 0,
				backgroundColor: colors.backgroundBlock,
			},
			headerTintColor: colors.transfer,
			headerForceInset: { top: 'never', bottom: 'never' },
			headerBackTitle: t('back_button_title'),
			headerTruncatedBackTitle: _('back'),
			headerLeft: (
				<TouchableOpacity onPress={() => navigation.navigate('Home')}>
					<FontAwesomeIcon
						icon={['fas', 'times']}
						size={20}
						color={colors.transfer}
						style={{ marginHorizontal: 15, alignSelf: 'center' }}
					/>
				</TouchableOpacity>
			),
		};
	};

	submiting = false;

	constructor(props) {
		super(props);

		this.state = {
			message: '',
			amount: '',
			recipient: null,
			suggestions: [],
		};

		this.biometricAuth = React.createRef();

		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.handleAmountChange = this.handleAmountChange.bind(this);
		this.handleRecipientChange = this.handleRecipientChange.bind(this);
		this.handleRecipientSelected = this.handleRecipientSelected.bind(this);
	}

	componentDidMount() {
		const { isContributorFetching, dispatch } = this.props;

		if (!isContributorFetching) {
			dispatch(Ginger.getInformation());
		}
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
					this.amountInput.focus();

				default:
					this.setState({ recipientError: null, suggestions });
					break;
			}
		}
	}

	handleMessageChange(message) {
		this.setState({ message });
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

	isAmountValid(credit) {
		const { amount } = this.state;
		const amountAsFloat = parseFloat(amount.replace(',', '.'));

		return amountAsFloat >= MIN_AMOUNT && amountAsFloat <= credit;
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

	accept(amountAsFloat, recipient, message) {
		const { dispatch, navigation } = this.props;

		dispatch(
			Config.spinner({
				visible: false,
			})
		);

		const success = () => {
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
						message: {
							title: t('transfer_confirmed'),
							subtitle: recipient.name,
							amount: -amountAsFloat,
							tintColor: colors.transfer,
							message,
						},
					});
				})
				.catch(() => this.refuse());
		};

		this.biometricAuth.authenticate(success, () => this.refuse());
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
			const { isContributor } = this.props;
			const credit = data.credit / 100;

			if (!this.isAmountValid(credit)) {
				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				this.submiting = false;

				Haptics.notificationAsync('error').catch();

				return this.setState({
					amountError: t('bad_amount', { min: floatToEuro(MIN_AMOUNT), max: floatToEuro(credit) }),
				});
			}

			if (!isContributor) {
				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				this.submiting = false;

				Alert.alert(
					t('not_contributor'),
					t('not_contributor_desc'),
					[{ text: _('back'), style: 'cancel' }],
					{
						cancelable: true,
					}
				);

				return;
			}

			const { amount, recipient, message } = this.state;
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
		const { suggestionsFetching, history, restrictions, dispatch, navigation } = this.props;
		const { amount, recipientError, amountError, recipient, suggestions } = this.state;

		return (
			<View style={{ flex: 1 }}>
				<ScrollView style={{ backgroundColor: colors.background }}>
					<View style={{ padding: 15 }}>
						<RecipientForm
							error={recipientError}
							recipient={recipient}
							suggestions={suggestions}
							suggestionsFetching={suggestionsFetching}
							onChange={this.handleRecipientChange}
							onSelect={this.handleRecipientSelected}
							history={history}
							blurOnSubmit={false}
							onSubmitEditing={() => this.amountInput.focus()}
						/>
					</View>
					<View style={{ padding: 15, paddingTop: 0 }}>
						<AmountForm
							title={t('amount')}
							amount={amount}
							error={amountError}
							onChange={this.handleAmountChange}
							setRef={input => (this.amountInput = input)}
							blurOnSubmit={false}
							onSubmitEditing={() => this.messageInput.focus()}
							tintColor={colors.transfer}
						/>
					</View>
					<View style={{ padding: 15, paddingTop: 0 }}>
						<MessageForm
							onChange={this.handleMessageChange}
							setRef={input => (this.messageInput = input)}
						/>
					</View>
					<View style={{ padding: 15, paddingTop: 0 }}>
						<LinkButton
							text={t('transfer_button')}
							color={colors.backgroundBlock}
							backgroundColor={colors.transfer}
							disabled={this.isButtonDisabled()}
							onPress={() => this.submit()}
						/>
					</View>
				</ScrollView>

				<BiometricAuth
					ref={ref => (this.biometricAuth = ref)}
					action={TRANSFER}
					restrictions={restrictions}
					dispatch={dispatch}
					navigation={navigation}
				/>
			</View>
		);
	}
}

const mapStateToProps = ({ payutc, ginger, config: { restrictions } }) => {
	const information = ginger.getInformation();
	const suggestions = payutc.getUserAutoComplete();
	const history = payutc.getHistory();

	return {
		restrictions,
		isContributor: information.getData({ is_cotisant: false }).is_cotisant,
		isContributorFetching: information.isFetching(),
		suggestions: suggestions.getData([]),
		suggestionsFetching: suggestions.isFetching(),
		history: history.getData({ historique: [] }).historique,
		historyFetching: history.isFetching(),
	};
};

export default connect(mapStateToProps)(TransferScreen);
