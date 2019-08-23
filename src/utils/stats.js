/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { floatToEuro } from './amount';

export const numberOfTransactions = history => {
	return history.length;
};

export const firstTransaction = history => {
	return history.length > 0 ? history[history.length - 1].date : null;
};

const getQuantityForTransaction = ({ quantity, amount }) => (quantity === amount ? 1 : quantity);

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
	return floatToEuro(total(history, 'PURCHASE', 'amount', since) / 100);
};

export const purchasesCount = (history, since) => {
	return total(history, 'PURCHASE', 'quantity', since);
};

export const receivedAmount = (history, since) => {
	return floatToEuro(total(history, 'VIRIN', 'amount', since) / 100);
};

export const givenAmount = (history, since) => {
	return floatToEuro(total(history, 'VIROUT', 'amount', since) / 100);
};

const getCounts = (history, type, displayedAttributes, countAttribute, positive = true) => {
	const counts = {};

	history
		.filter(transaction => transaction.type === type)
		.map(transaction => {
			return {
				name: displayedAttributes.map(attr => transaction[attr]).join(' '),
				count:
					countAttribute === 'quantity'
						? getQuantityForTransaction(transaction)
						: transaction[countAttribute],
			};
		})
		.forEach(({ name, count }) => {
			if (count > 0 === positive) {
				counts[name] = (counts[name] || 0) + count;
			}
		});

	return counts;
};

const sortCounts = counts => {
	return Object.keys(counts)
		.sort((a, b) => counts[a] - counts[b])
		.reverse()
		.map(name => {
			return { name, count: counts[name] };
		});
};

const sortedItems = (history, type, displayedAttributes, countAttribute) =>
	sortCounts(getCounts(history, type, displayedAttributes, countAttribute));

export const mostPurchasedItems = history => {
	return sortedItems(history, 'PURCHASE', ['name'], 'quantity');
};

export const mostSpentItems = history => {
	return sortedItems(history, 'PURCHASE', ['name'], 'amount');
};

export const mostReceivedFromPersons = history => {
	const counts = getCounts(history, 'VIRIN', ['firstname', 'lastname'], 'amount');
	const negativeCounts = getCounts(history, 'VIROUT', ['firstname', 'lastname'], 'amount', false);

	Object.keys(negativeCounts).forEach(name => {
		counts[name] = (counts[name] || 0) - negativeCounts[name];
	});

	return sortCounts(counts);
};

export const mostGivenToPeople = history => {
	const counts = getCounts(history, 'VIROUT', ['firstname', 'lastname'], 'amount');
	const negativeCounts = getCounts(history, 'VIRIN', ['firstname', 'lastname'], 'amount', false);

	Object.keys(negativeCounts).forEach(name => {
		counts[name] = (counts[name] || 0) - negativeCounts[name];
	});

	return sortCounts(counts);
};

export const totalAmount = (history, since) => {
	const purchases = total(history, 'PURCHASE', 'amount', since);
	const transfers = total(history, 'VIROUT', 'amount', since);
	return purchases + transfers;
};
