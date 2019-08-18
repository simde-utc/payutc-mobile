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
import { Stats as t } from '../../utils/i18n';

const DEFAULT_SLICE = 10;

export default class RankedList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			slice: this.getNbrSlice(),
		};

		this.showMore = this.showMore.bind(this);
		this.renderFooter = this.renderFooter.bind(this);
	}

	getNbrSlice() {
		const { slice } = this.props;

		return slice || DEFAULT_SLICE;
	}

	showMore() {
		this.setState(prevState => ({
			...prevState,
			slice: prevState.slice + this.getNbrSlice(),
		}));
	}

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

	renderFooter() {
		const { items, loading } = this.props;
		const { slice } = this.state;
		const disabled = loading || items.length <= slice;

		if (!items.length) return null;

		return (
			<BlockTemplate
				roundedBottom
				onPress={this.showMore}
				style={{ paddingVertical: 5 }}
				disabled={disabled}
			>
				<Text
					style={{
						fontSize: 12,
						fontWeight: 'bold',
						color: disabled ? colors.disabled : colors.primary,
					}}
				>
					{t('show_more')}
				</Text>
			</BlockTemplate>
		);
	}

	render() {
		const { items, title, noBottomBorder, loading } = this.props;
		const { slice } = this.state;

		return (
			<List
				title={title}
				items={items.slice(0, slice)}
				loading={loading}
				noBottomBorder={noBottomBorder}
				renderItem={this.renderItem.bind(this)}
				renderFooter={this.renderFooter}
				keyExtractor={item => item.name.toString()}
			/>
		);
	}
}
