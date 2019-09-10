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
import { beautifyDateTime } from '../../utils/date';
import { _, Terms as t } from '../../utils/i18n';
import { Config } from '../../redux/actions';
import colors from '../../styles/colors';
import fr from '../../../assets/terms/app/fr';

const TERMS = {
	fr,
};

export const TERMS_VERSION = 1;

class TermsScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: {
			borderBottomWidth: 0,
			backgroundColor: colors.backgroundBlock,
			borderBottomColor: colors.backgroundLight,
		},
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
		headerTruncatedBackTitle: _('back'),
	});

	validate() {
		const { navigation, dispatch } = this.props;

		dispatch(
			Config.terms({
				version: TERMS_VERSION,
				date: Date.now(),
			})
		);

		if (navigation.getParam('quick')) {
			navigation.goBack();
		}
	}

	render() {
		const {
			terms: { version, date },
		} = this.props;
		const validated = version === TERMS_VERSION;

		return (
			<ValidationScreen
				buttonColor={validated ? colors.more : colors.primary}
				backgroundColor={colors.backgroundBlock}
				text={validated ? t('validated', { date: beautifyDateTime(date) }) : t('accept')}
				disabled={validated}
				onPress={() => this.validate()}
			>
				<Document lang="fr" document={TERMS.fr} />
			</ValidationScreen>
		);
	}
}

const mapStateToProps = ({ config: { terms } }) => ({ terms });

export default connect(mapStateToProps)(TermsScreen);
