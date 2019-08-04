/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import CASAuthService from '../services/CASAuth';
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

export const CASAuth = generateActions(CASAuthService);
export const PayUTC = generateActions(PayUTCService);
export const Config = new Proxy(
	{},
	{
		get: (_, method) => data => {
			return {
				type: 'CONFIG',
				config: method,
				data,
			};
		},
	}
);

export default {
	CASAuth,
	PayUTC,
	Config,
};
