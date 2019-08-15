/**
 * Intéragir avec le CAS UTC.
 *
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license GPL-3.0
 */

import { Alert } from 'react-native';
import { CAS_URL } from '../../config';

import Api from './Api';

class CASAuth extends Api {
	constructor(url = CAS_URL) {
		super(url);
	}

	call(request, method, queries, body, headers, validStatus) {
		const parameters = {
			method: method || Api.GET,
			headers: headers || {},
			body: Api.serialize(body),
		};

		return new Promise((resolve, reject) => {
			Api.fetch(
				false,
				resolve,
				reject,
				Api.urlWithQueries(this.baseUrl + request, queries),
				parameters,
				validStatus || Api.VALID_STATUS,
				false
			);
		});
	}

	isConnected() {
		return this.ticket && this.ticket.length > 0;
	}

	setTicket(ticket) {
		this.ticket = ticket;
	}

	getTicket() {
		return this.ticket;
	}

	isTicketValid(ticket) {
		return this.call(ticket, Api.GET).then(() => {
			this.ticket = ticket;

			return true;
		});
	}

	login(login, password) {
		return this.call(
			'',
			Api.POST,
			'',
			{
				username: login,
				password,
			},
			CASAuth.HEADERS_FORM_URLENCODED,
			[201]
		).then(([response, status, url]) => {
			this.ticket = CASAuth.parseTgt(response);

			return [response, status, url];
		});
	}

	getServiceTicket(service, queries) {
		return this.call(
			this.ticket,
			Api.POST,
			{},
			{
				service: Api.urlWithQueries(service, queries),
			},
			CASAuth.HEADERS_FORM_URLENCODED,
			[200]
		);
	}

	static parseTgt(content) {
		try {
			const start = content.indexOf('tickets//') + 8;
			const end = content.indexOf('"', start);

			return content.substring(start, end);
		} catch (e) {
			Alert.alert('CAS', 'Une erreur CAS a été rencontrée', [{ text: 'Continuer' }], {
				cancelable: false,
			});
		}
	}
}

export default new CASAuth();
