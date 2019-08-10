/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import TitleParams from '../../components/TitleParams';
import List from '../../components/History/List';
import { PayUTC } from '../../redux/actions';
import TabsBlockTemplate from '../../components/TabsBlockTemplate';
import { firstTransaction } from '../../utils/stats';
import { _, History as t } from '../../utils/i18n';

class HistoryScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);

		const ever = firstTransaction(props.history);

		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);

		this.state = {
			dates: [
				{ title: _('ever'), date: ever },
				{ title: _('month'), date: oneMonthAgo },
				{ title: _('week'), date: oneWeekAgo },
				{ title: _('yesterday'), date: yesterday },
			],
			selectedDate: 0,
		};
	}

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
		let { history } = this.props;
		const { dates, selectedDate } = this.state;

		if (type) {
			history = history.filter(transaction => transaction.type.startsWith(type));
		}

		return history.filter(item => new Date(item.date) > new Date(dates[selectedDate].date));
	}

	render() {
		const { historyFetching } = this.props;
		const { dates, selectedDate } = this.state;
		const since = _('since_*', { since: dates[selectedDate].title.toLowerCase() });

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
				<TitleParams title={t('title')} settingText={since}>
					<TabsBlockTemplate
						roundedBottom
						text={_('show_since')}
						tintColor={colors.secondary}
						default={selectedDate}
						onChange={index => this.setState({ selectedDate: index })}
						style={{ marginHorizontal: 15, borderTopWidth: 0 }}
						tabs={dates}
					/>
				</TitleParams>

				<TabsBlockTemplate
					style={{ margin: 15 }}
					roundedTop
					roundedBottom
					tintColor={colors.primary}
					tabs={[
						{
							title: t('all'),
							children: () => (
								<List
									loading={historyFetching}
									items={this.getHistory()}
									title={t('all_desc', { since: since.toLowerCase() })}
								/>
							),
						},
						{
							title: t('purchased'),
							children: () => (
								<List
									loading={historyFetching}
									items={this.getHistory('PURCHASE')}
									title={t('purchased_desc', { since: since.toLowerCase() })}
								/>
							),
						},
						{
							title: t('refills'),
							children: () => (
								<List
									loading={historyFetching}
									items={this.getHistory('RECHARGE')}
									title={t('refills_desc', { since: since.toLowerCase() })}
								/>
							),
						},
						{
							title: t('transfers'),
							children: () => (
								<List
									loading={historyFetching}
									items={this.getHistory('VIR')}
									title={t('transfers_desc', { since: since.toLowerCase() })}
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
