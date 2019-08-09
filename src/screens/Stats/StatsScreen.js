/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Stats as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import { PayUTC } from '../../redux/actions';
import StatsHorizontalScrollView from '../../components/Stats/StatsHorizontalScrollView';
import RankedList from '../../components/Stats/RankedList';
import TabsBlockTemplate from '../../components/TabsBlockTemplate';
import {
	mostGivenToPeople,
	mostPurchasedItems,
	mostReceivedFromPersons,
	mostSpentItems,
} from '../../utils/stats';

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
				<View style={{ padding: 15 }}>
					<BlockTemplate roundedTop roundedBottom shadow>
						<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary }}>
							{t('title')}
						</Text>
					</BlockTemplate>
				</View>
				<StatsHorizontalScrollView history={history} historyFetching={historyFetching} />

				<TabsBlockTemplate
					style={{ margin: 15 }}
					roundedTop
					roundedBottom
					tintColor={colors.primary}
					tabs={[
						{
							title: t('buyRankingTitle'),
							children: (
								<RankedList
									title={t('buyRanking')}
									items={mostPurchasedItems(history).splice(0, 10)}
									countTintColor={colors.less}
								/>
							),
						},
						{
							title: t('spendRankingTitle'),
							children: (
								<RankedList
									title={t('spendRanking')}
									euro
									items={mostSpentItems(history).splice(0, 10)}
									countTintColor={colors.less}
								/>
							),
						},
						{
							title: t('transferRankingTitle'),
							children: (
								<View>
									<RankedList
										title={t('receiveRanking')}
										euro
										items={mostReceivedFromPersons(history).splice(0, 5)}
										countTintColor={colors.more}
									/>
									<View style={{ borderTopWidth: 1, borderTopColor: colors.backgroundLight }} />
									<RankedList
										title={t('giveRanking')}
										euro
										items={mostGivenToPeople(history).splice(0, 5)}
										countTintColor={colors.less}
									/>
								</View>
							),
						},
					]}
				/>
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
