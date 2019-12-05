/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import TransactionList from './TransactionList';
import BlockTemplate from '../BlockTemplate';
import List from '../List';
import colors from '../../styles/colors';
import { History as t } from '../../utils/i18n';

const DEFAULT_SLICE = 50;

export default class HistoryList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			slice: DEFAULT_SLICE,
		};

		this.showMore = this.showMore.bind(this);
		this.renderFooter = this.renderFooter.bind(this);
	}

	componentDidUpdate(prevProps) {
		const { loading, slice } = this.props;

		if (!prevProps.loading && loading) {
			this.setState({ slice });
		}
	}

	static renderTransactionList(items, index, last = false) {
		return (
			<View style={{ marginBottom: last ? 0 : 10 }}>
				<TransactionList transactions={items} />
			</View>
		);
	}

	showMore() {
		const { slice } = this.props;

		this.setState(prevState => ({
			...prevState,
			slice: prevState.slice + (slice || DEFAULT_SLICE),
		}));
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
		const { items, title, loading } = this.props;
		const { slice } = this.state;

		const itemsByDate = items.reduce((r, a) => {
			r[a.date] = r[a.date] || [];
			r[a.date].push(a);
			return r;
		}, Object.create(null));

		return (
			<List
				title={title}
				items={Object.values(itemsByDate)
					.filter(item => item.length > 0)
					.slice(0, slice)}
				loading={loading}
				renderItem={HistoryList.renderTransactionList}
				renderFooter={this.renderFooter}
				keyExtractor={item => item[0].id.toString()}
				notRoundedTop
				noBottomBorder
			/>
		);
	}
}
