/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Platform, RefreshControl, Text, View } from 'react-native';
import { connect } from 'react-redux';
import List from '../../components/List';
import colors from '../../styles/colors';
import Balance from '../../components/Home/Balance';
import Shortcuts from '../../components/Home/Shortcuts';
import BlockTemplate from '../../components/BlockTemplate';
import Item from '../../components/History/Item';
import { PayUTC } from '../../redux/actions';
import { _, Home as t } from '../../utils/i18n';
import { totalAmount } from '../../utils/stats';

class HomeScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
		headerTruncatedBackTitle: _('back'),
	});

	constructor(props) {
		super(props);

		this.state = { message: {} };

		this.onRefresh = this.onRefresh.bind(this);
		this.handleNavigationOnFocus = this.handleNavigationOnFocus.bind(this);
	}

	componentDidMount() {
		const { navigation } = this.props;

		this.subscriptions = [navigation.addListener('willFocus', this.handleNavigationOnFocus)];

		this.onRefresh();
	}

	componentWillUnmount() {
		this.subscriptions.forEach(subscription => subscription.remove());
	}

	onRefresh() {
		const { detailsFetching, historyFetching, dispatch } = this.props;

		if (!detailsFetching) {
			dispatch(PayUTC.getWalletDetails());
		}

		if (!historyFetching) {
			dispatch(PayUTC.getHistory());
		}
	}

	handleNavigationOnFocus({ action: { params } }) {
		const { detailsFetched, historyFetched } = this.props;

		if (!detailsFetched || !historyFetched) {
			this.onRefresh();
		}

		this.setState({
			message: params || {},
		});
	}

	render() {
		const { details, detailsFetching, history, historyFetching, navigation } = this.props;
		const { message } = this.state;
		const amount = details.credit ? details.credit / 100 : null;

		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					padding: 15,
					backgroundColor: colors.backgroundLight,
				}}
			>
				{message.message ? (
					<BlockTemplate
						roundedTop
						roundedBottom
						shadow
						style={{ marginBottom: 15, backgroundColor: message.backgroundColor || colors.more }}
						onPress={() => {
							if (message.onPress) {
								message.onPress();
							}

							this.setState({ message: {} });
						}}
					>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								color: message.color || colors.backgroundBlock,
							}}
						>
							{message.message}
						</Text>
					</BlockTemplate>
				) : null}

				<BlockTemplate roundedTop roundedBottom shadow style={{ marginBottom: 15 }}>
					<Balance
						amount={amount}
						isCreditConsistent={details.is_credit_consistent}
						loading={detailsFetching}
						name={details.name}
						weekAmount={totalAmount(history, oneWeekAgo) / 100}
						onRefresh={() => this.onRefresh()}
					/>
				</BlockTemplate>

				<Shortcuts amount={amount} navigation={navigation} />

				<BlockTemplate
					roundedTop
					shadow
					style={{
						marginTop: 15,
						borderBottomWidth: 1,
						borderBottomColor: colors.backgroundBlockAlt,
					}}
				>
					<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>
						{t('recent_activity')}
					</Text>
				</BlockTemplate>

				<List
					items={history.slice(0, 10)}
					loading={historyFetching}
					notRoundedTop
					renderItem={(item, index) => (
						<Item
							transaction={item}
							customBackground={index % 2 === 0 ? colors.backgroundBlockAlt : null}
						/>
					)}
					keyExtractor={item => item.id.toString()}
					refreshControl={
						<RefreshControl
							refreshing={historyFetching}
							onRefresh={() => this.onRefresh()}
							colors={[colors.secondary]}
							tintColor={colors.secondary}
						/>
					}
				/>
				{Platform.OS === 'android' ? (
					<BlockTemplate roundedBottom style={{ paddingVertical: 5 }} />
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
