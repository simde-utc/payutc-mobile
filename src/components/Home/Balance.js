/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import BlockTemplate from '../BlockTemplate';
import { Home as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import { floatToEuro } from '../../utils';

const shortcuts = [
	{
		screen: 'Refill',
		lazyTitle: 'refill',
		icon: 'ios-add-circle-outline',
	},
	{
		screen: 'Transfer',
		lazyTitle: 'transfer',
		icon: 'ios-share-alt',
	},
];

export default class Balance extends React.PureComponent {
	render() {
		const { amount, navigation } = this.props;

		return (
			<BlockTemplate roundedTop roundedBottom shadow>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
					{t('your_balance')}
				</Text>
				{amount ? (
					<Text style={{ fontSize: 70, fontWeight: 'bold', color: colors.primary, lineHeight: 75 }}>
						{floatToEuro(amount)}
					</Text>
				) : (
					<Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary }}>
						{t('no_balance')}
					</Text>
				)}
				<View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 5 }}>
					{shortcuts.map(({ screen, lazyTitle, icon }) => (
						<BlockTemplate
							roundedTop
							roundedBottom
							shadow
							key={lazyTitle}
							onPress={() => navigation.navigate(screen, { credit: amount })}
						>
							<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
								<Ionicons name={icon} size={20} style={{ color: colors.secondary }} />
								<Text
									style={{
										paddingLeft: 5,
										fontSize: 16,
										fontWeight: 'bold',
										color: colors.secondary,
									}}
								>
									{t(lazyTitle)}
								</Text>
							</View>
						</BlockTemplate>
					))}
				</View>
			</BlockTemplate>
		);
	}
}
