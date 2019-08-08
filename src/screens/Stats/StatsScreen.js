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
import PurchasesTop from '../../components/Stats/PurchasesTop';

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
				<PurchasesTop history={history} countMin={1} />
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
