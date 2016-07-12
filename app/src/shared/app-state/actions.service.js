import {createAction} from 'redux-actions';

export const state = {
  setLoaded: createAction('state.setLoaded')
};

export const result = {
  setSupportedLanguagesList: createAction('result.setSupportedLanguagesList'),
  setTranslationsList: createAction('result.setTranslationsList'),
  addTranslation: createAction('result.addTranslation')
};
