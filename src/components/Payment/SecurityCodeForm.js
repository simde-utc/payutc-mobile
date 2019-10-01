/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, TextInput } from 'react-native';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';

export default class SecurityCodeForm extends React.PureComponent {
	constructor(props) {
		super(props);
		this.maxLength = 3;
		this.state = { code: null };
	}

	onChange(code) {
		const { onChange } = this.props;

		onChange(code);
		this.setState({ code });
	}

	render() {
		const { error } = this.props;
		const { code } = this.state;

		return (
			<BlockTemplate roundedTop roundedBottom shadow style={{ flex: 3 }}>
				<Text
					style={{
						fontSize: 14,
						fontWeight: 'bold',
						color: error ? colors.error : colors.secondary,
						marginBottom: 5,
					}}
				>
					Code de sécurité
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
					placeholder="000"
					placeholderTextColor={colors.disabled}
					clearButtonMode="always"
					secureTextEntry
					maxLength={this.maxLength}
					onChangeText={code => this.onChange(code)}
					autoCorrect={false}
					value={code}
				/>
			</BlockTemplate>
		);
	}
}
