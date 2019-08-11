/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import TitleParams from '../../components/TitleParams';
import TabsBlockTemplate from '../../components/TabsBlockTemplate';
import BlockTemplate from '../../components/BlockTemplate';
import { _, Settings as t, Global as g } from '../../utils/i18n';
import SwitchBlockTemplate from '../../components/SwitchBlockTemplate';
import { Config, PayUTC } from '../../redux/actions';

class SettingsScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);

		this.onLockChange = this.onLockChange.bind(this);
		this.setLang = this.setLang.bind(this);
	}

	componentDidMount() {
		this.onRefresh();
	}

	onRefresh() {
		const { lockStatusFetching, dispatch } = this.props;

		if (!lockStatusFetching) {
			dispatch(PayUTC.getLockStatus());
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

		PayUTC.setLockStatus(value).payload.then(([status]) => {
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

	setLang(lang) {
		const { dispatch } = this.props;

		dispatch(Config.setLang(lang));
	}

	signOut() {
		const { navigation } = this.props;

		PayUTC.forget().payload.then(() => navigation.navigate('Auth'));
	}

	render() {
		const { lockStatus, lockStatusFetching, lang, navigation } = this.props;

		return (
			<View style={{ flex: 1, backgroundColor: colors.backgroundLight, paddingHorizontal: 15 }}>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={lockStatusFetching}
							onRefresh={() => this.onRefresh()}
							colors={[colors.secondary]}
							tintColor={colors.secondary}
						/>
					}
				>
					<View style={{ height: 15 }} />
					<TitleParams title={t('title')} settingText={g(`langs.${lang}`)} style={{ margin: 0 }}>
						<TabsBlockTemplate
							roundedBottom
							text={t('lang')}
							tintColor={colors.secondary}
							default={lang}
							onChange={this.setLang}
							style={{ borderTopWidth: 0 }}
							tabs={g('langs')}
						/>
					</TitleParams>
					<View style={{ height: 15 }} />
					<SwitchBlockTemplate
						roundedTop
						roundedBottom
						value={lockStatusFetching ? false : lockStatus}
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
							<FontAwesomeIcon icon={['fas', 'angle-right']} size={16} color={colors.secondary} />
						</View>
					</BlockTemplate>
					<View style={{ height: 15 }} />
					<BlockTemplate roundedTop roundedBottom onPress={() => navigation.navigate('Legal')}>
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.secondary }}>
								{t('legal')}
							</Text>
							<FontAwesomeIcon icon={['fas', 'angle-right']} size={16} color={colors.secondary} />
						</View>
					</BlockTemplate>
					<View style={{ height: 15 }} />
					<BlockTemplate roundedTop roundedBottom onPress={() => this.signOut()}>
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.less }}>
								{t('sign_out')}
							</Text>
							<FontAwesomeIcon icon={['fas', 'angle-right']} size={16} color={colors.less} />
						</View>
					</BlockTemplate>
				</ScrollView>
			</View>
		);
	}
}

const mapStateToProps = ({ payutc, config: { lang } }) => {
	const lockStatus = payutc.getLockStatus();

	return {
		lang,
		lockStatus: lockStatus.getData(false),
		lockStatusFetching: lockStatus.isFetching(),
		lockStatusFetched: lockStatus.isFetched(),
	};
};

export default connect(mapStateToProps)(SettingsScreen);
