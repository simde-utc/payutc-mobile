/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { floatToEuro } from './index';

export const numberOfTransactions = history => {
	return history.length;
};

export const firstTransaction = history => {
	return history[history.length - 1].date;
};

const total = (history, type, since) => {
	return floatToEuro(
		history
			.filter(
				transaction => transaction.type === type && new Date(transaction.date) > new Date(since)
			)
			.map(transaction => transaction.amount)
			.reduce((acc, cur) => acc + cur, 0) / 100
	);
};

export const purchasesTotal = history => {
	return total(history, 'PURCHASE', firstTransaction(history));
};

export const purchasesCount = history => {
	return history
		.filter(transaction => transaction.type === 'PURCHASE')
		.map(transaction => transaction.quantity)
		.reduce((acc, cur) => acc + cur, 0);
};

export const lastMonthPurchasesTotal = history => {
	const date = new Date();
	date.setMonth(date.getMonth() - 1);
	return total(history, 'PURCHASE', date);
};

export const lastMonthTransferTotal = history => {
	const date = new Date();
	date.setMonth(date.getMonth() - 1);
	return total(history, 'VIROUT', date);
};

export const lastMonthReceivedTotal = history => {
	const date = new Date();
	date.setMonth(date.getMonth() - 1);
	return total(history, 'VIRIN', date);
};

export const mostPurchasedItems = history => {
	const counts = {};
	const sortableCounts = [];

	history
		.filter(transaction => transaction.type === 'PURCHASE')
		.map(transaction => {
			return { name: transaction.name, count: transaction.quantity };
		})
		.forEach(key => {
			if (!counts[key.name]) counts[key.name] = 0;
			counts[key.name] += key.count;
		});

	let item;
	for (item in counts) sortableCounts.push([item, counts[item]]);

	return sortableCounts
		.sort((a, b) => a[1] - b[1])
		.reverse()
		.map(item => {
			return { name: item[0], count: item[1] };
		});
};