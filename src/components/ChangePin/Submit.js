/**
 * @author Aymeric Obled <aymeric.obled@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import LinkButton from '../LinkButton';
import { Config, PayUTC } from '../../redux/actions';
import { _, ChangePin as t } from '../../utils/i18n';

class Submit extends React.Component {
	submiting = false;

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
		const { pin, dispatch } = this.props;
		// Avoid multiple sumbits on laggy phones...
		if (this.submiting) {
			return;
		}

		this.submiting = true;

		dispatch(
			Config.spinner({
				visible: true,
				textContent: t('modification_checks'),
			})
		);

		const action = PayUTC.setPin(pin);
		dispatch(action);

		action.payload
			.then(() => {
				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				this.submiting = false;
			})
			.catch(() => this.refuse());
	}

	render() {
		const { disabled } = this.props;

		return (
			<LinkButton
				text={t('modify')}
				color={colors.backgroundLight}
				backgroundColor={colors.transfer}
				disabled={disabled}
				onPress={() => this.submit()}
			/>
		);
	}
}

export default connect()(Submit);
