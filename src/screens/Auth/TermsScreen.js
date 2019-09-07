/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { connect } from 'react-redux';
import ValidationScreen from '../../components/ValidationScreen';
import Document from '../../components/Document';
import { _, Terms as t } from '../../utils/i18n';
import PayUTC from '../../services/PayUTC';
import { Config } from '../../redux/actions';
import colors from '../../styles/colors';
import fr from '../../../assets/terms/payutc/fr';

const TERMS = {
	fr,
};

class TermsScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 1, borderBottomColor: colors.backgroundLight },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
		headerTruncatedBackTitle: _('back'),
	});

	validate() {
		const { dispatch, navigation } = this.props;

		dispatch(
			Config.spinner({
				visible: true,
				textContent: t('payutc_registration'),
			})
		);

		const next = () => {
			dispatch(
				Config.spinner({
					visible: false,
				})
			);

			if (navigation.getParam('quick')) {
				navigation.goBack();
			}
		};

		PayUTC.register()
			.then(next)
			.catch(next);
	}

	render() {
		return (
			<ValidationScreen
				buttonColor={colors.primary}
				backgroundColor={colors.backgroundBlock}
				text={t('accept')}
				onPress={() => this.validate()}
			>
				<Document lang="fr" document={TERMS.fr} />
			</ValidationScreen>
		);
	}
}

export default connect()(TermsScreen);
