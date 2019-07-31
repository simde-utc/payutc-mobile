/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { _, History as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import Item from '../../components/History/Item';
import PayUTC from '../../services/PayUTC';
import BlockTemplate from '../../components/BlockTemplate';

export default class HistoryScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);
		this.state = {
			refreshing: false,
			history: null,
		};
	}

	componentDidMount() {
		this.getHistory();
	}

	onRefresh() {
		this.getHistory();
	}

	getHistory() {
		this.setState({ refreshing: true });
		PayUTC.getHistory().then(([{ historique }]) => {
			this.setState({ history: historique, refreshing: false });
		});
	}

	render() {
		const { refreshing, history } = this.state;

		return (
			<FlatList
				style={{ backgroundColor: colors.backgroundLight, padding: 15 }}
				ListHeaderComponent={() => (
					<View>
						<BlockTemplate roundedTop shadow>
							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
								<Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>
									{t('title')}
								</Text>
								<TouchableOpacity onPress={() => this.onRefresh()}>
									<Ionicons name="ios-refresh" size={20} color={colors.secondary} />
								</TouchableOpacity>
							</View>
						</BlockTemplate>
						<View style={{ borderColor: colors.backgroundLight, height: 1 }} />
					</View>
				)}
				data={history}
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
						<BlockTemplate roundedBottom>
							<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.primary }}>
								{history && history.length !== 0 ? t('good_job') : null}
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
