/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { FlatList, Text } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import BlockTemplate from './BlockTemplate';
import colors from '../styles/colors';
import { _ } from '../utils/i18n';

function LoadingItem({ backgroundColor }) {
	return (
		<BlockTemplate customBackground={backgroundColor}>
			<Placeholder Animation={Fade}>
				<PlaceholderLine
					width={70}
					height={14}
					style={{ backgroundColor: colors.backgroundBlockAlt, marginBottom: 7, borderRadius: 10 }}
				/>
				<PlaceholderLine
					width={60}
					height={13}
					style={{ backgroundColor: colors.backgroundBlockAlt, marginBottom: 0, borderRadius: 10 }}
				/>
			</Placeholder>
		</BlockTemplate>
	);
}

function LoadingList() {
	return (
		<>
			<LoadingItem backgroundColor={colors.backgroundBlockAlt} />
			<LoadingItem backgroundColor={colors.backgroundBlock} />
			<LoadingItem backgroundColor={colors.backgroundBlockAlt} />
		</>
	);
}

export default function List({
	items,
	title,
	noBottomBorder,
	notRoundedTop,
	loading,
	renderItem,
	keyExtractor,
	onPress,
	refreshControl,
}) {
	return (
		<FlatList
			style={{
				backgroundColor: colors.backgroundBlock,
				borderTopLeftRadius: notRoundedTop ? 0 : 10,
				borderTopRightRadius: notRoundedTop ? 0 : 10,
				borderRadius: 10,
			}}
			data={items}
			keyExtractor={keyExtractor}
			renderItem={({ item, index }) =>
				loading ? (
					<LoadingList />
				) : (
					renderItem(item, index, !noBottomBorder && index === items.length - 1)
				)
			}
			ListEmptyComponent={() =>
				loading ? (
					<LoadingList />
				) : (
					<BlockTemplate roundedBottom customBackground={colors.backgroundBlockAlt}>
						<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.disabled }}>
							{_('empty_list')}
						</Text>
					</BlockTemplate>
				)
			}
			ListHeaderComponent={
				title
					? () => (
							<BlockTemplate roundedTop={!notRoundedTop} onPress={onPress}>
								<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>
									{title}
								</Text>
							</BlockTemplate>
					  )
					: null
			}
			refreshControl={refreshControl}
		/>
	);
}
