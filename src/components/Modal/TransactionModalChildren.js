/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { beautifyDateTime } from '../../utils/date';
import colors from '../../styles/colors';
import AmountModalChildren from './AmountModalChildren';

export default function TransactionModalChildren({
	title,
	amount,
	quantity,
	date,
	location,
	message,
	positive,
}) {
	return (
		<AmountModalChildren
			title={`${title} ${quantity && quantity > 1 ? `x${quantity}` : ''}`}
			subtitle={`${beautifyDateTime(date)} ${location ? `\n${location}` : ''}`}
			amount={positive ? amount / 100 : -amount / 100}
			tintColor={positive ? colors.more : colors.less}
			message={message}
		/>
	);
}
