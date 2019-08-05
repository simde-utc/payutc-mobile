/**
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

const shortcuts = [
	{
		screen: 'Refill',
		lazyTitle: 'refill',
		icon: 'ios-add-circle-outline',
		color: colors.more,
	},
	{
		screen: 'Transfer',
		lazyTitle: 'transfer',
		icon: 'ios-share-alt',
		color: colors.lightBlue,
	},
];

export default class Shortcuts extends React.PureComponent {
	render() {
		const { amount, navigation } = this.props;

		return (
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				{shortcuts.map(({ screen, lazyTitle, icon, color }) => (
					<BlockTemplate
						roundedTop
						roundedBottom
						shadow
						key={lazyTitle}
						style={{ width: `${90 / shortcuts.length}%`, alignItems: 'center' }}
						onPress={() => navigation.navigate(screen, { credit: amount })}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
							<Ionicons name={icon} size={17} style={{ color }} />
							<Text
								style={{
									paddingLeft: 5,
									fontSize: 15,
									fontWeight: 'bold',
									color,
								}}
							>
								{t(lazyTitle)}
							</Text>
						</View>
					</BlockTemplate>
				))}
			</View>
		);
	}
}
