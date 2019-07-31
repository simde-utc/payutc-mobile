/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import { _, Transfer as t } from '../../utils/i18n';
import AmountInput from '../../components/Home/AmountInput';
import { floatToEuro } from '../../utils/currencyFormatter';

class RecipientForm extends React.PureComponent {
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

class AmountForm extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { value: null };
		this.maxLength = 5;
		this.onChange = this.onChange.bind(this);
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
					tintColor={colors.primary}
					autofocus={false}
					onChange={this.onChange}
				/>
				{this.renderErrorMessage()}
			</BlockTemplate>
		);
	}
}

class MessageForm extends React.PureComponent {
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

class Submit extends React.PureComponent {
	isAmountValid() {
		const { minAmount, amount, credit } = this.props;
		const amountAsFloat = parseFloat(amount.replace(',', '.'));
		// TODO: We should check the actual balance instead of the props one
		return amountAsFloat >= minAmount && amountAsFloat <= credit;
	}

	submit() {
		if (!this.isAmountValid()) {
			const { minAmount, onAmountErrorChange, credit } = this.props;
			onAmountErrorChange(
				`${t('bad_amount')} ${floatToEuro(minAmount)} ${_('and').toLowerCase()} ${floatToEuro(
					credit
				)}.`
			);
			return;
		}

		const { amount, recipient } = this.props;
		const amountAsFloat = parseFloat(amount.replace(',', '.'));

		alert(`Transfert de ${amountAsFloat} à ${recipient}`);
	}

	render() {
		const { disabled } = this.props;

		return (
			<BlockTemplate
				roundedTop
				roundedBottom
				shadow
				onPress={() => this.submit()}
				disabled={disabled}
				customBackground={disabled ? colors.disabled : colors.primary}
			>
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text
						style={{
							fontSize: 18,
							fontWeight: 'bold',
							color: colors.backgroundBlock,
						}}
					>
						{t('transfer_button')}
					</Text>
					<Ionicons name="md-arrow-forward" size={20} color={colors.backgroundBlock} />
				</View>
			</BlockTemplate>
		);
	}
}

export default class TransferScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerTintColor: colors.primary,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);

		this.state = {
			message: null,
			amount: null,
			recipient: null,
		};

		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.handleAmountChange = this.handleAmountChange.bind(this);
		this.handleAmountErrorChange = this.handleAmountErrorChange.bind(this);
		this.handleRecipientChange = this.handleRecipientChange.bind(this);
	}

	handleMessageChange(text) {
		this.setState({ message: text });
	}

	isStringValid() {
		const format = /^\d+(,\d{1,2})?$/;
		const { amount } = this.state;
		if (amount == null) {
			return false;
		}
		return amount.match(format) != null;
	}

	handleAmountChange(value) {
		this.setState({ amount: value, amountError: null });
	}

	handleAmountErrorChange(error) {
		this.setState({ amountError: error });
	}

	isButtonDisabled() {
		const { recipient, amountError } = this.state;
		return recipient == null || !this.isStringValid() || amountError != null;
	}

	handleRecipientChange(login) {
		this.setState({ recipient: login });
	}

	render() {
		const minAmount = 0.01;
		const { message, amount, amountError, recipient } = this.state;
		const { navigation } = this.props;
		const credit = navigation.getParam('credit');

		return (
			<KeyboardAwareScrollView style={{ backgroundColor: colors.backgroundLight }}>
				<View style={{ padding: 15 }}>
					<RecipientForm onChange={this.handleRecipientChange} />
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<AmountForm error={amountError} onChange={this.handleAmountChange} />
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<MessageForm onChange={this.handleMessageChange} />
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<Submit
						recipient={recipient}
						message={message}
						amount={amount}
						minAmount={minAmount}
						onAmountErrorChange={this.handleAmountErrorChange}
						disabled={this.isButtonDisabled()}
						credit={credit}
					/>
				</View>
			</KeyboardAwareScrollView>
		);
	}
}
