/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import Item from './Item';
import BlockTemplate from '../BlockTemplate';
import List from '../List';
import colors from '../../styles/colors';
import { History as t } from '../../utils/i18n';

const LOAD_TRANSACTIONS = 50;

export default class HistoryList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			maxTransactions: LOAD_TRANSACTIONS,
		};

		this.showMore = this.showMore.bind(this);
		this.renderFooter = this.renderFooter.bind(this);
	}

	componentDidUpdate(prevProps) {
		const { loading } = this.props;

		if (!prevProps.loading && loading) {
			this.setState({ maxTransactions: LOAD_TRANSACTIONS });
		}
	}

	static renderItem(item, index, last = false) {
		return (
			<Item
				transaction={item}
				customBackground={index % 2 === 0 ? colors.backgroundBlockAlt : colors.backgroundBlock}
				roundedBottom={last}
			/>
		);
	}

	showMore() {
		this.setState(prevState => ({
			...prevState,
			maxTransactions: prevState.maxTransactions + LOAD_TRANSACTIONS,
		}));
	}

	renderFooter() {
		return (
			<BlockTemplate
				roundedBottom
				onPress={this.showMore}
				customBackground={colors.backgroundBlockAlt}
			>
				<Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary }}>
					{t('show_more')}
				</Text>
			</BlockTemplate>
		);
	}

	render() {
		const { items, title, loading } = this.props;
		const { maxTransactions } = this.state;

		return (
			<List
				title={title}
				items={items.slice(0, maxTransactions)}
				loading={loading}
				renderItem={HistoryList.renderItem}
				renderFooter={this.renderFooter}
				keyExtractor={item => item.id.toString()}
				notRoundedTop
				noBottomBorder
			/>
		);
	}
}
