/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';
import { Home as t } from '../../utils/i18n';

export default class Hi extends React.PureComponent {
	render() {
		const { name, onRefresh } = this.props;
		return (
			<BlockTemplate roundedTop roundedBottom shadow>
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.secondary }}>
						{name ? `${t('hi')}, ${name} !` : `${t('hi')} !`}
					</Text>
					<TouchableOpacity onPress={() => onRefresh()}>
						<Ionicons name="ios-refresh" size={22} color={colors.secondary} />
					</TouchableOpacity>
				</View>
			</BlockTemplate>
		);
	}
}
