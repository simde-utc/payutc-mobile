/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { combineReducers } from 'redux';
import CASAuthService from '../services/CASAuth';
import PayUTCService from '../services/PayUTC';
import GitHubService from '../services/GitHub';
import { configReducer } from './config';

// Promise action types.
const PENDING = 'PENDING';
const SUCCEEDED = 'FULFILLED';
const FAILED = 'REJECTED';

const reducers = {
	config: configReducer,
};

// Generate a new store for a specific service resource.
const generateNewStore = (newStore = {}) => {
	newStore.getData = (defaultValue = []) => newStore.data || defaultValue;
	newStore.isFetching = (defaultValue = false) => newStore.fetching || defaultValue;
	newStore.isFetched = (defaultValue = false) => newStore.fetched || defaultValue;
	newStore.hasFailed = (defaultValue = false) => newStore.failed || defaultValue;
	newStore.getCode = (defaultValue = null) => newStore.code || defaultValue;

	return newStore;
};

// Generate a new service resource if not found.
const generateNewState = (newState = {}) => {
	return new Proxy(newState, {
		get: (state, method) => () => {
			if (method === 'returnState') {
				return state;
			}

			if (!state[method]) {
				state[method] = generateNewStore();
			}

			return state[method];
		},
		set: (state, method, value) => {
			state[method] = value;
		},
	});
};

const generalReducer = type => (state, action) => {
	const [service, method, status] = action ? action.type.split('_') : null;

	if (service !== type) {
		return state;
	}

	const newState = generateNewState(state.returnState());
	delete state.returnState();
	const methodState = generateNewStore(newState[method]());
	delete newState[method]();
	let data;
	let code;

	switch (status) {
		case PENDING:
			methodState.fetching = true;
			methodState.fetched = false;
			methodState.failed = false;
			methodState.code = null;

			break;

		case SUCCEEDED:
		case FAILED:
		default:
			[data, code] = action.payload;

			if (code === 523) {
				methodState.fetching = false;
				methodState.fetched = true;
			} else {
				if (method === 'getHistory' && methodState.data) {
					for (
						let i = data.historique.length - methodState.data.historique.length - 1;
						i >= 0;
						i--
					) {
						methodState.data.historique.splice(0, 0, data.historique[i]);
					}
				} else {
					delete methodState.data;
					methodState.data = data;
				}

				methodState.fetching = false;
				methodState.fetched = status === SUCCEEDED;
				methodState.failed = status === FAILED;
				methodState.code = code;
			}

			break;
	}

	newState[method] = methodState;

	return newState;
};

// Generate a reducer for each service.
const generateServiceReducer = service => {
	const initialState = generateNewState();

	// Generate a new state with a new store for each resource action.
	reducers[service.TYPE] = (state = initialState, action) =>
		generalReducer(service.TYPE)(state, action);
};

generateServiceReducer(CASAuthService);
generateServiceReducer(PayUTCService);
generateServiceReducer(GitHubService);

export default combineReducers(reducers);
