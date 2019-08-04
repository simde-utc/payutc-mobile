/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, TextInput, View } from 'react-native';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';
import { _, Transfer as t } from '../../utils/i18n';

export default class MessageForm extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = { text: null };
		this.maxLength = 255;

		this.shortcuts = [
			t('message_suggestions.thanks'),
			t('message_suggestions.happy'),
			t('message_suggestions.i_have_no_idea'),
		];
	}

	onChange(text) {
		const { onChange } = this.props;

		onChange(text);

		this.setState({ text });
	}

	renderShortcuts() {
		const shortcutsBlocks = this.shortcuts.map(shortcut => {
			return (
				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					key={shortcut}
					onPress={() => this.onChange(shortcut.toString())}
				>
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
						{shortcut}
					</Text>
				</BlockTemplate>
			);
		});

		return (
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15 }}>
				{shortcutsBlocks}
			</View>
		);
	}

	render() {
		const { text } = this.state;
		const { error } = this.props;

		return (
			<BlockTemplate roundedTop roundedBottom shadow>
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
						{t('message')}
						<Text style={{ fontSize: 12, fontWeight: 'normal', fontStyle: 'italic' }}>
							{_('optional')}
						</Text>
					</Text>
					<Text style={{ fontSize: 14, color: colors.secondary }}>
						{text != null ? text.length : 0}/{this.maxLength}
					</Text>
				</View>
				<TextInput
					style={{
						fontSize: 18,
						color: colors.primary,
					}}
					keyboardType="default"
					placeholder={t('message_placeholder')}
					maxLength={this.maxLength}
					multiline
					selectionColor={error == null ? colors.primary : colors.error}
					textContentType="none"
					autoCorrect={false}
					onChangeText={text => this.onChange(text)}
					value={text}
				/>
				{this.renderShortcuts()}
			</BlockTemplate>
		);
	}
}
