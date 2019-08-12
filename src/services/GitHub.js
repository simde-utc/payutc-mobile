/**
 * Intéragir avec GitHub.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { GITHUB_URL } from '../../config';

import Api from './Api';

class GitHub extends Api {
	constructor(url = GITHUB_URL) {
		super(url);
	}

	getIssueUrl() {
		return `${this.getUrl()}issues`;
	}
}

export default new GitHub();
