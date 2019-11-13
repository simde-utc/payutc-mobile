/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors from '../../styles/colors';
import Balance from '../../components/Home/Balance';
import BlockTemplate from '../../components/BlockTemplate';
import { PayUTC } from '../../redux/actions';
import { _, Home as t } from '../../utils/i18n';
import { totalAmount } from '../../utils/stats';
import ModalTemplate from '../../components/ModalTemplate';
import HistoryList from '../../components/History/HistoryList';

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

		this.scrollView = React.createRef();

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
			<View style={{ flex: 1, backgroundColor: colors.background }}>
				{message.message ? (
					<ModalTemplate
						title={message.message.title}
						subtitle={message.message.subtitle}
						amount={message.message.amount}
						tintColor={message.message.tintColor}
						footer={
							message.message.message ? ( // Yes
								<Text
									style={{
										fontSize: 16,
										textAlign: 'center',
										fontStyle: 'italic',
										color: colors.secondary,
									}}
								>
									{message.message.message}
								</Text>
							) : null
						}
						onClose={() => this.setState({ message: {} })}
					/>
				) : null}

				<BlockTemplate shadow style={{ padding: 20 }}>
					<Balance
						amount={amount}
						isCreditConsistent={details.is_credit_consistent}
						loading={detailsFetching}
						name={details.user ? details.user.first_name : null}
						weekAmount={totalAmount(history, oneWeekAgo) / 100}
						onRefresh={() => this.onRefresh()}
						navigation={navigation}
					/>
				</BlockTemplate>

				<ScrollView
					ref={ref => (this.scrollView = ref)}
					style={{ padding: 15, borderTopWidth: 1, borderTopColor: colors.backgroundBlockAlt }}
					refreshControl={
						<RefreshControl
							refreshing={historyFetching}
							onRefresh={() => this.onRefresh()}
							colors={[colors.secondary]}
							tintColor={colors.secondary}
						/>
					}
				>
					<HistoryList items={history} slice={15} loading={historyFetching} />

					<BlockTemplate
						roundedTop
						roundedBottom
						onPress={() => navigation.navigate('History')}
						style={{
							marginTop: 10,
							marginBottom: 30,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Text
							style={{
								fontSize: 14,
								fontWeight: 'bold',
								color: colors.primary,
							}}
						>
							{t('all_history')}
						</Text>
						<FontAwesomeIcon icon={['fas', 'list']} size={16} color={colors.primary} />
					</BlockTemplate>
				</ScrollView>

				<BlockTemplate
					shadow
					style={{ paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between' }}
				>
					<View style={{ flexDirection: 'row' }}>
						<BlockTemplate
							roundedTop
							roundedBottom
							shadow
							borderForAndroid
							onPress={() => navigation.navigate('Refill')}
							style={{ flexDirection: 'row', alignItems: 'center' }}
						>
							<FontAwesomeIcon icon={['fas', 'plus-circle']} size={15} color={colors.more} />
							<Text
								style={{
									paddingLeft: 5,
									fontSize: 13,
									fontWeight: 'bold',
									color: colors.more,
								}}
							>
								{t('refill')}
							</Text>
						</BlockTemplate>

						<View style={{ width: 10 }} />

						<BlockTemplate
							roundedTop
							roundedBottom
							shadow
							borderForAndroid
							onPress={() => navigation.navigate('Transfer')}
							style={{ flexDirection: 'row', alignItems: 'center' }}
						>
							<FontAwesomeIcon icon={['fas', 'share']} size={15} color={colors.transfer} />
							<Text
								style={{
									paddingLeft: 5,
									fontSize: 13,
									fontWeight: 'bold',
									color: colors.transfer,
								}}
							>
								{t('transfer')}
							</Text>
						</BlockTemplate>
					</View>

					<BlockTemplate
						roundedTop
						roundedBottom
						shadow
						borderForAndroid
						onPress={() => navigation.navigate('Settings')}
						style={{ flexDirection: 'row', alignItems: 'center' }}
					>
						<FontAwesomeIcon icon={['fas', 'cogs']} size={15} color={colors.secondary} />
					</BlockTemplate>
				</BlockTemplate>
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
