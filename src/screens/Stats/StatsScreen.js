/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { _, Stats as t } from '../../utils/i18n';
import {
	lastMonthPurchasesTotal,
	numberOfTransactions,
	purchasesTotal,
	lastMonthTransferTotal,
	lastMonthReceivedTotal,
	firstTransaction,
} from '../../utils/stats';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import DataBlockTemplate from '../../components/Stats/DataBlockTemplate';
import { PayUTC } from '../../redux/actions';
import { beautifyDate } from '../../utils';
import StatsHorizontalScrollView from '../../components/Stats/StatsHorizontalScrollView';

class StatsScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	componentDidMount() {
		this.onRefresh();
	}

	onRefresh() {
		const { historyFetching, dispatch } = this.props;

		if (!historyFetching) {
			dispatch(PayUTC.getHistory());
		}
	}

	render() {
		const { historyFetching, history } = this.props;

		return (
			<ScrollView
				style={{ backgroundColor: colors.backgroundLight }}
				refreshControl={
					<RefreshControl
						refreshing={historyFetching}
						onRefresh={() => this.onRefresh()}
						colors={[colors.secondary]}
						tintColor={colors.secondary}
					/>
				}
			>
				<View style={{ margin: 15 }}>
					<BlockTemplate roundedTop roundedBottom shadow>
						<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary }}>
							{t('title')}
						</Text>
					</BlockTemplate>
				</View>
				<StatsHorizontalScrollView history={history} historyFetching={historyFetching} />
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ payutc }) => {
	const history = payutc.getHistory();

	return {
		history: history.getData({ historique: [] }).historique,
		historyFetching: history.isFetching(),
		historyFetched: history.isFetched(),
	};
};

export default connect(mapStateToProps)(StatsScreen);
