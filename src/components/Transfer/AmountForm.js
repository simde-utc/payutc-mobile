/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';
import { Transfer as t } from '../../utils/i18n';
import AmountInput from '../Home/AmountInput';

export default class AmountForm extends React.Component {
	constructor(props) {
		super(props);

		this.maxLength = 5;
	}

	onChange(amount) {
		const { onChange } = this.props;

		onChange(amount);
	}

	renderErrorMessage() {
		const { error } = this.props;

		return error ? (
			<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.error }}>{error}</Text>
		) : null;
	}

	render() {
		const { amount, error } = this.props;

		return (
			<BlockTemplate roundedTop roundedBottom shadow>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
					{t('amount')}
				</Text>
				<AmountInput
					value={amount}
					error={error}
					maxLength={this.maxLength}
					tintColor={colors.lightBlue}
					autofocus={false}
					onChange={this.onChange.bind(this)}
				/>
				{this.renderErrorMessage()}
			</BlockTemplate>
		);
	}
}
