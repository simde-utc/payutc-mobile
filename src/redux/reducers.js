/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { combineReducers } from 'redux';
import PayUTCService from '../services/PayUTC';

const reducers = {};

// Promise action types.
const PENDING = '_PENDING';
const SUCCED = '_FULFILLED';
const FAILED = '_REJECTED';

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
	});
};

// Generate a reducer for each service.
const generateServiceReducer = service => {
	const initialState = generateNewState();
	let serviceMethod;
	let methodState;

	// Generate a new state with a new store for each resource action.
	reducers[service.TYPE] = (state = initialState, action) => {
		state = generateNewState(state.returnState());

		if (action.type.endsWith(PENDING)) {
			serviceMethod = action.type.substring(0, action.type.length - PENDING.length);

			methodState = generateNewStore(state[serviceMethod]());
			methodState.fetching = true;
			methodState.fetched = false;
			methodState.failed = false;
			methodState.code = null;
		} else if (action.type.endsWith(SUCCED)) {
			serviceMethod = action.type.substring(0, action.type.length - SUCCED.length);
			const [data, code] = action.payload;

			methodState = generateNewStore(state[serviceMethod]());
			methodState.data = data;
			methodState.fetching = false;
			methodState.fetched = true;
			methodState.failed = false;
			methodState.code = code;
		} else if (action.type.endsWith(FAILED)) {
			serviceMethod = action.type.substring(0, action.type.length - FAILED.length);
			const [data, code] = action.payload;

			methodState = generateNewStore(state[serviceMethod]());
			methodState.data = data;
			methodState.fetching = false;
			methodState.fetched = false;
			methodState.failed = true;
			methodState.code = code;
		}

		state[serviceMethod] = methodState;

		return state;
	};
};

generateServiceReducer(PayUTCService);

export default combineReducers(reducers);
