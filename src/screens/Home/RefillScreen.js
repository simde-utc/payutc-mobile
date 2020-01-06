/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, TouchableOpacity, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors from '../../styles/colors';
import AmountForm from '../../components/AmountForm';
import LinkButton from '../../components/LinkButton';
import { Config, Ginger, PayUTC } from '../../redux/actions';
import { _, Refill as t } from '../../utils/i18n';
import { floatToEuro, isAmountValid } from '../../utils/amount';
import { PAYUTC_CALLBACK_URL } from '../../../config';
import BiometricAuth, { REFILL } from '../../services/BiometricAuth';

const AMOUNT_SHORTCUTS = [10, 15, 20, 50];

class RefillScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: t('title'),
			headerStyle: {
				borderBottomWidth: 0,
				backgroundColor: colors.backgroundBlock,
			},
			headerTintColor: colors.more,
			headerForceInset: { top: 'never', bottom: 'never' },
			headerBackTitle: t('back_button_title'),
			headerTruncatedBackTitle: _('back'),
			headerLeft: (
				<TouchableOpacity onPress={() => navigation.navigate('Home')}>
					<FontAwesomeIcon
						icon={['fas', 'times']}
						size={20}
						color={colors.more}
						style={{ marginHorizontal: 15, alignSelf: 'center' }}
					/>
				</TouchableOpacity>
			),
		};
	};

	submitting = false;

	constructor(props) {
		super(props);

		this.state = {
			amount: '',
			amountError: null,
		};

		this.biometricAuth = React.createRef();

		this.handleAmountChange = this.handleAmountChange.bind(this);
	}

	componentDidMount() {
		const { isContributorFetching, dispatch } = this.props;

		if (!isContributorFetching) {
			dispatch(Ginger.getInformation());
		}
	}

	isButtonDisabled() {
		const { amount, amountError } = this.state;

		return amountError != null || !parseFloat(amount.replace(',', '.')) || !isAmountValid(amount);
	}

	isAmountValid(minAmount, maxAmount) {
		const { amount } = this.state;
		const amountAsFloat = parseFloat(amount.replace(',', '.'));

		return amountAsFloat >= minAmount && amountAsFloat <= maxAmount;
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
				textContent: t('refill_checks'),
			})
		);

		const action = PayUTC.getRefillLimits();
		dispatch(action);

		action.payload
			.then(([{ min, max_reload }]) => {
				const minAmount = min / 100;
				const maxAmount = max_reload / 100;

				if (!this.isAmountValid(minAmount, maxAmount)) {
					dispatch(
						Config.spinner({
							visible: false,
						})
					);

					this.submiting = false;

					Haptics.notificationAsync('error').catch();

					if (Number.isNaN(minAmount) || Number.isNaN(maxAmount)) {
						Alert.alert(_('error'), _('retry_with_connection'));

						return;
					}

					return this.setState({
						amountError: t('bad_amount', {
							min: floatToEuro(minAmount),
							max: floatToEuro(maxAmount),
						}),
					});
				}

				const { isContributor } = this.props;
				const { amount } = this.state;
				const amountAsFloat = parseFloat(amount.replace(',', '.'));

				dispatch(
					Config.spinner({
						visible: true,
						textContent: t('redirect_to_refill'),
					})
				);

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
						[
							{ text: _('back'), style: 'cancel' },
							{
								text: _('continue'),
								onPress: () => {
									this.submiting = true;

									dispatch(
										Config.spinner({
											visible: true,
											textContent: t('redirect_to_refill'),
										})
									);

									this.pay(amountAsFloat);
								},
							},
						],
						{
							cancelable: true,
						}
					);

					return;
				}

				this.pay(amountAsFloat);
			})
			.catch(() => {
				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				this.submiting = false;
			});
	}

	pay(amountAsFloat) {
		const { dispatch, navigation } = this.props;
		const action = PayUTC.getRefillUrl(amountAsFloat * 100, PAYUTC_CALLBACK_URL);
		dispatch(action);

		action.payload
			.then(([url]) => {
				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				this.submiting = false;

				const success = () => navigation.navigate('Payment', { url, amount: amountAsFloat });

				this.biometricAuth.authenticate(success);
			})
			.catch(() => {
				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				this.submiting = false;
			});
	}

	render() {
		const { restrictions, dispatch, navigation } = this.props;
		const { amount, amountError } = this.state;

		return (
			<View style={{ flex: 1 }}>
				<ScrollView style={{ backgroundColor: colors.background, padding: 15 }}>
					<View style={{ paddingBottom: 15 }}>
						<AmountForm
							title={t('amount')}
							amount={amount}
							error={amountError}
							onChange={this.handleAmountChange}
							shortcuts={AMOUNT_SHORTCUTS}
							autoFocus
							onSubmitEditing={() => !this.isButtonDisabled() && this.submit()}
						/>
					</View>
					<View style={{ paddingBottom: 15 }}>
						<LinkButton
							text={t('pay')}
							color={colors.backgroundBlock}
							backgroundColor={colors.more}
							disabled={this.isButtonDisabled()}
							onPress={() => this.submit()}
						/>
					</View>
				</ScrollView>

				<BiometricAuth
					ref={ref => (this.biometricAuth = ref)}
					action={REFILL}
					restrictions={restrictions}
					dispatch={dispatch}
					navigation={navigation}
				/>
			</View>
		);
	}
}

const mapStateToProps = ({ ginger, config: { restrictions } }) => {
	const information = ginger.getInformation();

	return {
		restrictions,
		isContributor: information.getData({ is_cotisant: false }).is_cotisant,
		isContributorFetching: information.isFetching(),
	};
};

export default connect(mapStateToProps)(RefillScreen);
