/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import * as Haptics from 'expo-haptics';
import BlockTemplate from '../BlockTemplate';
import { Home as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import { floatToEuro } from '../../utils/amount';

export default class Balance extends React.Component {
	getWeekAmount() {
		const { weekAmount } = this.props;

		return floatToEuro(Math.abs(weekAmount));
	}

	getWeekAmountColor() {
		const { weekAmount } = this.props;

		return weekAmount === 0 ? colors.primary : colors.less;
	}

	getWeekAmountText() {
		const { weekAmount } = this.props;
		const amount = Math.abs(weekAmount);

		return t('week_negative', { count: Math.floor(amount) });
	}

	renderDetails(loading, name, amount) {
		const { isCreditConsistent } = this.props;

		if (loading) {
			return (
				<View style={{ flex: 1 }}>
					<Placeholder Animation={Fade}>
						<PlaceholderLine
							width={70}
							height={14}
							style={{
								backgroundColor: colors.backgroundBlockAlt,
								marginBottom: 7,
								borderRadius: 10,
							}}
						/>
						<PlaceholderLine
							width={80}
							height={65}
							style={{
								backgroundColor: colors.backgroundBlockAlt,
								marginBottom: 7,
								borderRadius: 10,
							}}
						/>
						<PlaceholderLine
							width={60}
							height={13}
							style={{
								backgroundColor: colors.backgroundBlockAlt,
								marginBottom: 0,
								borderRadius: 10,
							}}
						/>
					</Placeholder>
				</View>
			);
		}

		return (
			<View>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
					{t('your_balance', { name })}
				</Text>
				{isCreditConsistent ? (
					<Text style={{ fontSize: 65, fontWeight: 'bold', color: colors.primary, lineHeight: 70 }}>
						{floatToEuro(amount)}
					</Text>
				) : (
					<Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary }}>
						{t('no_balance')}
					</Text>
				)}
				<Text style={{ fontSize: 13, color: colors.secondary }}>
					<Text style={{ fontWeight: 'bold', color: this.getWeekAmountColor() }}>
						{this.getWeekAmount()}
					</Text>{' '}
					{this.getWeekAmountText()}
				</Text>
			</View>
		);
	}

	render() {
		const { amount, name, loading, onRefresh } = this.props;

		return (
			<View
				style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}
			>
				{this.renderDetails(loading, name, amount)}
				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					borderForAndroid
					onPress={() => {
						Haptics.selectionAsync().catch();
						onRefresh();
					}}
					disabled={loading}
				>
					<FontAwesomeIcon
						icon={['fas', 'sync-alt']}
						size={14}
						color={loading ? colors.disabled : colors.secondary}
					/>
				</BlockTemplate>
			</View>
		);
	}
}
