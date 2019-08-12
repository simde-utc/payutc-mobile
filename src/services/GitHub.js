/**
 * Intéragir avec GitHub.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { APP_REPO_NAME, GITHUB_URL, GITHUB_API_URL } from '../../config';

import Api from './Api';

class GitHub extends Api {
	TYPE = 'github';

	constructor(url = GITHUB_API_URL) {
		super(url);
	}

	// eslint-disable-next-line class-methods-use-this
	getIssueUrl() {
		return `${GITHUB_URL}${APP_REPO_NAME}/issues`;
	}

	getContributors() {
		return this.call(`repos/${APP_REPO_NAME}/contributors`);
	}
}

export default new GitHub();
