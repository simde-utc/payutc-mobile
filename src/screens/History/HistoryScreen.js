/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { RefreshControl, Text, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { History as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import List from '../../components/History/List';
import { PayUTC } from '../../redux/actions';
import BlockTemplate from '../../components/BlockTemplate';
import TabsBlockTemplate from '../../components/TabsBlockTemplate';

class HistoryScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	componentDidMount() {
		this.onRefresh();
	}

	onRefresh() {
		const { historyFetching, historyFetched, dispatch } = this.props;

		if (!historyFetching && !historyFetched) {
			dispatch(PayUTC.getHistory());
		}
	}

	getHistory(type) {
		const { history } = this.props;

		if (type) {
			return history.filter(transaction => transaction.type.startsWith(type));
		}

		return history;
	}

	render() {
		const { historyFetching } = this.props;

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
				<View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
					<BlockTemplate roundedTop roundedBottom shadow>
						<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary }}>
							{t('title')}
						</Text>
					</BlockTemplate>
				</View>

				<TabsBlockTemplate
					style={{ margin: 15 }}
					roundedTop
					roundedBottom
					tintColor={colors.primary}
					tabs={[
						{
							title: t('all'),
							children: () => (
								<List loading={historyFetching} items={this.getHistory()} title={t('all_desc')} />
							),
						},
						{
							title: t('purchased'),
							children: () => (
								<List
									loading={historyFetching}
									items={this.getHistory('PURCHASE')}
									title={t('purchased_desc')}
								/>
							),
						},
						{
							title: t('refills'),
							children: () => (
								<List
									loading={historyFetching}
									items={this.getHistory('RECHARGE')}
									title={t('refills_desc')}
								/>
							),
						},
						{
							title: t('transfers'),
							children: () => (
								<List
									loading={historyFetching}
									items={this.getHistory('VIR')}
									title={t('transfers_desc')}
								/>
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

export default connect(mapStateToProps)(HistoryScreen);
