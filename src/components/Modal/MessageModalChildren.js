/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import colors from '../../styles/colors';

export default function MessageModalChildren({ title, subtitle, message, children }) {
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
			<View style={{ padding: 15 }}>
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

				{children}
			</View>
		</View>
	);
}
