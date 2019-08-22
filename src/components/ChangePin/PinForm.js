/**
 * @author Aymeric Obled <aymeric.obled@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';
import { ChangePin as t } from '../../utils/i18n';
import PinInput from './PinInput';

export default class PinForm extends React.Component {
	constructor(props) {
		super(props);

		this.maxLength = 4;
	}

	onChange(amount) {
		const { onChange } = this.props;
		onChange(amount);
	}

	renderErrorMessage() {
		const { error } = this.props;

		return error ? (
			<Text style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold', color: colors.error }}>
				{error}
			</Text>
		) : null;
	}

	render() {
		const { pin, error } = this.props;

		return (
			<BlockTemplate roundedTop roundedBottom shadow>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
					{t('new_pin')}
				</Text>
				<PinInput
					value={pin}
					error={error}
					maxLength={this.maxLength}
					tintColor={colors.secondary}
					autofocus={false}
					onChange={this.onChange.bind(this)}
				/>
				{this.renderErrorMessage()}
			</BlockTemplate>
		);
	}
}
