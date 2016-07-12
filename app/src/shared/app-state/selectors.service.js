//////////////////////
// Input selectors. //
//////////////////////
export function stateLoadedSelector(state) {
  return state.stateLoaded;
}

export function resultTranslationsSelector(state) {
  return state.result.translations;
}

export function resultSupportedLanguagesSelector(state) {
  return state.result.supportedLanguages;
}

