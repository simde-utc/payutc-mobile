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
import { PayUTC } from '../../redux/actions';
import { PAYUTC_LINK, PAYUTC_ABORTED_LINK } from '../../../config';

class PaymentScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerTintColor: colors.more,
		headerForceInset: { top: 'never' },
	};

	handleOnNavigationStateChange({ url }) {
		const { navigation, dispatch } = this.props;

		if (url === PAYUTC_ABORTED_LINK) {
			Alert.alert(t('title'), t('paiement_canceled'));

			navigation.goBack();
		} else if (url === PAYUTC_LINK) {
			dispatch(PayUTC.getWalletDetails());
			dispatch(PayUTC.getHistory());

			navigation.navigate('Home');
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

export default connect()(PaymentScreen);
