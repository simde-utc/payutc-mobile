/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, TextInput } from 'react-native';
import { findNodeHandle } from 'react-native-web';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';

export default class ExpiryDateForm extends React.PureComponent {
	static formatDate(date) {
		if (!date) return null;

		const dateStr = date.toString();

		if (dateStr.length <= 2) return dateStr;

		return dateStr.replace(/\D*/g, '').replace(/(\d{2})\/?(\d{0,2})/, '$1/$2');
	}

	constructor(props) {
		super(props);
		this.maxLength = 5; // 4 digits and 1 slash
		this.state = {
			date: null,
		};
	}

	onChange(date) {
		const { onChange } = this.props;

		onChange(date);
		this.setState({ date });
	}

	render() {
		const { error, scrollViewRef } = this.props;
		const { date } = this.state;

		return (
			<BlockTemplate roundedTop roundedBottom shadow style={{ flex: 4 }}>
				<Text
					style={{
						fontSize: 14,
						fontWeight: 'bold',
						color: error ? colors.error : colors.secondary,
						marginBottom: 5,
					}}
				>
					Date d'expiration
				</Text>
				<TextInput
					style={{
						flexGrow: 1,
						fontSize: 18,
						color: error ? colors.error : colors.more,
						padding: 0,
						margin: 0,
					}}
					keyboardType="number-pad"
					keyboardAppearance={colors.generalAspect}
					placeholder="09/20"
					placeholderTextColor={colors.disabled}
					clearButtonMode="always"
					maxLength={this.maxLength}
					onChangeText={code => this.onChange(code)}
					autoCorrect={false}
					value={ExpiryDateForm.formatDate(date)}
					onFocus={event => scrollViewRef.props.scrollToFocusedInput(findNodeHandle(event.target))}
				/>
			</BlockTemplate>
		);
	}
}
