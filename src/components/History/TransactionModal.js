/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text } from 'react-native';
import colors from '../../styles/colors';
import { beautifyDateTime } from '../../utils/date';
import ModalTemplate from '../ModalTemplate';

export default function TransactionModal({
	title,
	amount,
	quantity,
	date,
	location,
	message,
	positive,
	onClose,
}) {
	return (
		<ModalTemplate
			title={`${title} ${quantity && quantity > 1 ? `x${quantity}` : ''}`}
			subtitle={`${beautifyDateTime(date)} ${location ? `\n${location}` : ''}`}
			amount={positive ? amount / 100 : -amount / 100}
			tintColor={positive ? colors.more : colors.less}
			height={message ? 220 : 180}
			footer={
				message ? (
					<Text
						style={{
							fontSize: 16,
							textAlign: 'center',
							fontStyle: 'italic',
							color: colors.secondary,
						}}
					>
						{message}
					</Text>
				) : null
			}
			onClose={onClose}
		/>
	);
}
