/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import * as Haptics from 'expo-haptics';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';
import { Transfer as t } from '../../utils/i18n';
import List from '../List';

export default class RecipientForm extends React.Component {
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

	handleRecipientSelected(recipient) {
		const { onSelect, onSubmitEditing } = this.props;

		if (onSubmitEditing) {
			onSubmitEditing();
		}

		onSelect(recipient);
	}

	renderErrorMessage() {
		const { error } = this.props;

		return error != null ? (
			<Text
				style={{
					fontSize: 14,
					fontWeight: 'bold',
					color: colors.error,
					backgroundColor: colors.backgroundBlock,
					marginTop: 5,
				}}
			>
				{error}
			</Text>
		) : null;
	}

	renderShortcuts() {
		const { history } = this.props;

		const people = history
			.filter(transaction => transaction.type === 'VIROUT')
			.map(transaction => {
				return {
					fullName: `${transaction.firstname} ${transaction.lastname}`,
					shortName: `${transaction.firstname} ${transaction.lastname[0]}.`,
				};
			})
			.filter((thing, index, self) => self.findIndex(t => t.fullName === thing.fullName) === index);

		const shortcutsBlocks = [...new Set(people)].slice(0, 3).map(recipient => (
			<BlockTemplate
				roundedTop
				roundedBottom
				shadow
				borderForAndroid
				key={recipient.fullName}
				onPress={() => {
					Haptics.selectionAsync().catch();
					this.onChange(recipient.fullName);
				}}
				style={{ marginRight: 10 }}
			>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
					{recipient.shortName}
				</Text>
			</BlockTemplate>
		));

		return (
			<View style={{ flexDirection: 'row', paddingTop: people.length > 0 ? 10 : 0 }}>
				{shortcutsBlocks}
			</View>
		);
	}

	renderCancelRecipient() {
		return (
			<TouchableOpacity
				onPress={() => {
					this.handleRecipientSelected(null);
					this.setState({ text: null });
				}}
			>
				<FontAwesomeIcon icon={['fas', 'times']} size={18} color={colors.error} />
			</TouchableOpacity>
		);
	}

	renderRecipientSuggestions() {
		const { suggestions, suggestionsFetching } = this.props;
		const { text } = this.state;

		if (!text) return null;

		return (
			<List
				items={suggestions}
				loading={suggestionsFetching}
				notRoundedTop
				renderItem={(item, index) => (
					<BlockTemplate
						onPress={() => this.handleRecipientSelected(item)}
						customBackground={index % 2 === 0 ? colors.backgroundBlockAlt : colors.backgroundBlock}
					>
						<Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.secondary }}>
							{item.name}
						</Text>
					</BlockTemplate>
				)}
				noEmptyComponent
				keyExtractor={item => item.id.toString()}
			/>
		);
	}

	render() {
		const {
			error,
			recipient,
			suggestionsFetching,
			blurOnSubmit,
			setRef,
			onSubmitEditing,
		} = this.props;
		const { text } = this.state;

		return (
			<View>
				<BlockTemplate
					roundedTop
					roundedBottom={(error && !suggestionsFetching) || !text || recipient}
					shadow
				>
					<Text
						style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary, marginBottom: 5 }}
					>
						{t('recipient')}
					</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<TextInput
							style={{
								flexGrow: 1,
								fontSize: 18,
								color: colors.transfer,
								padding: 0,
								margin: 0,
							}}
							keyboardType="default"
							keyboardAppearance={colors.generalAspect}
							placeholder={t('recipient_placeholder')}
							placeholderTextColor={colors.disabled}
							maxLength={this.maxLength}
							textContentType="none"
							autoCorrect={false}
							onChangeText={text => this.onChange(text)}
							value={recipient ? recipient.name : text}
							editable={!recipient}
							blurOnSubmit={blurOnSubmit}
							ref={setRef}
							onSubmitEditing={onSubmitEditing}
						/>
						{recipient ? this.renderCancelRecipient() : null}
					</View>
					{this.renderErrorMessage()}
					{text ? null : this.renderShortcuts()}
				</BlockTemplate>
				{recipient ? null : this.renderRecipientSuggestions()}
			</View>
		);
	}
}
