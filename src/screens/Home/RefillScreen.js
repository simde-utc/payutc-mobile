/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import AmountInput from '../../components/Home/AmountInput';
import { _, Refill as t } from '../../utils/i18n';
import { floatToEuro } from '../../utils';

class RefillForm extends React.PureComponent {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = { value: null };
		this.maxLength = 5;
		this.amountShortcuts = [10, 15, 20, 50];
	}

	onChange(value) {
		this.setState({ value, error: null });
	}

	isStringValid() {
		const format = /^\d+(,\d{1,2})?$/;
		const { value } = this.state;
		if (value == null) {
			return false;
		}
		return value.match(format) != null;
	}

	isAmountValid() {
		// String must be valid in order to parse the amount
		if (!this.isStringValid()) {
			return false;
		}
		const { value } = this.state;
		const { minAmount, maxAmount } = this.props;
		const valueAsFloat = parseFloat(value.replace(',', '.'));
		return valueAsFloat >= minAmount && valueAsFloat <= maxAmount;
	}

	isButtonDisabled() {
		const { error } = this.state;
		return !this.isStringValid() || error != null;
	}

	submit() {
		if (!this.isAmountValid()) {
			const { minAmount, maxAmount } = this.props;
			this.setState({
				error: `${t('bad_amount')} ${floatToEuro(minAmount)} ${_(
					'and'
				).toLowerCase()} ${floatToEuro(maxAmount)}.`,
			});
			return;
		}

		const { value } = this.state;
		const valueAsFloat = parseFloat(value.replace(',', '.'));

		alert(`Rechargement de ${valueAsFloat}`);
	}

	renderErrorMessage() {
		const { error } = this.state;
		return error != null ? (
			<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.error }}>{error}</Text>
		) : null;
	}

	renderShortcuts() {
		const shortcutsBlocks = this.amountShortcuts.map(shortcut => {
			return (
				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					key={shortcut}
					onPress={() => this.setState({ value: shortcut.toString(), error: null })}
				>
					<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.secondary }}>
						{shortcut} €
					</Text>
				</BlockTemplate>
			);
		});

		return (
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
				{shortcutsBlocks}
			</View>
		);
	}

	render() {
		const { value, error } = this.state;

		return (
			<View>
				<BlockTemplate roundedTop shadow>
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
						{t('amount')}
					</Text>
					<AmountInput
						value={value}
						error={error}
						maxLength={this.maxLength}
						tintColor={colors.more}
						autofocus
						onChange={this.onChange}
					/>
					{this.renderErrorMessage()}
					{this.renderShortcuts()}
				</BlockTemplate>
				<BlockTemplate
					roundedBottom
					shadow
					onPress={() => this.submit()}
					disabled={this.isButtonDisabled()}
					customBackground={this.isButtonDisabled() ? colors.backgroundBlock : colors.more}
				>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								color: colors.backgroundLight,
							}}
						>
							{t('pay')}
						</Text>
						<Ionicons name="md-arrow-forward" size={20} color={colors.backgroundLight} />
					</View>
				</BlockTemplate>
			</View>
		);
	}
}

export default class RefillScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerTintColor: colors.more,
		headerForceInset: { top: 'never' },
	};

	render() {
		const minAmount = 10;
		const { navigation } = this.props;
		const credit = navigation.getParam('credit');
		const maxAmount = 100 - credit;
		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight, padding: 15 }}>
				<RefillForm minAmount={minAmount} maxAmount={maxAmount} />
			</ScrollView>
		);
	}
}
