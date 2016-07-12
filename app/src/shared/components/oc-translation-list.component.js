import {ComponentController} from '~/shared/components/component.controller';
import {MD5} from '~/shared/app-state/store-util.service';

export class OcTranslationListController extends ComponentController {
  $onInit() {
    this.storeSubscribe();
  }

  $onDestroy() {
    this.storeUnsubscribe();
  }

  getInitialState() {
    return this.getNewState();
  }

  select(state) {
    return {translations: this.translationsSelector(state)};
  }

  translationsSelector(state) {
    return this.selectorsService.resultTranslationsSelector(state)
      .map(translation => {
        const $$hashKey = MD5(JSON.stringify(translation));
        return Object.assign({}, translation, {$$hashKey});
      })
    ;
  }
}

export const ocTranslationList = {
  template: `
    <md-list>
      <md-list-item class="md-3-line" ng-repeat-start="translation in ocTranslationList.state.translations">
         <div class="md-list-item-text" layout="column">
            <h3>{{ ::translation.string }}</h3>
            <h4>{{ ::translation.translation }}</h4>
            <p>{{ ::translation.sourceLang }} -> {{ ::translation.targetLang }}</p>
          </div>
      </md-list-item>
      <md-divider ng-repeat-end></md-divider>
    </md-list>
  `,
  controller: OcTranslationListController,
  controllerAs: 'ocTranslationList'
};
