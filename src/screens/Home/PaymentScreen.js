/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors from '../../styles/colors';
import { _, Payment as t } from '../../utils/i18n';
import BlockTemplate from '../../components/BlockTemplate';
import { floatToEuro } from '../../utils/amount';
import CardNumberForm from '../../components/Payment/CardNumberForm';
import ExpiryDateForm from '../../components/Payment/ExpiryDateForm';
import SecurityCodeForm from '../../components/Payment/SecurityCodeForm';
import LinkButton from '../../components/LinkButton';

class PaymentScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerTintColor: colors.more,
		headerForceInset: { top: 'never' },
		headerTruncatedBackTitle: _('back'),
	});

	constructor(props) {
		super(props);
		this.state = {
			cardNumber: null,
			expiryDate: null,
			securityCode: null,
		};
		this.handleCardNumberChange = this.handleCardNumberChange.bind(this);
		this.handleExpiryDateChange = this.handleExpiryDateChange.bind(this);
		this.handleSecurityCodeChange = this.handleSecurityCodeChange.bind(this);
	}

	isOnError() {
		const { cardNumberError, expiryDateError, securityCodeError } = this.state;

		return cardNumberError != null || expiryDateError != null || securityCodeError != null;
	}

	isSubmitDisabled() {
		const { cardNumber, expiryDate, securityCode } = this.state;

		return this.isOnError() || !cardNumber || !expiryDate || !securityCode;
	}

	handleCardNumberChange(cardNumber) {
		this.setState({ cardNumber, cardNumberError: null });
	}

	handleExpiryDateChange(expiryDate) {
		this.setState({ expiryDate, expiryDateError: null });
	}

	handleSecurityCodeChange(securityCode) {
		this.setState({ securityCode, securityCodeError: null });
	}

	submit() {
		const { cardNumber, expiryDate, securityCode } = this.state;

		if (!cardNumber || !cardNumber.match(/\d{16}/)) {
			this.setState({ cardNumberError: 'Numéro de carte invalide' });
		}

		if (!expiryDate || !expiryDate.match(/(0[1-9]|10|11|12)\/[0-9]{2}/)) {
			this.setState({ expiryDateError: "Date d'expiration invalide" });
		}

		if (!securityCode || !securityCode.match(/\d{3}/)) {
			this.setState({ expiryDateError: 'Code de sécurité invalide' });
		}

		console.warn(cardNumber);
		console.warn(expiryDate);
		console.warn(securityCode);
	}

	render() {
		const { navigation } = this.props;
		const { cardNumberError, expiryDateError, securityCodeError } = this.state;

		const amount = navigation.getParam('amount');

		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight }}>
				<View style={{ padding: 15 }}>
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<View style={{ flex: 1, flexDirection: 'column' }}>
							<BlockTemplate roundedTop roundedBottom shadow style={{ flex: 1 }}>
								<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
									Total à payer
								</Text>
								<Text style={{ fontSize: 26, fontWeight: 'bold', color: colors.more }}>
									{floatToEuro(amount)}
								</Text>
							</BlockTemplate>

							<View style={{ height: 10 }} />

							<BlockTemplate roundedTop roundedBottom shadow style={{ flex: 1 }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
									<FontAwesomeIcon
										icon={['fa', 'credit-card']}
										size={26}
										color={colors.secondary}
									/>
									<FontAwesomeIcon
										icon={['fab', 'cc-mastercard']}
										size={26}
										color={colors.secondary}
									/>
									<FontAwesomeIcon icon={['fab', 'cc-visa']} size={26} color={colors.secondary} />
								</View>
							</BlockTemplate>
						</View>

						<View style={{ width: 15 }} />

						<BlockTemplate roundedTop roundedBottom shadow style={{ flex: 1 }}>
							<Text
								style={{
									fontSize: 14,
									fontWeight: 'bold',
									color: colors.secondary,
									marginBottom: 3,
								}}
							>
								Bénéficiaire
							</Text>
							<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.more }}>
								BDE-UTC PayUTC
							</Text>
							<Text style={{ fontSize: 12, color: colors.secondary }}>
								{'Maison des Étudiants\nRue Roger Couttolenc\n60200 Compiègne'}
							</Text>
						</BlockTemplate>
					</View>

					<View
						style={{
							marginHorizontal: 50,
							marginVertical: 15,
							borderBottomWidth: 1,
							borderBottomColor: colors.backgroundBlock,
						}}
					/>

					<CardNumberForm onChange={this.handleCardNumberChange} error={cardNumberError} />

					<View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
						<ExpiryDateForm onChange={this.handleExpiryDateChange} error={expiryDateError} />
						<View style={{ width: 15 }} />
						<SecurityCodeForm onChange={this.handleSecurityCodeChange} error={securityCodeError} />
					</View>

					<LinkButton
						text="Payer"
						color={colors.backgroundLight}
						style={{ marginTop: 15 }}
						backgroundColor={colors.more}
						disabled={this.isSubmitDisabled()}
						onPress={() => this.submit()}
					/>
				</View>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ payutc }) => {
	const history = payutc.getHistory();

	return {
		history: history.getData({ historique: [] }).historique,
	};
};

export default connect(mapStateToProps)(PaymentScreen);
