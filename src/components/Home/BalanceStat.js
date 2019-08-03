/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import BlockTemplate from '../BlockTemplate';
import colors from '../../styles/colors';
import { Home as t } from '../../utils/i18n';

export default class BalanceStat extends React.PureComponent {
	render() {
		const { navigation, amount } = this.props;
		return (
			<View>
				<BlockTemplate roundedTop shadow>
					<Text
						style={{
							fontSize: 20,
							fontWeight: 'bold',
							color: amount === 0 ? colors.more : colors.less,
						}}
					>
						{amount} €
					</Text>
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
						dépensés ces 7 derniers jours.
					</Text>
				</BlockTemplate>
				<View style={{ borderColor: colors.backgroundLight, height: 1 }} />
				<BlockTemplate roundedBottom onPress={() => navigation.navigate('Stats')}>
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.primary }}>
						{t('all_stats')}
					</Text>
				</BlockTemplate>
			</View>
		);
	}
}
