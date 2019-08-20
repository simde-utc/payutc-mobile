/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, ScrollView, View, Text, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import TitleParams from '../../components/TitleParams';
import LinkButton from '../../components/LinkButton';
import List from '../../components/List';
import BlockTemplate from '../../components/BlockTemplate';
import SwitchBlockTemplate from '../../components/SwitchBlockTemplate';
import { beautifyDateTime } from '../../utils';
import { _, Profile as t } from '../../utils/i18n';
import { PayUTC, Config } from '../../redux/actions';

class ProfileScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
		headerTruncatedBackTitle: _('back'),
	});

	constructor(props) {
		super(props);

		this.onLockChange = this.onLockChange.bind(this);
	}

	componentDidMount() {
		this.onRefresh();
	}

	onRefresh() {
		const { detailsFetching, dispatch } = this.props;

		if (!detailsFetching) {
			dispatch(PayUTC.getWalletDetails());
		}
	}

	onLockChange(value) {
		const { dispatch, detailsFetching } = this.props;

		if (detailsFetching) {
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

	static renderDetail({ title, value }, index, roundedBottom = false) {
		return (
			<BlockTemplate
				customBackground={index % 2 === 0 ? colors.backgroundBlockAlt : colors.backgroundBlock}
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
				roundedBottom={roundedBottom}
			>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>{title}</Text>
				<Text style={{ fontSize: 12, color: colors.secondary }}>{value}</Text>
			</BlockTemplate>
		);
	}

	getUserDetails() {
		const { details, detailsFetching } = this.props;

		if (detailsFetching) {
			return [];
		}

		return [
			{ title: 'Prénom', value: details.user.first_name },
			{ title: 'Nom', value: details.user.last_name },
			{ title: 'Email', value: details.user.email },
			{ title: 'Login', value: details.user.username },
			{ title: 'Type', value: 'Admin / Cotisant BDE / CAS-UTC' },
			{ title: 'Statut', value: details.force_adult ? 'Adulte' : 'Considéré.e mineur.e' },
			{ title: 'Date de création', value: beautifyDateTime(details.created) },
		];
	}

	signOut() {
		const { navigation, dispatch } = this.props;

		dispatch(Config.wipe());

		PayUTC.forget().payload.then(() => navigation.navigate('Auth'));
	}

	render() {
		const { details, detailsFetching } = this.props;

		return (
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={detailsFetching}
						onRefresh={() => this.onRefresh()}
						colors={[colors.secondary]}
						tintColor={colors.secondary}
					/>
				}
				style={{ backgroundColor: colors.backgroundLight }}
			>
				<TitleParams
					title={
						detailsFetching ? t('title') : `${details.user.first_name} ${details.user.last_name}`
					}
					settingText="Détails"
					icon="info"
				>
					<View style={{ marginHorizontal: 15 }}>
						<List
							notRoundedTop
							loading={detailsFetching}
							renderItem={ProfileScreen.renderDetail}
							items={this.getUserDetails()}
							keyExtractor={item => item.title}
						/>
					</View>
				</TitleParams>

				<View
					style={{
						marginTop: 15,
						marginHorizontal: 50,
						borderBottomWidth: 1,
						borderBottomColor: colors.backgroundBlock,
					}}
				/>

				<SwitchBlockTemplate
					roundedTop
					roundedBottom
					shadow
					value={detailsFetching ? false : details.blocked}
					onValueChange={this.onLockChange}
					tintColor={colors.less}
					disabled={detailsFetching}
					style={{ margin: 15 }}
				>
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								color: detailsFetching ? colors.disabled : colors.secondary,
							}}
						>
							{t('lock')}
						</Text>
						<Text
							style={{
								fontSize: 13,
								color: detailsFetching ? colors.disabled : colors.secondary,
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
	const details = payutc.getWalletDetails();

	return {
		lang,
		details: details.getData({}),
		detailsFetching: details.isFetching(),
		detailsFetched: details.isFetched(),
	};
};

export default connect(mapStateToProps)(ProfileScreen);
