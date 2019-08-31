/**
 * Intéragir avec Ginger.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { GINGER_API_URL, GINGER_KEY } from '../../config';
import Api from './Api';
import PayUTC from './PayUTC';

const API_V1 = 'v1';
const QUERIES = {
	key: GINGER_KEY,
};

class Ginger extends Api {
	TYPE = 'ginger';

	constructor(url = GINGER_API_URL) {
		super(url);
	}

	call(request, method, queries, body, headers, validStatus, json = true, allowCancel = true) {
		return super.call(
			request,
			method,
			Object.assign({}, QUERIES),
			body,
			headers,
			validStatus,
			json,
			allowCancel
		);
	}

	getInformation() {
		return this.call(`${API_V1}/${PayUTC.getUsername()}`);
	}
}

export default new Ginger();
