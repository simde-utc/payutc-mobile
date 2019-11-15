/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import * as Haptics from 'expo-haptics';
import { connect } from 'react-redux';
import BlockTemplate from '../BlockTemplate';
import { Home as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import { floatToEuro } from '../../utils/amount';
import { Config } from '../../redux/actions';

class Balance extends React.Component {
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

	setHiddenTheme() {
		const { dispatch } = this.props;

		Haptics.notificationAsync('success').catch();

		dispatch(Config.setTheme('purple'));
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
				<TouchableOpacity
					activeOpacity={1}
					delayLongPress={5000}
					onLongPress={() => this.setHiddenTheme()}
				>
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
						{t('your_balance', { name })}
					</Text>
				</TouchableOpacity>
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
		const { amount, name, loading, navigation } = this.props;

		return (
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				{this.renderDetails(loading, name, amount)}

				<View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
					<BlockTemplate
						roundedTop
						roundedBottom
						shadow
						borderForAndroid
						onPress={() => {
							Haptics.selectionAsync().catch();
							navigation.navigate('History');
						}}
						disabled={loading}
					>
						<FontAwesomeIcon
							icon={['fas', 'list']}
							size={15}
							color={loading ? colors.disabled : colors.primary}
						/>
					</BlockTemplate>

					<BlockTemplate
						roundedTop
						roundedBottom
						shadow
						borderForAndroid
						onPress={() => {
							Haptics.selectionAsync().catch();
							navigation.navigate('Stats');
						}}
						disabled={loading}
					>
						<FontAwesomeIcon
							icon={['fas', 'chart-line']}
							size={15}
							color={loading ? colors.disabled : colors.primary}
						/>
					</BlockTemplate>
				</View>
			</View>
		);
	}
}

export default connect()(Balance);
