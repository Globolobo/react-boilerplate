import createReducer from '../reducers';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * Inject an asynchronously loaded reducer
 */
export function injectAsyncReducer(store) {
    return (name, asyncReducer) => {
    store.asyncReducers[name] = asyncReducer; // eslint-disable-line no-param-reassign
    store.replaceReducer(createReducer(store.asyncReducers));
  };
}

/**
 * Inject an asynchronously loaded saga
 */
export function injectAsyncSagas(store) {
  return (sagas) => sagas.map(store.runSaga);
}

/**
* Inject an asynchronously loaded epic
*/
export function injectAsyncEpic(store) {
    return (asyncEpic) => store.epic$.next(asyncEpic);
}

/**
 * Helper for creating injectors
 */
export function getAsyncInjectors(store) {
  return {
      injectReducer: injectAsyncReducer(store),
      injectSagas: injectAsyncSagas(store),
      injectEpic: injectAsyncEpic(store),
  };
}
