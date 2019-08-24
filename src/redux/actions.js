/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import CASAuthService from '../services/CASAuth';
import PayUTCService from '../services/PayUTC';
import GitHubService from '../services/GitHub';
import PortailService from '../services/Portail';

// Generate actions for services. Each call, is a service method call.
export const generateActions = service => {
	return new Proxy(
		{},
		{
			get: (_, method) => {
				return (...args) => ({
					type: `${service.TYPE}_${method}`,
					payload: service[method](...args),
				});
			},
		}
	);
};

export const CASAuth = generateActions(CASAuthService);
export const PayUTC = generateActions(PayUTCService);
export const GitHub = generateActions(GitHubService);
export const Portail = generateActions(PortailService);
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
	GitHub,
	Portail,
	Config,
};
