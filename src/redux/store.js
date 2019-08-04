/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import promiseMiddleware from 'redux-promise-middleware';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';

export default createStore(reducers, applyMiddleware(promiseMiddleware));
