/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { FlatList, Text } from 'react-native';
import Item from './Item';
import BlockTemplate from '../BlockTemplate';
import colors from '../../styles/colors';
import { _, History as t } from '../../utils/i18n';

export default class List extends React.Component {
	static renderItem(item, rank, last = false) {
		return (
			<Item
				key={item.id}
				transaction={item}
				customBackground={rank % 2 === 0 ? colors.backgroundBlock : colors.backgroundBlockAlt}
				roundedBottom={last}
			/>
		);
	}

	render() {
		const { items, title, loading } = this.props;

		return (
			<FlatList
				data={items}
				keyExtractor={item => item.id.toString()}
				renderItem={({ item, index }) =>
					List.renderItem(item, index + 1, index === items.length - 1)
				}
				ListEmptyComponent={() => (
					<BlockTemplate roundedBottom>
						<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.disabled }}>
							{loading ? _('loading_text_replacement') : t('empty_list')}
						</Text>
					</BlockTemplate>
				)}
				ListHeaderComponent={() => (
					<BlockTemplate>
						<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>{title}</Text>
					</BlockTemplate>
				)}
			/>
		);
	}
}
