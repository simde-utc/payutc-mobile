/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { FlatList, RefreshControl, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';
import { Transfer as t } from '../../utils/i18n';

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
		const { onSelect } = this.props;

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

	renderCancelRecipient() {
		return (
			<TouchableOpacity onPress={() => this.handleRecipientSelected(null)}>
				<View style={{ padding: 10 }}>
					<FontAwesomeIcon icon={['fas', 'times']} size={20} color={colors.error} />
				</View>
			</TouchableOpacity>
		);
	}

	renderRecipientSuggestions() {
		const { suggestions, suggestionsFetching } = this.props;

		return (
			<FlatList
				data={suggestions}
				keyExtractor={item => item.id.toString()}
				renderItem={({ item, index }) => (
					<BlockTemplate
						customBackground={index % 2 === 0 ? colors.backgroundBlockAlt : null}
						onPress={() => this.handleRecipientSelected(item)}
					>
						<Text style={{ fontSize: 13, color: colors.secondary, marginBottom: 3 }}>
							{item.name}
						</Text>
					</BlockTemplate>
				)}
				refreshControl={
					<RefreshControl
						refreshing={suggestionsFetching}
						onRefresh={() => {}}
						colors={[colors.secondary]}
						tintColor={colors.secondary}
					/>
				}
			/>
		);
	}

	render() {
		const { text } = this.state;
		const { error, recipient } = this.props;

		return (
			<View>
				<BlockTemplate style={{ paddingBottom: 5 }} roundedTop shadow>
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
							}}
							keyboardType="default"
							placeholder={t('recipient_placeholder')}
							maxLength={this.maxLength}
							selectionColor={error == null ? colors.transfer : colors.error}
							textContentType="none"
							autoCorrect={false}
							onChangeText={text => this.onChange(text)}
							value={recipient ? recipient.name : text}
							editable={!recipient}
						/>
						{recipient ? this.renderCancelRecipient() : null}
					</View>
					{error ? this.renderErrorMessage() : null}
				</BlockTemplate>
				{recipient ? null : this.renderRecipientSuggestions()}
				<BlockTemplate style={{ padding: 5 }} roundedBottom />
			</View>
		);
	}
}
