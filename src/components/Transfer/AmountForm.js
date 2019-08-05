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

export default class AmountForm extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = { value: null };
		this.maxLength = 5;
	}

	onChange(value) {
		const { onChange } = this.props;

		onChange(value, null);

		this.setState({ value });
	}

	renderErrorMessage() {
		const { error } = this.props;

		return error != null ? (
			<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.error }}>{error}</Text>
		) : null;
	}

	render() {
		const { value } = this.state;
		const { error } = this.props;

		return (
			<BlockTemplate roundedTop roundedBottom shadow>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
					{t('amount')}
				</Text>
				<AmountInput
					value={value}
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
