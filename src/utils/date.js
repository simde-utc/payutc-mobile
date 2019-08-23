/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { Words as t } from './i18n';
import { forceTextLength } from './index';

export const beautifyDateTime = dateText => {
	const date = new Date(dateText);

	return (
		`${forceTextLength(date.getUTCDate())}/${forceTextLength(
			date.getUTCMonth() + 1
		)}/${forceTextLength(date.getUTCFullYear())}` +
		` ${t('at')} ` +
		`${forceTextLength(date.getUTCHours())}h${forceTextLength(
			date.getUTCMinutes()
		)}m${forceTextLength(date.getUTCSeconds())}`
	);
};

export const beautifyDate = dateText => {
	const date = new Date(dateText);

	return `${forceTextLength(date.getUTCDate())}/${forceTextLength(
		date.getUTCMonth() + 1
	)}/${forceTextLength(date.getUTCFullYear())}`;
};

export const getDateFromPortail = portailDate =>
	new Date(portailDate ? portailDate.replace(' ', 'T') : null);

export default {
	beautifyDate: beautifyDateTime,
	getDateFromPortail,
};
