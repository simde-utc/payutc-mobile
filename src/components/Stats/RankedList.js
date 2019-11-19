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
import BlockTemplate from '../BlockTemplate';
import List from '../List';
import colors from '../../styles/colors';
import { floatToEuro } from '../../utils/amount';
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

	renderItem(item, index) {
		const { euro, countTintColor } = this.props;

		return (
			<BlockTemplate
				roundedTop
				roundedBottom
				customBackground={colors.backgroundBlockAlt}
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 10,
				}}
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
				roundedTop
				roundedBottom
				onPress={this.showMore}
				disabled={disabled}
				customBackground={colors.backgroundBlock}
				style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
			>
				<Text
					style={{
						fontSize: 14,
						fontWeight: 'bold',
						color: disabled ? colors.disabled : colors.primary,
					}}
				>
					{t('show_more')}
				</Text>
				<FontAwesomeIcon
					icon={['fas', 'chevron-down']}
					size={16}
					color={disabled ? colors.disabled : colors.primary}
				/>
			</BlockTemplate>
		);
	}

	render() {
		const { items, title, noBottomBorder, loading } = this.props;
		const { slice } = this.state;

		return (
			<>
				<BlockTemplate
					roundedTop
					roundedBottom
					customBackground={colors.backgroundBlock}
					style={{ marginTop: 15, marginBottom: 10 }}
				>
					<Text
						style={{
							fontSize: 14,
							fontWeight: 'bold',
							color: colors.primary,
						}}
					>
						{title}
					</Text>
				</BlockTemplate>
				<List
					items={items.slice(0, slice)}
					loading={loading}
					noBottomBorder={noBottomBorder}
					renderItem={this.renderItem.bind(this)}
					renderFooter={this.renderFooter}
					keyExtractor={item => item.name.toString()}
				/>
			</>
		);
	}
}
