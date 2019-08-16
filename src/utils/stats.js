/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { floatToEuro } from './index';
import { SALE, TRANSFER_OUT, TRANSFER_IN } from '../components/History/Transaction';

export const numberOfTransactions = history => {
	return history.length;
};

export const firstTransaction = history => {
	return history.length > 0 ? history[history.length - 1].date : null;
};

const getQuantityForTransaction = ({ quantity, variation }) =>
	quantity === -variation ? 1 : quantity;

const total = (history, type, countAttribute, since) => {
	return history
		.filter(
			transaction => transaction.type === type && new Date(transaction.date) > new Date(since)
		)
		.map(transaction =>
			countAttribute === 'quantity'
				? getQuantityForTransaction(transaction)
				: transaction[countAttribute]
		)
		.reduce((acc, cur) => acc + cur, 0);
};

export const purchasesAmount = (history, since) => {
	return floatToEuro(-total(history, SALE, 'variation', since) / 100);
};

export const purchasesCount = (history, since) => {
	return total(history, SALE, 'quantity', since);
};

export const receivedAmount = (history, since) => {
	return floatToEuro(total(history, TRANSFER_IN, 'variation', since) / 100);
};

export const givenAmount = (history, since) => {
	return floatToEuro(-total(history, TRANSFER_OUT, 'variation', since) / 100);
};

const sortedItems = (history, type, displayedAttributes, countAttribute) => {
	const counts = {};
	const sortableCounts = [];

	history
		.filter(transaction => transaction.type === type)
		.map(transaction => {
			return {
				name: displayedAttributes.map(attr => transaction[attr]).join(' '),
				count:
					countAttribute === 'quantity'
						? getQuantityForTransaction(transaction)
						: Math.abs(transaction[countAttribute]),
			};
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

export const mostPurchasedItems = history => {
	return sortedItems(history, SALE, ['item'], 'quantity');
};

export const mostSpentItems = history => {
	return sortedItems(history, SALE, ['item'], 'variation');
};

export const mostReceivedFromPersons = history => {
	return sortedItems(history, TRANSFER_IN, ['other_name'], 'variation');
};

export const mostGivenToPeople = history => {
	return sortedItems(history, TRANSFER_OUT, ['other_name'], 'variation');
};

export const totalAmount = (history, since) => {
	const purchases = total(history, SALE, 'variation', since);
	const transfers = total(history, TRANSFER_OUT, 'variation', since);
	return purchases + transfers;
};
