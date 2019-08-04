/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import PayUTCService from '../services/PayUTC';

// Generate actions for services. Each call, is a service method call.
export const generateActions = service => {
	return new Proxy(
		{},
		{
			get: (_, method) => {
				return (...args) => ({
					type: method,
					payload: service[method](...args),
				});
			},
		}
	);
};

export const PayUTC = generateActions(PayUTCService);

export default {
	PayUTC,
};
