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

export default class MessageForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = { text: null };
		this.maxLength = 255;
		this.messages = t('message_suggestions');

		this.shortcuts = [
			{
				text: t('thanks'),
			},
			{
				text: t('happy'),
			},
			{
				text: t('kiss'),
			},
			{
				text: t('bg'),
			},
			{
				text: t('random'),
				getValue: () => this.getRandomMessage(),
			},
		];
	}

	onChange(text) {
		const { onChange } = this.props;

		onChange(text);

		this.setState({ text });
	}

	getRandomMessage() {
		const index = Math.floor(Math.random() * this.messages.length);

		return this.messages[index];
	}

	renderShortcuts() {
		const shortcutsBlocks = this.shortcuts.map(({ text, getValue }) => {
			return (
				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					borderForAndroid
					key={text}
					onPress={() => this.onChange(getValue ? getValue() : text)}
				>
					<Text
						style={{
							fontSize: 14,
							fontWeight: 'bold',
							color: getValue ? colors.transfer : colors.secondary,
							fontStyle: getValue ? 'italic' : null,
						}}
					>
						{text}
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
						color: colors.transfer,
					}}
					keyboardType="default"
					placeholder={t('message_placeholder')}
					maxLength={this.maxLength}
					multiline
					textContentType="none"
					onChangeText={text => this.onChange(text)}
					value={text}
				/>
				{this.renderShortcuts()}
			</BlockTemplate>
		);
	}
}
