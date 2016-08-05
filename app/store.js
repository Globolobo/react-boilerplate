/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';
import createRootEpic, { epic$ } from './epics';

const epicMiddleware = createEpicMiddleware(createRootEpic(epic$));
const devtools = window.devToolsExtension || (() => noop => noop);

export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. epicMiddleware: Makes redux-observables work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
      epicMiddleware,
      routerMiddleware(history),
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools(),
  ];

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    compose(...enhancers)
  );

  // Extensions
  store.asyncReducers = {}; // Async reducer registry
  store.epic$ = epic$;
    
  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
      module.hot.accept('./reducers','./epics', () => {
	System.import('./reducers').then((reducerModule) => {
            const createReducers = reducerModule.default;
            const nextReducers = createReducers(store.asyncReducers);

            store.replaceReducer(nextReducers);
      });
	System.import('./epics').then((epicModule) => {
	    const createEpics = epicModule.default
	    const nextEpics = createRootEpic(store.epic$);

	    epicMiddleware.replaceEpic(rootEpic);
	});
    });
  }

  return store;
}
