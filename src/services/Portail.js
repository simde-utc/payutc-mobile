/**
 * Intéragir avec le Portail.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { PORTAIL_URL } from '../../config';

import Api from './Api';

const API_V1 = 'api/v1';

export class Portail extends Api {
	TYPE = 'portail';

	call(service, request, method, queries, body, headers, validStatus, json = true) {
		return super.call(
			request ? `${service}/${request}` : service,
			method,
			queries,
			body,
			headers,
			validStatus,
			json
		);
	}

	constructor(url = PORTAIL_URL) {
		super(url);
	}

	getCurrentSemester() {
		return this.call(API_V1, 'semesters/current');
	}
}

export default new Portail();
