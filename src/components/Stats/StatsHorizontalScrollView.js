/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import DataBlockTemplate from './DataBlockTemplate';
import {
	firstTransaction,
	lastMonthPurchasesTotal,
	lastMonthReceivedTotal,
	lastMonthTransferTotal,
	purchasesCount,
	purchasesTotal,
} from '../../utils/stats';
import { _, Stats as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import { beautifyDate } from '../../utils';

export default class StatsHorizontalScrollView extends React.PureComponent {
	render() {
		const { historyFetching, history } = this.props;
		const loadingText = _('loading_text_replacement');

		return (
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View style={{ width: 15 }} />
				<DataBlockTemplate
					head={historyFetching ? loadingText : purchasesCount(history)}
					description={t('purchasesCount')}
				/>
				<View style={{ width: 15 }} />
				<DataBlockTemplate
					head={historyFetching ? loadingText : lastMonthPurchasesTotal(history)}
					description={t('lastMonthPurchases')}
					headTintColor={colors.less}
				/>
				<View style={{ width: 15 }} />
				<DataBlockTemplate
					head={historyFetching ? loadingText : lastMonthTransferTotal(history)}
					description={t('lastMonthTransfers')}
					headTintColor={colors.lightBlue}
				/>
				<View style={{ width: 15 }} />
				<DataBlockTemplate
					head={historyFetching ? loadingText : purchasesTotal(history)}
					description={t('purchasesTotal')}
					headTintColor={colors.less}
				/>
				<View style={{ width: 15 }} />
				<DataBlockTemplate
					head={historyFetching ? loadingText : lastMonthReceivedTotal(history)}
					description={t('lastMonthReceived')}
					headTintColor={colors.more}
				/>
				<View style={{ width: 15 }} />
				<DataBlockTemplate
					head={historyFetching ? loadingText : beautifyDate(firstTransaction(history))}
					description={t('firstTransaction')}
					reversed
				/>
				<View style={{ width: 15 }} />
			</ScrollView>
		);
	}
}
