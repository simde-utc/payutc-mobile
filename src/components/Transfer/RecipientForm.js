/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, TextInput } from 'react-native';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';
import { Transfer as t } from '../../utils/i18n';

export default class RecipientForm extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { text: null };
		this.maxLength = 100;
	}

	onChange(text) {
		const { onChange } = this.props;

		onChange(text);
		this.setState({ text });
	}

	render() {
		const { text } = this.state;
		const { error } = this.props;

		return (
			<BlockTemplate roundedTop roundedBottom shadow>
				<Text
					style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary, marginBottom: 5 }}
				>
					{t('recipient')}
				</Text>
				<TextInput
					style={{
						fontSize: 18,
						color: colors.primary,
					}}
					keyboardType="default"
					placeholder={t('recipient_placeholder')}
					maxLength={this.maxLength}
					selectionColor={error == null ? colors.primary : colors.error}
					textContentType="none"
					autoCorrect={false}
					onChangeText={text => this.onChange(text)}
					value={text}
				/>
			</BlockTemplate>
		);
	}
}
