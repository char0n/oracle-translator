import {createStore, applyMiddleware} from 'redux';
import reduxThunk from 'redux-thunk';

import {logging} from './redux-middleware.service';
import {rootReducer} from './reducers.service';
import {emitter as eventEmitter, STORE_DISPATCH} from '~/shared/event-emitter';

// Initialize localStorage
if (!window.localStorage.getItem('translations')) {
  window.localStorage.setItem('translations', JSON.stringify([]));
}

/**
 * This is the shape of our state.
 * @type Object
 */
const initialState = {
  stateLoaded: null,
  currentUserId: null,
  result: {
    translations: [],
    supportedLanguages: []
  }
};

export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    reduxThunk,
    logging
  )
);

store.subscribe(() => {
  eventEmitter.emit(STORE_DISPATCH);
});
