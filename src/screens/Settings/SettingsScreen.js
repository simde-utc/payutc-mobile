/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import { Settings as t } from '../../utils/i18n';
import SwitchBlockTemplate from '../../components/SwitchBlockTemplate';

export default class SettingsScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);
		this.state = { lock: false };
		this.onLockChange = this.onLockChange.bind(this);
	}

	onLockChange(value) {
		this.setState({ lock: value });

		if (value)
			alert("todo: Blocage du badge");
		else
			alert("todo: Déblocage du badge");
	}

	signOut() {
		alert("Déconnexion");
	}

	render() {
		const { lock } = this.state;
		const { navigation } = this.props;

		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight, padding: 15 }}>
				<BlockTemplate roundedTop roundedBottom shadow>
					<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary }}>
						{t('title')}
					</Text>
				</BlockTemplate>
				<View style={{ height: 15 }} />
				<SwitchBlockTemplate roundedTop roundedBottom value={lock} onValueChange={this.onLockChange} tintColor={colors.less}>
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.secondary }}>{t('lock')}</Text>
						<Text style={{ fontSize: 13, color: colors.secondary }}>{t('lock_info')}</Text>
					</View>
				</SwitchBlockTemplate>
				<View style={{ height: 15 }} />
				<BlockTemplate roundedTop roundedBottom onPress={() => navigation.navigate('About')}>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.secondary }}>{t('about')}</Text>
						<Ionicons name="md-arrow-forward" size={18} color={colors.secondary} />
					</View>
				</BlockTemplate>
				<View style={{ height: 15 }} />
				<BlockTemplate roundedTop roundedBottom onPress={() => navigation.navigate('Legal')}>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.secondary }}>{t('legal')}</Text>
						<Ionicons name="md-arrow-forward" size={18} color={colors.secondary} />
					</View>
				</BlockTemplate>
				<View style={{ height: 15 }} />
				<BlockTemplate roundedTop roundedBottom onPress={() => this.signOut()}>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.less }}>{t('sign_out')}</Text>
						<Ionicons name="md-arrow-forward" size={18} color={colors.less} />
					</View>
				</BlockTemplate>
			</ScrollView>
		);
	}
}
