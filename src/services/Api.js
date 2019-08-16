/**
 * Classe abtraite d'intéraction avec des APIs
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 */

import { Alert } from 'react-native';
import { Api as t } from '../utils/i18n';

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

	static PENDING_REQUESTS = [];

	connected = false;

	constructor(url) {
		this.baseUrl = url;
	}

	getUrl() {
		return this.baseUrl;
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

	static handleConnectionIssue(...fetchData) {
		Api.PENDING_REQUESTS.push(fetchData);

		if (Api.PENDING_REQUESTS.length === 1) {
			Alert.alert(
				t('connection_issue'),
				t('connection_retry'),
				[
					fetchData[0]
						? {
								text: t('cancel'),
								onPress: () => {
									const requests = Api.PENDING_REQUESTS;
									Api.PENDING_REQUESTS = [];

									requests.map(fetchData => fetchData[2]([null, 523]));
								},
								style: 'cancel',
						  }
						: {},
					{
						text: t('retry'),
						onPress: () => {
							const requests = Api.PENDING_REQUESTS;
							Api.PENDING_REQUESTS = [];

							requests.map(fetchData => Api.fetch(...fetchData));
						},
					},
				],
				{ cancelable: false }
			);
		}
	}

	static fetch(allowCancel, resolve, reject, url, params, validStatus, json) {
		fetch(url, params)
			.then(response => {
				const toReturn = data => {
					if (validStatus.includes(response.status)) {
						return resolve([data, response.status]);
					}

					return reject([data, response.status]);
				};

				if (json) {
					return response.json().then(toReturn);
				}

				return response.text().then(toReturn);
			})
			.catch(() => {
				Api.handleConnectionIssue(allowCancel, resolve, reject, url, params, validStatus, json);
			});
	}

	call(request, method, queries, body, headers, validStatus, json = true, allowCancel = true) {
		const parameters = {
			credentials: 'same-origin',
			method: method || Api.GET,
			headers: headers || Api.HEADERS_JSON,
		};

		if (method !== Api.GET) {
			parameters.body = JSON.stringify(body);
		}

		return new Promise((resolve, reject) => {
			Api.fetch(
				allowCancel,
				resolve,
				reject,
				Api.urlWithQueries(this.baseUrl + request, queries),
				parameters,
				validStatus || Api.VALID_STATUS,
				json
			);
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
}
