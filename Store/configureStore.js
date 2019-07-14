// Store/configureStore.js

import { createStore } from 'redux';
import changeLogin from './Reducers/favoriteReducer'

export default createStore(changeLogin)
