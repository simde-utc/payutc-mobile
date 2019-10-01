/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';
import { cardColors, getCardType } from '../../utils/payment';

export default class CardNumberForm extends React.PureComponent {
	static formatCode(code) {
		if (!code) return null;

		const codeStr = code.toString();

		return codeStr
			.replace(/\D*/g, '')
			.replace(/^(\d{4})(\d{0,4})?(\d{0,4})?(\d{0,4})?$/, '$1 $2 $3 $4')
			.trim();
	}

	constructor(props) {
		super(props);
		this.maxLength = 19;
		this.state = { code: null };
	}

	onChange(code) {
		const { onChange } = this.props;

		onChange(code);
		this.setState({ code });
	}

	renderCardIcon() {
		const { code } = this.state;

		const type = getCardType(code);

		switch (type) {
			case 'Visa':
				return <FontAwesomeIcon icon={['fab', 'cc-visa']} size={22} color={cardColors.visa} />;
			case 'Mastercard':
				return (
					<FontAwesomeIcon
						icon={['fab', 'cc-mastercard']}
						size={22}
						color={cardColors.mastercard}
					/>
				);
			default:
				return (
					<FontAwesomeIcon
						icon={['fa', 'credit-card']}
						size={22}
						color={code != null && code.toString().length > 0 ? colors.secondary : colors.disabled}
					/>
				);
		}
	}

	render() {
		const { error } = this.props;
		const { code } = this.state;

		return (
			<BlockTemplate roundedTop roundedBottom shadow>
				<Text
					style={{
						fontSize: 14,
						fontWeight: 'bold',
						color: error ? colors.error : colors.secondary,
						marginBottom: 5,
					}}
				>
					Numéro de carte
				</Text>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<TextInput
						style={{
							flexGrow: 1,
							fontSize: 18,
							color: error ? colors.error : colors.more,
							padding: 0,
							marginVertical: 0,
							marginRight: 5,
						}}
						keyboardType="number-pad"
						keyboardAppearance={colors.generalAspect}
						placeholder="0000 0000 0000 0000"
						placeholderTextColor={colors.disabled}
						clearButtonMode="always"
						maxLength={this.maxLength}
						onChangeText={code => this.onChange(code)}
						textContentType="creditCardNumber"
						autoCorrect={false}
						value={CardNumberForm.formatCode(code)}
					/>
					{this.renderCardIcon()}
				</View>
			</BlockTemplate>
		);
	}
}
