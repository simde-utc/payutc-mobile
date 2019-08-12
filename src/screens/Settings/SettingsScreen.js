/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, Linking, RefreshControl, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import TabsBlockTemplate from '../../components/TabsBlockTemplate';
import LinkButton from '../../components/LinkButton';
import { _, Global as g, Settings as t } from '../../utils/i18n';
import SwitchBlockTemplate from '../../components/SwitchBlockTemplate';
import { Config, PayUTC } from '../../redux/actions';
import { PAYUTC_EMAIL } from '../../../config';
import BlockTemplate from '../../components/BlockTemplate';

class SettingsScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	});

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
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={lockStatusFetching}
						onRefresh={() => this.onRefresh()}
						colors={[colors.secondary]}
						tintColor={colors.secondary}
					/>
				}
				style={{ backgroundColor: colors.backgroundLight }}
			>
				<BlockTemplate roundedTop roundedBottom shadow style={{ margin: 15 }}>
					<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary }}>
						{t('title')}
					</Text>
				</BlockTemplate>

				<TabsBlockTemplate
					roundedTop
					roundedBottom
					shadow
					text={t('lang')}
					tintColor={colors.secondary}
					value={lang}
					onChange={this.setLang}
					tabs={g('langs')}
					justifyContent="flex-start"
					style={{ margin: 15, marginTop: 0 }}
				/>

				<LinkButton
					text={t('about')}
					onPress={() => navigation.navigate('About')}
					style={{ margin: 15, marginTop: 0 }}
				/>

				<LinkButton
					text={t('contact_us')}
					onPress={() =>
						Linking.openURL(`mailto:${PAYUTC_EMAIL}?subject=[App] &body=${t('mail_body')}`)
					}
					style={{ margin: 15, marginTop: 0 }}
				/>

				<View
					style={{
						marginHorizontal: 50,
						borderBottomWidth: 1,
						borderBottomColor: colors.backgroundBlock,
					}}
				/>

				<SwitchBlockTemplate
					roundedTop
					roundedBottom
					shadow
					value={lockStatusFetching ? false : lockStatus}
					onValueChange={this.onLockChange}
					tintColor={colors.less}
					disabled={lockStatusFetching}
					style={{ margin: 15 }}
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

				<LinkButton
					text={t('sign_out')}
					color={colors.less}
					onPress={() => this.signOut()}
					style={{ margin: 15, marginTop: 0 }}
				/>
			</ScrollView>
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
