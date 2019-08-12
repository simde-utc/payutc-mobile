/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import Item from './Item';
import List from '../List';
import colors from '../../styles/colors';

export default class HistoryList extends React.Component {
	static renderItem(item, index, last = false) {
		return (
			<Item
				transaction={item}
				customBackground={index % 2 === 0 ? colors.backgroundBlockAlt : colors.backgroundBlock}
				roundedBottom={last}
			/>
		);
	}

	render() {
		const { items, title, loading } = this.props;

		return (
			<List
				title={title}
				items={items}
				loading={loading}
				renderItem={HistoryList.renderItem}
				keyExtractor={item => item.id.toString()}
			/>
		);
	}
}
