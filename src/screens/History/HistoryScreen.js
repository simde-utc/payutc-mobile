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
import HistoryList from '../../components/History/HistoryList';
import { Config, PayUTC, Portail } from '../../redux/actions';
import TabsBlockTemplate from '../../components/TabsBlockTemplate';
import { _, History as t } from '../../utils/i18n';
import { getDateFromPortail } from '../../utils/date';

class HistoryScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
		headerTruncatedBackTitle: _('back'),
	});

	constructor(props) {
		super(props);

		const oneMonthAgo = new Date();
		oneMonthAgo.setUTCMonth(oneMonthAgo.getMonth() - 1);

		const lastMonday = new Date();
		lastMonday.setUTCDate(lastMonday.getUTCDate() - ((lastMonday.getUTCDay() + 6) % 7));
		lastMonday.setUTCHours(0, 0, 0);

		const thisMorning = new Date();
		const START_DAY_AT = 6;
		if (thisMorning.getUTCHours() < START_DAY_AT) thisMorning.setUTCDate(thisMorning.getUTCDate() - 1);
		thisMorning.setUTCHours(START_DAY_AT, 0, 0);

		this.state = {
			dates: [
				{ lazyTitle: 'this_morning', date: thisMorning },
				{ lazyTitle: 'monday', date: lastMonday },
				{ lazyTitle: 'semester', date: null },
				{ lazyTitle: 'ever', date: null },
			],
			search: '',
		};

		this.onSearchChange = this.onSearchChange.bind(this);
		this.onSelectedDateChange = this.onSelectedDateChange.bind(this);
		this.onSelectedCategoryChange = this.onSelectedCategoryChange.bind(this);
	}

	componentDidMount() {
		const { historyFetched, currentSemesterFetched, dispatch } = this.props;

		if (!historyFetched) {
			this.onRefresh();
		}

		if (!currentSemesterFetched) {
			dispatch(Portail.getCurrentSemester());
		} else {
			this.setCurrentSemester();
		}
	}

	componentDidUpdate({ currentSemesterFetching: wasFetching }) {
		const { currentSemesterFetching } = this.props;

		if (wasFetching && !currentSemesterFetching) {
			this.setCurrentSemester();
		}
	}

	onRefresh() {
		const { historyFetching, currentSemesterFetching, dispatch } = this.props;

		if (!historyFetching) {
			dispatch(PayUTC.getHistory());
		}

		if (!currentSemesterFetching) {
			dispatch(Portail.getCurrentSemester());
		}
	}

	onSearchChange(search) {
		this.setState({ search });
	}

	onSelectedDateChange(selectedDate) {
		const { dispatch } = this.props;

		dispatch(Config.preferences({ selectedDate }));
	}

	onSelectedCategoryChange(selectedHistoryCategory) {
		const { dispatch } = this.props;

		dispatch(Config.preferences({ selectedHistoryCategory }));
	}

	setCurrentSemester() {
		const { currentSemester } = this.props;

		this.setState(prevState => {
			for (const key in prevState.dates) {
				if (prevState.dates[key].lazyTitle === 'semester') {
					prevState.dates[key].date = getDateFromPortail(currentSemester.begin_at);

					break;
				}
			}

			return prevState;
		});
	}

	getHistory(type) {
		let { history } = this.props;
		const { preferences } = this.props;
		let { search } = this.state;
		const { dates } = this.state;

		if (type) {
			history = history.filter(transaction => transaction.type.startsWith(type));
		}

		if (dates[preferences.selectedDate].date) {
			const maxDate = dates[preferences.selectedDate].date;

			history = history.filter(({ date }) => new Date(date) > maxDate);
		}

		if (search !== '') {
			search = search.toLowerCase();

			history = history.filter(
				({ name, message, fun }) =>
					(name && name.toLowerCase().includes(search)) ||
					(message && message.toLowerCase().includes(search)) ||
					(fun && fun.toLowerCase().includes(search))
			);
		}

		return history;
	}

	render() {
		const { historyFetching, preferences } = this.props;
		const { dates, search } = this.state;
		const since = _('since_*', {
			since: _(dates[preferences.selectedDate].lazyTitle).toLowerCase(),
		});

		return (
			<ScrollView
				style={{ backgroundColor: colors.background }}
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
						value={preferences.selectedDate}
						onChange={this.onSelectedDateChange}
						style={{ marginHorizontal: 15, borderTopWidth: 0 }}
						tabs={dates}
					/>
				</TitleParams>

				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					style={{ marginTop: 15, marginHorizontal: 15 }}
				>
					<View style={{ flex: 1, flexDirection: 'row', paddingLeft: 5, alignItems: 'center' }}>
						<FontAwesomeIcon icon={['fas', 'search']} size={20} color={colors.secondary} />
						<TextInput
							style={{
								flexGrow: 1,
								paddingLeft: 10,
								fontSize: 18,
								color: colors.secondary,
								padding: 0,
								margin: 0,
							}}
							keyboardAppearance={colors.generalAspect}
							autoCapitalize="none"
							placeholder={t('search')}
							placeholderTextColor={colors.disabled}
							textContentType="none"
							onChangeText={this.onSearchChange}
							value={search}
						/>
					</View>
				</BlockTemplate>

				<TabsBlockTemplate
					style={{ margin: 15 }}
					roundedTop
					roundedBottom
					value={preferences.selectedHistoryCategory}
					onChange={this.onSelectedCategoryChange}
					tintColor={colors.primary}
					tabs={[
						{
							title: t('all'),
							children: (
								<HistoryList
									loading={historyFetching}
									items={this.getHistory()}
									title={t('all_desc', { since: since.toLowerCase() })}
								/>
							),
						},
						{
							title: t('purchased'),
							children: (
								<HistoryList
									loading={historyFetching}
									items={this.getHistory('PURCHASE')}
									title={t('purchased_desc', { since: since.toLowerCase() })}
								/>
							),
						},
						{
							title: t('refills'),
							children: (
								<HistoryList
									loading={historyFetching}
									items={this.getHistory('RECHARGE')}
									title={t('refills_desc', { since: since.toLowerCase() })}
								/>
							),
						},
						{
							title: t('transfers'),
							children: (
								<HistoryList
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

const mapStateToProps = ({ payutc, portail, config: { preferences } }) => {
	const history = payutc.getHistory();
	const currentSemester = portail.getCurrentSemester();

	return {
		preferences,
		history: history.getData({ historique: [] }).historique,
		historyFetching: history.isFetching(),
		historyFetched: history.isFetched(),
		currentSemester: currentSemester.getData({}),
		currentSemesterFetching: currentSemester.isFetching(),
		currentSemesterFetched: currentSemester.isFetched(),
	};
};

export default connect(mapStateToProps)(HistoryScreen);
