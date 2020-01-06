/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors from '../../styles/colors';
import { Config, PayUTC, Portail } from '../../redux/actions';
import StatsHorizontalScrollView from '../../components/Stats/StatsHorizontalScrollView';
import RankedList from '../../components/Stats/RankedList';
import { _, Stats as t } from '../../utils/i18n';
import TabsBlockTemplate from '../../components/TabsBlockTemplate';
import {
	mostGivenToPeople,
	mostPurchasedItems,
	mostReceivedFromPersons,
	mostSpentItems,
} from '../../utils/stats';
import { getDateFromPortail } from '../../utils/date';

class StatsScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		const areFiltersVisible = navigation.getParam('areFiltersVisible');

		return {
			title: navigation.getParam('since') || t('title'),
			headerStyle: {
				borderBottomWidth: 0,
				backgroundColor: colors.backgroundBlock,
				elevation: areFiltersVisible ? 0 : 1,
			},
			headerTintColor: colors.primary,
			headerForceInset: { top: 'never' },
			headerRight: (
				<TouchableOpacity
					onPress={() => navigation.setParams({ areFiltersVisible: !areFiltersVisible })}
				>
					<FontAwesomeIcon
						icon={['fas', 'clock']}
						size={20}
						color={areFiltersVisible ? colors.secondary : colors.primary}
						style={{ marginHorizontal: 15, alignSelf: 'center' }}
					/>
				</TouchableOpacity>
			),
		};
	};

	constructor(props) {
		super(props);

		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);

		this.state = {
			dates: [
				{ lazyTitle: 'ever', date: null },
				{ lazyTitle: 'semester', date: null },
				{ lazyTitle: 'month', date: oneMonthAgo },
				{ lazyTitle: 'week', date: oneWeekAgo },
				{ lazyTitle: 'yesterday', date: yesterday },
			],
		};

		this.onSelectedDateChange = this.onSelectedDateChange.bind(this);
		this.onSelectedCategoryChange = this.onSelectedCategoryChange.bind(this);
	}

	componentDidMount() {
		const {
			historyFetched,
			currentSemesterFetched,
			dispatch,
			navigation,
			preferences,
		} = this.props;
		const { dates } = this.state;

		if (!historyFetched) {
			this.onRefresh();
		}

		if (!currentSemesterFetched) {
			dispatch(Portail.getCurrentSemester());
		} else {
			this.setCurrentSemester();
		}

		navigation.setParams({
			since:
				preferences.selectedDate > 0
					? _('since_*', { since: _(dates[preferences.selectedDate].lazyTitle).toLowerCase() })
					: null,
		});
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

	onSelectedDateChange(selectedDate) {
		const { dispatch, navigation, preferences } = this.props;
		const { dates } = this.state;

		dispatch(Config.preferences({ selectedDate }));

		navigation.setParams({
			since:
				preferences.selectedDate > 0
					? _('since_*', { since: _(dates[preferences.selectedDate].lazyTitle).toLowerCase() })
					: null,
		});
	}

	onSelectedCategoryChange(selectedStatCategory) {
		const { dispatch } = this.props;

		dispatch(Config.preferences({ selectedStatCategory }));
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

	render() {
		const { historyFetched, history, preferences, navigation } = this.props;
		const { dates } = this.state;
		let filteredHistory = history;

		if (dates[preferences.selectedDate].date) {
			const maxDate = dates[preferences.selectedDate].date;

			filteredHistory = history.filter(({ date }) => new Date(date) > maxDate);
		}

		const areFiltersVisible = navigation.getParam('areFiltersVisible');

		return (
			<View style={{ flex: 1, backgroundColor: colors.background }}>
				{areFiltersVisible ? (
					<TabsBlockTemplate
						tintColor={colors.secondary}
						value={preferences.selectedDate}
						onChange={this.onSelectedDateChange}
						tabs={dates}
						backgroundColor={colors.backgroundBlock}
						offsetLeft={15}
						offsetRight={20}
						style={{ paddingTop: 5, paddingBottom: 10, elevation: 1 }}
					/>
				) : null}
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={!historyFetched}
							onRefresh={() => this.onRefresh()}
							colors={[colors.secondary]}
							tintColor={colors.secondary}
						/>
					}
				>
					<View style={{ marginTop: 15 }}>
						<StatsHorizontalScrollView
							history={history}
							historyFetching={!historyFetched}
							since={{ text: '', date: dates[preferences.selectedDate].date }}
						/>
					</View>

					<View
						style={{ marginVertical: 15, height: 1, backgroundColor: colors.backgroundBlock }}
					/>

					<TabsBlockTemplate
						style={{ margin: 15, marginTop: 0 }}
						roundedTop
						roundedBottom
						tintColor={colors.primary}
						value={preferences.selectedStatCategory}
						justifyContent="center"
						onChange={this.onSelectedCategoryChange}
						tabs={[
							{
								title: t('buy_ranking_title'),
								children: (
									<RankedList
										title={t('buy_ranking')}
										items={mostPurchasedItems(filteredHistory)}
										countTintColor={colors.less}
										loading={!historyFetched}
									/>
								),
							},
							{
								title: t('spend_ranking_title'),
								children: (
									<RankedList
										title={t('spend_ranking')}
										euro
										items={mostSpentItems(filteredHistory)}
										countTintColor={colors.less}
										loading={!historyFetched}
									/>
								),
							},
							{
								title: t('transfer_ranking_title'),
								children: (
									<View>
										<RankedList
											title={t('receive_ranking')}
											euro
											noBottomBorder
											items={mostReceivedFromPersons(filteredHistory)}
											slice={5}
											countTintColor={colors.more}
											loading={!historyFetched}
										/>
										<View style={{ borderTopWidth: 1, borderTopColor: colors.background }} />
										<RankedList
											title={t('give_ranking')}
											euro
											items={mostGivenToPeople(filteredHistory)}
											slice={5}
											countTintColor={colors.transfer}
											loading={!historyFetched}
										/>
									</View>
								),
							},
						]}
					/>
				</ScrollView>
			</View>
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

export default connect(mapStateToProps)(StatsScreen);
