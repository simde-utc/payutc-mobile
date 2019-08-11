/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { RefreshControl, TextInput, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors from '../../styles/colors';
import TitleParams from '../../components/TitleParams';
import BlockTemplate from '../../components/BlockTemplate';
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
			search: '',
		};

		this.onSearchChange = this.onSearchChange.bind(this);
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

	onSearchChange(search) {
		this.setState({ search });
	}

	getHistory(type) {
		let { history } = this.props;
		const { dates, selectedDate, search } = this.state;

		if (type) {
			history = history.filter(transaction => transaction.type.startsWith(type));
		}

		history = history.filter(({ date }) => new Date(date) > new Date(dates[selectedDate].date));

		if (search !== '') {
			history = history.filter(
				({ name, message }) =>
					(name && name.includes(search)) || (message && message.includes(search))
			);
		}

		return history;
	}

	render() {
		const { historyFetching } = this.props;
		const { dates, selectedDate, search } = this.state;
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
					<BlockTemplate shadow style={{ marginHorizontal: 15 }}>
						<View style={{ flex: 1, flexDirection: 'row', paddingLeft: 5, alignItems: 'center' }}>
							<FontAwesomeIcon icon={['fas', 'search']} size={20} color={colors.secondary} />
							<TextInput
								style={{
									flexGrow: 1,
									paddingLeft: 10,
									fontSize: 18,
									color: colors.primary,
								}}
								autoCapitalize="none"
								placeholder={t('search')}
								selectionColor={colors.primary}
								textContentType="none"
								onChangeText={this.onSearchChange}
								value={search}
							/>
						</View>
					</BlockTemplate>
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
