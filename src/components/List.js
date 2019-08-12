/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { FlatList, Text } from 'react-native';
import BlockTemplate from './BlockTemplate';
import colors from '../styles/colors';
import { _ } from '../utils/i18n';

export default function List({
	items,
	title,
	noBottomBorder,
	notRoundedTop,
	loading,
	renderItem,
	keyExtractor,
}) {
	return (
		<FlatList
			data={items}
			keyExtractor={keyExtractor}
			renderItem={({ item, index }) =>
				renderItem(item, index, !noBottomBorder && index === items.length - 1)
			}
			ListEmptyComponent={() => (
				<BlockTemplate roundedBottom customBackground={colors.backgroundBlockAlt}>
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.disabled }}>
						{loading ? _('loading_text_replacement') : _('empty_list')}
					</Text>
				</BlockTemplate>
			)}
			ListHeaderComponent={() => (
				<BlockTemplate roundedTop={!notRoundedTop}>
					<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>{title}</Text>
				</BlockTemplate>
			)}
		/>
	);
}
