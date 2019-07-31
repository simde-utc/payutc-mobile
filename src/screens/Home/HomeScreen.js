/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../styles/colors';
import Hi from '../../components/Home/Hi';
import Balance from '../../components/Home/Balance';
import BlockTemplate from '../../components/BlockTemplate';
import { _, Home as t } from '../../utils/i18n';
import Item from '../../components/History/Item';
import PayUTC from '../../services/PayUTC';

export default class HomeScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);
		this.state = {
			refreshing: false,
			wallet: null,
			history: null,
		};
		this.onRefresh = this.onRefresh.bind(this);
	}

	componentDidMount() {
		this.getWalletDetails();
		this.getHistory();
	}

	onRefresh() {
		this.getWalletDetails();
		this.getHistory();
	}

	getWalletDetails() {
		this.setState({ refreshing: true });

		PayUTC.getWalletDetails().then(([wallet]) => {
			if (wallet && wallet.error != null) {
				Alert.alert(_('error'), t('cannot_fetch_wallet'), [{ text: _('ok') }], {
					cancelable: true,
				});
			} else {
				this.setState({ wallet, refreshing: false });
			}
		});
	}

	getHistory() {
		PayUTC.getHistory().then(([{ historique }]) => {
			this.setState({ history: historique });
		});
	}

	render() {
		const { refreshing, wallet, history } = this.state;
		const { navigation } = this.props;
		return (
			<FlatList
				ListHeaderComponent={
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<View style={{ paddingBottom: 15 }}>
							<Hi
								name={wallet && wallet.first_name ? wallet.first_name : null}
								onRefresh={this.onRefresh}
							/>
						</View>
						<View style={{ paddingBottom: 15 }}>
							<Balance amount={wallet && wallet.credit ? wallet.credit / 100 : null} />
						</View>
						<View style={{ flex: 1, flexDirection: 'row', paddingBottom: 15 }}>
							<View style={{ flex: 1 }}>
								<BlockTemplate
									roundedTop
									roundedBottom
									shadow
									onPress={() => navigation.push('Refill', { credit: wallet.credit / 100 })}
								>
									<View style={{ flex: 1, alignItems: 'center' }}>
										<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>
											{t('refill')}
										</Text>
										<Ionicons
											name="ios-add-circle-outline"
											size={25}
											color={colors.primary}
											style={{ marginTop: 5 }}
										/>
									</View>
								</BlockTemplate>
							</View>
							<View style={{ width: 15 }} />
							<View style={{ flex: 1 }}>
								<BlockTemplate
									roundedTop
									roundedBottom
									shadow
									onPress={() => navigation.push('Transfer', { credit: wallet.credit / 100 })}
								>
									<View style={{ flex: 1, alignItems: 'center' }}>
										<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>
											{t('transfer')}
										</Text>
										<Ionicons
											name="ios-share-alt"
											size={25}
											color={colors.primary}
											style={{ marginTop: 5 }}
										/>
									</View>
								</BlockTemplate>
							</View>
						</View>
						<BlockTemplate roundedTop shadow>
							<Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>
								{t('recent_activity')}
							</Text>
						</BlockTemplate>
						<View style={{ borderColor: colors.backgroundLight, height: 1 }} />
					</View>
				}
				style={{ backgroundColor: colors.backgroundLight, padding: 15 }}
				data={history ? history.slice(0, 10) : null}
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
				ListFooterComponent={
					<View style={{ marginBottom: 30 }}>
						<View style={{ borderColor: colors.backgroundLight, height: 1 }} />
						<BlockTemplate roundedBottom onPress={() => navigation.navigate('History')}>
							<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.primary }}>
								{t('all_history')}
							</Text>
						</BlockTemplate>
					</View>
				}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={() => this.onRefresh()}
						colors={[colors.secondary]}
						tintColor={colors.secondary}
					/>
				}
			/>
		);
	}
}
