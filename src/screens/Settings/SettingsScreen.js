/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import { _, Settings as t } from '../../utils/i18n';
import SwitchBlockTemplate from '../../components/SwitchBlockTemplate';
import { Config, PayUTC } from '../../redux/actions';
import PayUTCApi from '../../services/PayUTC';

class SettingsScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);

		this.state = { expectedStatus: false };

		this.onLockChange = this.onLockChange.bind(this);
	}

	componentDidMount() {
		this.onRefresh();
	}

	onRefresh() {
		const { lockStatusFetching, lockStatus, dispatch } = this.props;

		if (!lockStatusFetching) {
			dispatch(PayUTC.getLockStatus());
			this.setState({ expectedStatus: !lockStatus });
		}
	}

	onLockChange(value) {
		const { dispatch, lockStatusFetching } = this.props;

		if (lockStatusFetching) {
			return;
		}

		dispatch(
			Config.spinner({
				visible: true,
				textContent: value ? t('locking') : t('unlocking'),
			})
		);

		PayUTCApi.setLockStatus(value).then(([status]) => {
			dispatch(
				Config.spinner({
					visible: false,
				})
			);

			if (status !== true && status !== false) {
				Alert.alert(
					_('error'),
					value ? t('lock_error') : t('unlock_error'),
					[{ text: _('ok') }],
					{}
				);
				return;
			}
			this.onRefresh();
		});
	}

	signOut() {
		PayUTC.forget();
		const { navigation } = this.props;
		navigation.navigate('Auth');
	}

	render() {
		const { lockStatus, lockStatusFetching, navigation } = this.props;
		const { expectedStatus } = this.state;

		return (
			<ScrollView
				style={{ backgroundColor: colors.backgroundLight, padding: 15 }}
				refreshControl={
					<RefreshControl
						refreshing={lockStatusFetching}
						onRefresh={() => this.onRefresh()}
						colors={[colors.secondary]}
						tintColor={colors.secondary}
					/>
				}
			>
				<BlockTemplate roundedTop roundedBottom shadow>
					<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary }}>
						{t('title')}
					</Text>
				</BlockTemplate>
				<View style={{ height: 15 }} />
				<SwitchBlockTemplate
					roundedTop
					roundedBottom
					value={lockStatusFetching ? expectedStatus : lockStatus}
					onValueChange={this.onLockChange}
					tintColor={colors.less}
					disabled={lockStatusFetching}
				>
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								color: lockStatusFetching ? colors.disabled : colors.secondary,
							}}
						>
							{t('lock')}
						</Text>
						<Text
							style={{
								fontSize: 13,
								color: lockStatusFetching ? colors.disabled : colors.secondary,
							}}
						>
							{t('lock_info')}
						</Text>
					</View>
				</SwitchBlockTemplate>
				<View style={{ height: 15 }} />
				<BlockTemplate roundedTop roundedBottom onPress={() => navigation.navigate('About')}>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.secondary }}>
							{t('about')}
						</Text>
						<Ionicons name="md-arrow-forward" size={18} color={colors.secondary} />
					</View>
				</BlockTemplate>
				<View style={{ height: 15 }} />
				<BlockTemplate roundedTop roundedBottom onPress={() => navigation.navigate('Legal')}>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.secondary }}>
							{t('legal')}
						</Text>
						<Ionicons name="md-arrow-forward" size={18} color={colors.secondary} />
					</View>
				</BlockTemplate>
				<View style={{ height: 15 }} />
				<BlockTemplate roundedTop roundedBottom onPress={() => this.signOut()}>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.less }}>
							{t('sign_out')}
						</Text>
						<Ionicons name="md-arrow-forward" size={18} color={colors.less} />
					</View>
				</BlockTemplate>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ payutc }) => {
	const lockStatus = payutc.getLockStatus();

	return {
		lockStatus: lockStatus.getData(),
		lockStatusFetching: lockStatus.isFetching(),
		lockStatusFetched: lockStatus.isFetched(),
	};
};

export default connect(mapStateToProps)(SettingsScreen);
