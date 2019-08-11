/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import DataBlockTemplate from './DataBlockTemplate';
import {
	firstTransaction,
	givenAmount,
	purchasesAmount,
	purchasesCount,
	receivedAmount,
} from '../../utils/stats';
import { _, Stats as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import { beautifyDate } from '../../utils';

export default function StatsHorizontalScrollView({ historyFetching, history, since }) {
	const loadingText = _('loading_text_replacement');

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false}>
			<View style={{ width: 15 }} />
			<DataBlockTemplate
				head={historyFetching ? loadingText : purchasesCount(history, since.date)}
				description={`${t('purchases_count')} ${since.text}`}
			/>
			<View style={{ width: 15 }} />
			<DataBlockTemplate
				head={historyFetching ? loadingText : purchasesAmount(history, since.date)}
				description={`${t('purchases_amount')} ${since.text}`}
				headTintColor={colors.less}
			/>
			<View style={{ width: 15 }} />
			<DataBlockTemplate
				head={historyFetching ? loadingText : receivedAmount(history, since.date)}
				description={`${t('received_amount')} ${since.text}`}
				headTintColor={colors.more}
			/>
			<View style={{ width: 15 }} />
			<DataBlockTemplate
				head={historyFetching ? loadingText : givenAmount(history, since.date)}
				description={`${t('give_amount')} ${since.text}`}
				headTintColor={colors.lightBlue}
			/>
			<View style={{ width: 15 }} />
			<DataBlockTemplate
				head={historyFetching ? loadingText : beautifyDate(firstTransaction(history))}
				description={t('first_transaction')}
				reversed
			/>
			<View style={{ width: 15 }} />
		</ScrollView>
	);
}
