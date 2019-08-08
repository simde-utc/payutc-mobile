/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { FlatList, Text } from 'react-native';
import BlockTemplate from '../BlockTemplate';
import { mostPurchasedItems } from '../../utils/stats';
import colors from '../../styles/colors';
import { _, Stats as t } from '../../utils/i18n';

export default class PurchasesTop extends React.PureComponent {
	static renderItem(item, rank) {
		return (
			<BlockTemplate
				key={item.name}
				customBackground={rank % 2 !== 0 ? colors.backgroundLight : colors.backgroundBlockAlt}
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.primary }}>#{rank}</Text>
				<Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.secondary }}>
					{item.name}
				</Text>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.less }}>{item.count}</Text>
			</BlockTemplate>
		);
	}

	render() {
		const { history, countMin } = this.props;
		const items = mostPurchasedItems(history)
			.filter(item => item.count >= countMin)
			.splice(0, 10);

		return (
			<FlatList
				style={{ padding: 15 }}
				data={items}
				keyExtractor={item => item.name.toString()}
				renderItem={({ item, index }) => this.renderItem(item, index + 1)}
				ListEmptyComponent={() => (
					<BlockTemplate>
						<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.disabled }}>
							{_('loading_text_replacement')}
						</Text>
					</BlockTemplate>
				)}
				ListHeaderComponent={() => (
					<BlockTemplate roundedTop shadow>
						<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>
							{t('ranking')}
						</Text>
					</BlockTemplate>
				)}
			/>
		);
	}
}
