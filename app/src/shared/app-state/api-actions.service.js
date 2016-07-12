import {parse as urlParse, format as urlFormat} from 'url';
import {flow, partial, partialRight, toPairs, isArray} from 'lodash';

import * as actionsService from './actions.service';
import moment from '~/shared/moment';
import {emitter as eventEmitter, HTTP_RESPONSE, HTTP_RESPONSE_ERROR} from '~/shared/event-emitter';

const apiHost = 'https://translate.yandex.net/api/v1.5/tr.json';
const apiKey = 'trnsl.1.1.20160712T125910Z.ff3a13ef194dd592.cd07cc1a83c59914deffe1f2c01f1698a0b820a1';
const _ = partial.placeholder;
export const getFullUrl = partialRight(appendPathnameToHost, apiHost);
export const authenticateUrl = partial(addApiKeyToUrl, apiKey);
export const apiMethod = flow(apiMethodToUrl, getFullUrl, authenticateUrl);
export const apiMethodWithParams = partial(apiMethodWithParamsFactory, _, _, addUrlParams, apiMethod);
export const errorResponseCycle = flow(processErrorResponse);
export const standardResponseCycle = flow(parseJSON);

export const yandex = {
  getLangs: partial(yandexGetLangsFactory, fetch, apiMethod, standardResponseCycle, errorResponseCycle, actionsService),
  translate: partial(yandexTranslateFactory, _, fetch, apiMethodWithParams, standardResponseCycle, errorResponseCycle, actionsService)
};

export const state = {
  load: partial(stateLoadFactory, yandex, actionsService)
};

///////////
// Utils //
///////////
export function apiMethodToUrl(methodName) {
  return `/${methodName}`;
}

export function appendPathnameToHost(pathname, host) {
  const parsedUrl = urlParse(host);
  parsedUrl.pathname += pathname;
  return urlFormat(parsedUrl);
}

export function addUrlParams(url, params) {
  const parsedUrl = urlParse(url, true);

  delete parsedUrl.search;
  Object.assign(parsedUrl.query, params);

  return urlFormat(parsedUrl);
}

export function addApiKeyToUrl(apiKey, url) {
  const parsedUrl = urlParse(url, true);

  delete parsedUrl.search;
  parsedUrl.query.key = apiKey;

  return urlFormat(parsedUrl);
}

export function apiMethodWithParamsFactory(methodName, params = {}, addUrlParams, apiMethod) {
  return addUrlParams(apiMethod(methodName), params);
}

export function processErrorResponse(ex) {
  eventEmitter.emit(HTTP_RESPONSE, undefined);
  eventEmitter.emit(HTTP_RESPONSE_ERROR, ex);
  throw ex;
}

export function parseJSON(response) {
  return response.json();
}

export function flatDataToFormData(data) {
  return toPairs(data).reduce((previousValue, currentValue) => {
    const key = currentValue[0];
    const value = currentValue[1] === null ? '' : currentValue[1];

    if (isArray(value)) {
      value.forEach(item => previousValue.append(key, item));
    } else {
      previousValue.set(key, value);
    }

    return previousValue;
  }, new window.FormData());
}

//////////////////////////
// Api action factories //
//////////////////////////
export function stateLoadFactory(yandexActions, actionsService) {
  return dispatch => {
    const getLangsPromise = dispatch(yandexActions.getLangs());
    const loadTranslationsPromise = Promise.resolve().then(() => {
      const translations = JSON.parse(window.localStorage.getItem('translations'));
      dispatch(actionsService.result.setTranslationsList(translations));
    });

    return Promise.all([getLangsPromise, loadTranslationsPromise])
      .then(partial(dispatch, actionsService.state.setLoaded(true)))
      .catch(partial(dispatch, actionsService.state.setLoaded(false)))
      ;
  };
}

export function yandexGetLangsFactory(fetch, apiMethod, standardResponseCycle, errorResponseCycle, actionsService) {
  return dispatch => fetch(apiMethod('getLangs'))
    .catch(errorResponseCycle)
    .then(standardResponseCycle)
    .then(data => {
      const setSupportedLanguagesListAction = dispatch(actionsService.result.setSupportedLanguagesList(data.dirs));

      return [data, setSupportedLanguagesListAction];
    })
    ;
}

export function yandexTranslateFactory(params, fetch, apiMethodWithParams, standardResponseCycle, errorResponseCycle, actionsService) {
  return dispatch => fetch(apiMethodWithParams('translate', params))
    .catch(errorResponseCycle)
    .then(standardResponseCycle)
    .then(data => {
      const codes = params.lang.split('-');
      const addTranslationAction = dispatch(actionsService.result.addTranslation({
        created: moment().format('x'),
        string: params.text,
        sourceLang: codes[0],
        targetLang: codes[1],
        translation: data.text[0]
      }));

      return [data, addTranslationAction];
    })
    ;
}
