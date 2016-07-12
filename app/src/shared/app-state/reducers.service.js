import {isUndefined, flatten, uniq} from 'lodash';

import * as selectorsService from './selectors.service';

export function rootReducer(state, action) {
  return {
    stateLoaded: stateLoaded(selectorsService.stateLoadedSelector(state), action),
    result: {
      translations: resultTranslations(selectorsService.resultTranslationsSelector(state), action),
      supportedLanguages: resultSupportedLanguages(selectorsService.resultSupportedLanguagesSelector(state), action)
    }
  };
}

export function stateLoaded(state, action) {
  switch (action.type) {
    case 'state.setLoaded': {
      return action.payload;
    }
    default: {
      return isUndefined(state) ? null : state;
    }
  }
}

export function resultTranslations(state, action) {
  switch (action.type) {
    case 'result.setTranslationsList': {
      return Array.from(action.payload);
    }
    case 'result.addTranslation': {
      const newState = [action.payload].concat(state);

      window.localStorage.setItem('translations', JSON.stringify(newState));
      return newState;
    }
    default: {
      return isUndefined(state) ? [] : state;
    }
  }
}

export function resultSupportedLanguages(state, action) {
  switch (action.type) {
    case 'result.setSupportedLanguagesList': {
      return uniq(flatten(action.payload.map(pair => pair.split('-')))).sort();
    }
    default: {
      return isUndefined(state) ? [] : state;
    }
  }
}
