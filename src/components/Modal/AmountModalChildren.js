/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import colors from '../../styles/colors';
import { floatToEuro } from '../../utils/amount';

export default class AmountModalChildren extends React.PureComponent {
	render() {
		const { amount, title, subtitle, message, tintColor } = this.props;

		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					justifyContent: 'flex-start',
					backgroundColor: colors.backgroundBlock,
					borderRadius: 20,
					borderColor: colors.backgroundBlock,
					borderWidth: 2,
				}}
			>
				<View
					style={{
						padding: 15,
						borderBottomWidth: 1,
						borderBottomColor: colors.border,
					}}
				>
					<Text
						style={{
							fontSize: 18,
							fontWeight: 'bold',
							textAlign: 'center',
							color: colors.secondary,
						}}
					>
						{title}
					</Text>
					{subtitle ? (
						<Text style={{ fontSize: 14, textAlign: 'center', color: colors.secondary }}>
							{subtitle}
						</Text>
					) : null}
					{message ? (
						<Text
							selectable
							onLayout={this.onTextLayout}
							style={{
								fontSize: 16,
								textAlign: 'center',
								color: colors.secondary,
								marginTop: 10,
							}}
						>
							{message}
						</Text>
					) : null}
				</View>

				<View style={{ flex: 1, justifyContent: 'center', marginBottom: 5 }}>
					<Text
						style={{
							fontSize: 55,
							fontWeight: 'bold',
							textAlign: 'center',
							color: tintColor || colors.secondary,
						}}
					>
						{amount >= 0 ? '+ ' : ''}
						{floatToEuro(amount)}
					</Text>
				</View>
			</View>
		);
	}
}
