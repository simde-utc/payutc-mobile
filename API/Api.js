/**
 * Classe abtraite d'intéraction avec des APIs
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 */

import AbortController from 'abort-controller';

export default class Api {
	static GET = 'GET';

	static POST = 'POST';

	static PUT = 'PUT';

	static DELETE = 'DELETE';

	static HEADERS_JSON = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};

	static HEADERS_FORM_URLENCODED = {
		'Content-Type': 'application/x-www-form-urlencoded',
	};

	static VALID_STATUS = [200, 201, 204];

	connected = false;

	constructor(url) {
		this.baseUrl = url;
		this.controller = new AbortController();
		this.signal = this.controller.signal;
	}

	static serialize(queries) {
		const str = [];

		for (const query in queries) {
			if (queries.hasOwnProperty(query))
				str.push(`${encodeURIComponent(query)}=${encodeURIComponent(queries[query])}`);
		}

		return str.join('&');
	}

	static urlWithQueries(url, queries) {
		if (queries === undefined || queries.length === 0 || queries === '') {
			return url;
		}

		return `${url}?${Api.serialize(queries)}`;
	}

	call(request, method, queries, body, headers, validStatus, json = true) {
		const parameters = {
			credentials: 'same-origin',
			method: method || Api.GET,
			headers: headers || Api.HEADERS_JSON,
			signal: this.signal,
		};

		if (method !== Api.GET) {
			parameters.body = JSON.stringify(body);
		}

		return new Promise((resolve, reject) => {
			fetch(Api.urlWithQueries(this.baseUrl + request, queries), parameters)
				.then(response => {
					const toReturn = data => {
						if ((validStatus || Api.VALID_STATUS).includes(response.status)) {
							return resolve([data, response.status]);
						}

						return reject([data, response.status]);
					};

					if (json) {
						return response.json().then(toReturn);
					}

					return response.text().then(toReturn);
				})
				.catch(e => {
					return reject([e.message, 523]);
				});
		});
	}

	connectedCall(...args) {
		const call = () => this.call(...args);

		if (!this.connected) {
			return this.connect().then(call);
		}

		return call().catch(([data, status]) => {
			if (status === 401) {
				this.connected = false;

				return this.connect().then(call);
			}

			return [data, status];
		});
	}

	abortRequest() {
		this.controller.abort();
	}
}
