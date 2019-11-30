/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import BiometricAuth from '../../services/BiometricAuth';
import colors from '../../styles/colors';
import { Config, PayUTC } from '../../redux/actions';
import BlockTemplate from '../../components/BlockTemplate';
import { _, BiometricAuth as t } from '../../utils/i18n';

class BiometricAuthScreen extends React.PureComponent {
	constructor(props) {
		super(props);
		this.biometricAuth = React.createRef();
	}

	componentDidMount() {
		this.next();
	}

	next() {
		const { navigation } = this.props;

		const success = () => {
			navigation.navigate('Main');
		};

		this.biometricAuth.authenticate(success);
	}

	signOut() {
		const { navigation, dispatch } = this.props;

		Alert.alert(
			t('disable'),
			t('disable_desc'),
			[
				{ text: _('cancel'), onPress: () => {} },
				{
					text: _('continue'),
					onPress: () => {
						PayUTC.forget().payload.then(() => {
							navigation.navigate('Auth');

							dispatch(Config.wipe());
						});
					},
					style: 'destructive',
				},
			],
			{ cancelable: false }
		);
	}

	render() {
		const { restrictions, dispatch, navigation } = this.props;

		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					backgroundColor: colors.background,
					paddingHorizontal: 30,
				}}
			>
				<FontAwesomeIcon
					icon={['fa', 'lock']}
					size={75}
					style={{ color: colors.primary, marginBottom: 45, alignSelf: 'center' }}
				/>

				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					onPress={() => this.next()}
					style={{ paddingVertical: 15 }}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
						<FontAwesomeIcon
							icon={['fa', 'fingerprint']}
							size={25}
							style={{ color: colors.secondary }}
						/>
						<Text
							style={{
								marginLeft: 15,
								fontSize: 15,
								fontWeight: 'bold',
								color: colors.secondary,
							}}
						>
							{t('retry')}
						</Text>
					</View>
				</BlockTemplate>

				<View style={{ height: 15 }} />

				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					onPress={() => this.signOut()}
					style={{ paddingVertical: 15 }}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
						<FontAwesomeIcon icon={['fa', 'times']} size={25} style={{ color: colors.secondary }} />

						<View style={{ flexDirection: 'column', paddingLeft: 15 }}>
							<Text
								style={{
									fontSize: 15,
									fontWeight: 'bold',
									color: colors.secondary,
								}}
							>
								{t('disable')}
							</Text>
							<Text
								style={{
									fontSize: 13,
									color: colors.secondary,
								}}
							>
								{t('disable_desc')}
							</Text>
						</View>
					</View>
				</BlockTemplate>

				<BiometricAuth
					ref={ref => (this.biometricAuth = ref)}
					action="APP_OPENING"
					restrictions={restrictions}
					dispatch={dispatch}
					navigation={navigation}
				/>
			</View>
		);
	}
}

const mapStateToProps = ({ config: { restrictions } }) => ({ restrictions });

export default connect(mapStateToProps)(BiometricAuthScreen);
