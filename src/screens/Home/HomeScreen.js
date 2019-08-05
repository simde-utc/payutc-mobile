/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { FlatList, RefreshControl, Text, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import Hi from '../../components/Home/Hi';
import Balance from '../../components/Home/Balance';
import BlockTemplate from '../../components/BlockTemplate';
import Item from '../../components/History/Item';
import { PayUTC } from '../../redux/actions';
import { _, Home as t } from '../../utils/i18n';

class HomeScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);

		this.onRefresh = this.onRefresh.bind(this);
	}

	componentDidMount() {
		this.onRefresh();
	}

	onRefresh() {
		const {
			detailsFetching,
			detailsFetched,
			historyFetching,
			historyFetched,
			dispatch,
		} = this.props;

		if (!detailsFetching && !detailsFetched) {
			dispatch(PayUTC.getWalletDetails());
		}

		if (!historyFetching && !historyFetched) {
			dispatch(PayUTC.getHistory());
		}
	}

	render() {
		const { details, detailsFetching, history, historyFetching, navigation } = this.props;

		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					padding: 15,
					backgroundColor: colors.backgroundLight,
				}}
			>
				<View>
					<View style={{ paddingBottom: 15 }}>
						<Hi name={details.first_name} onRefresh={this.onRefresh} />
					</View>
					<ScrollView
						style={{ paddingBottom: 15 }}
						refreshControl={
							<RefreshControl
								refreshing={detailsFetching}
								onRefresh={() => this.onRefresh()}
								colors={[colors.secondary]}
								tintColor={colors.secondary}
							/>
						}
					>
						<Balance
							amount={details.credit ? details.credit / 100 : null}
							navigation={navigation}
						/>
					</ScrollView>
					<View>
						<BlockTemplate roundedTop shadow>
							<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>
								{t('recent_activity')}
							</Text>
						</BlockTemplate>
						<View style={{ borderColor: colors.backgroundLight, height: 1 }} />
					</View>
				</View>
				<FlatList
					data={history.slice(0, 10)}
					keyExtractor={item => item.id.toString()}
					renderItem={({ item, index }) => (
						<Item
							transaction={item}
							customBackground={index % 2 === 0 ? colors.backgroundBlockAlt : null}
						/>
					)}
					ListEmptyComponent={() => (
						<BlockTemplate>
							<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.disabled }}>
								{_('loading_text_replacement')}
							</Text>
						</BlockTemplate>
					)}
					ItemSeparatorComponent={() => (
						<View style={{ borderColor: colors.backgroundLight, height: 1 }} />
					)}
					refreshControl={
						<RefreshControl
							refreshing={historyFetching}
							onRefresh={() => this.onRefresh()}
							colors={[colors.secondary]}
							tintColor={colors.secondary}
						/>
					}
				/>
				{history.length ? (
					<View>
						<View style={{ borderColor: colors.backgroundLight, height: 1 }} />
						<BlockTemplate roundedBottom onPress={() => navigation.navigate('History')}>
							<Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.primary }}>
								{t('all_history')}
							</Text>
						</BlockTemplate>
					</View>
				) : null}
			</View>
		);
	}
}

const mapStateToProps = ({ payutc }) => {
	const details = payutc.getWalletDetails();
	const history = payutc.getHistory();

	return {
		details: details.getData({}),
		detailsFetching: details.isFetching(),
		detailsFetched: details.isFetched(),
		history: history.getData({ historique: [] }).historique,
		historyFetching: history.isFetching(),
		historyFetched: history.isFetched(),
	};
};

export default connect(mapStateToProps)(HomeScreen);
