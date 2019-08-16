/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import BlockTemplate from '../BlockTemplate';
import List from '../List';
import colors from '../../styles/colors';
import { floatToEuro } from '../../utils';

export default class RankedList extends React.Component {
	renderItem(item, index, roundedBottom = false) {
		const { euro, countTintColor } = this.props;

		return (
			<BlockTemplate
				customBackground={index % 2 === 0 ? colors.backgroundBlockAlt : colors.backgroundBlock}
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
				roundedBottom={roundedBottom}
			>
				<Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.primary }}>
					#{index + 1}
				</Text>
				<View style={{ flex: 1, flexWrap: 'wrap', alignItems: 'center', marginHorizontal: 5 }}>
					<Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.secondary }}>
						{item.name}
					</Text>
				</View>
				<Text
					style={{
						fontSize: 14,
						fontWeight: 'bold',
						color: countTintColor || colors.primary,
					}}
				>
					{euro ? floatToEuro(item.count / 100) : item.count}
				</Text>
			</BlockTemplate>
		);
	}

	render() {
		const { items, title, noBottomBorder, loading } = this.props;

		return (
			<List
				title={title}
				items={items}
				loading={loading}
				noBottomBorder={noBottomBorder}
				renderItem={this.renderItem.bind(this)}
				keyExtractor={item => item.name.toString()}
			/>
		);
	}
}
