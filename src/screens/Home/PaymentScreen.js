/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, WebView } from 'react-native';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import { Payment as t } from '../../utils/i18n';
import { Config, PayUTC } from '../../redux/actions';
import { floatToEuro } from '../../utils';
import { PAYUTC_CALLBACK_LINK } from '../../../config';

class PaymentScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerTintColor: colors.more,
		headerForceInset: { top: 'never' },
	});

	handleOnNavigationStateChange({ url }) {
		const { history, navigation, dispatch } = this.props;

		if (url.startsWith(PAYUTC_CALLBACK_LINK)) {
			navigation.goBack();

			dispatch(
				Config.spinner({
					visible: true,
					textContent: t('checking'),
				})
			);

			PayUTC.checkRefill(url.split('?')[1])
				.payload.then(() => {
					const action = PayUTC.getHistory();
					const lastLength = history.length;

					dispatch(PayUTC.getWalletDetails());
					dispatch(action);

					dispatch(
						Config.spinner({
							visible: true,
							textContent: t('getting_refill'),
						})
					);

					action.payload.then(([{ historique: history }]) => {
						const refillAmount = navigation.getParam('amount');

						for (let i = 0; i < history.length - lastLength; i++) {
							const { type, amount } = history[i];

							if (type === 'RECHARGE' && amount === refillAmount * 100) {
								dispatch(
									Config.spinner({
										visible: false,
									})
								);

								return navigation.navigate('Home', {
									message: t('paiement_confirmed', {
										amount: floatToEuro(refillAmount),
									}),
								});
							}
						}

						dispatch(
							Config.spinner({
								visible: false,
							})
						);

						Alert.alert(t('title'), t('paiement_canceled'));
					});
				})
				.catch(() => {
					dispatch(
						Config.spinner({
							visible: false,
						})
					);
				});
		}
	}

	render() {
		const { navigation } = this.props;
		const uri = navigation.getParam('url');

		return (
			<WebView
				source={{ uri }}
				onNavigationStateChange={this.handleOnNavigationStateChange.bind(this)}
			/>
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
