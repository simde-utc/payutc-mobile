/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Modal, Text, View } from 'react-native';
import colors from '../styles/colors';
import { floatToEuro } from '../utils/amount';
import BlockTemplate from './BlockTemplate';
import { _ } from '../utils/i18n';

export default function ModalTemplate(props) {
	const { visible, title, subtitle, amount, tintColor, onClose } = props;

	return (
		<Modal animationType="slide" transparent visible={visible}>
			<View style={{ flex: 4 }} />
			<BlockTemplate
				shadow
				style={{
					flex: 2,
					backgroundColor: colors.backgroundBlock,
					borderTopWidth: 1,
					borderTopColor: colors.border,
					justifyContent: 'space-around',
					alignItems: 'center',
				}}
			>
				<View style={{ alignItems: 'center' }}>
					<Text
						style={{
							fontSize: 18,
							fontWeight: 'bold',
							textAlign: 'center',
							color: tintColor || colors.secondary,
						}}
					>
						{title}
					</Text>
					<Text
						style={{
							fontSize: 18,
							textAlign: 'center',
							color: tintColor || colors.secondary,
						}}
					>
						{subtitle}
					</Text>
				</View>

				{amount ? (
					<Text
						style={{
							fontSize: 55,
							fontWeight: 'bold',
							color: tintColor || colors.secondary,
						}}
					>
						{`${amount >= 0 ? '+ ' : ''}${floatToEuro(amount)}`}
					</Text>
				) : null}

				<BlockTemplate
					roundedTop
					roundedBottom
					borderForAndroid
					shadow
					onPress={onClose}
					style={{ alignSelf: 'center' }}
				>
					<Text
						style={{
							marginHorizontal: 10,
							fontSize: 15,
							fontWeight: 'bold',
							color: tintColor || colors.secondary,
						}}
					>
						{_('ok')}
					</Text>
				</BlockTemplate>
			</BlockTemplate>
		</Modal>
	);
}
