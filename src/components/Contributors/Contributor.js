/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, Text, Image, Linking } from 'react-native';
import LinkButton from '../LinkButton';
import colors from '../../styles/colors';

export default function Contributor({
	name,
	description,
	picture,
	url,
	backgroundColor,
	roundedBottom,
}) {
	return (
		<LinkButton
			backgroundColor={backgroundColor}
			onPress={() => Linking.openURL(url)}
			notRoundedTop
			notRoundedBottom={!roundedBottom}
		>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
				}}
			>
				<Image style={{ height: 50, width: 50 }} source={{ uri: picture }} />
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						paddingLeft: 10,
					}}
				>
					<View>
						<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.secondary }}>
							{name}
						</Text>
						<Text style={{ fontSize: 12, color: colors.secondary }}>{description}</Text>
					</View>
				</View>
			</View>
		</LinkButton>
	);
}
