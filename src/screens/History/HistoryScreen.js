/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { RefreshControl, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import HistoryList from '../../components/History/HistoryList';
import { Config, PayUTC, Portail } from '../../redux/actions';
import TabsBlockTemplate from '../../components/TabsBlockTemplate';
import { History as t } from '../../utils/i18n';
import { getDateFromPortail } from '../../utils/date';

class HistoryScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: t('title'),
			headerStyle: {
				borderBottomWidth: 1,
				borderBottomColor: colors.background,
				backgroundColor: colors.backgroundBlock,
			},
			headerTintColor: colors.primary,
			headerForceInset: { top: 'never' },
			headerRight: (
				<TouchableOpacity
					style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}
					onPress={() => {
						navigation.setParams({ areFiltersVisible: !navigation.getParam('areFiltersVisible') });
					}}
				>
					<FontAwesomeIcon icon={['fas', 'sliders-h']} size={18} color={colors.primary} />
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

	static getCategoryFilter(id) {
		switch (id.toString()) {
			case '1':
				return 'PURCHASE';
			case '2':
				return 'RECHARGE';
			case '3':
				return 'VIR';
			default:
				return null;
		}
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
		const { historyFetching, preferences, navigation } = this.props;
		const { dates, search } = this.state;
		const areFiltersVisible = navigation.getParam('areFiltersVisible');

		return (
			<View style={{ flex: 1, backgroundColor: colors.background }}>
				{areFiltersVisible ? (
					<BlockTemplate shadow style={{ padding: 5 }}>
						<TabsBlockTemplate
							roundedTop
							roundedBottom
							tintColor={colors.secondary}
							value={preferences.selectedDate}
							onChange={this.onSelectedDateChange}
							tabs={dates}
						/>
						<TabsBlockTemplate
							roundedTop
							roundedBottom
							value={preferences.selectedHistoryCategory}
							onChange={this.onSelectedCategoryChange}
							tintColor={colors.secondary}
							tabs={[
								{
									title: t('all'),
								},
								{
									title: t('purchased'),
								},
								{
									title: t('refills'),
								},
								{
									title: t('transfers'),
								},
							]}
						/>
					</BlockTemplate>
				) : null}

				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={historyFetching}
							onRefresh={() => this.onRefresh()}
							colors={[colors.secondary]}
							tintColor={colors.secondary}
						/>
					}
				>
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
								clearButtonMode="always"
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

					<View style={{ margin: 15 }}>
						<HistoryList
							loading={historyFetching}
							slice={50}
							items={this.getHistory(
								HistoryScreen.getCategoryFilter(preferences.selectedHistoryCategory)
							)}
						/>
					</View>
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

export default connect(mapStateToProps)(HistoryScreen);
