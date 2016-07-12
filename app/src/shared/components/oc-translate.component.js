import {ComponentController} from '~/shared/components/component.controller';
import {yandex as yandexApiActions} from '~/shared/app-state/api-actions.service';

export class OcTranslateController extends ComponentController {
  /*@ngInject*/
  constructor($scope) {
    super();
    this.$scope = $scope;
    this.yandexApiActions = this.bindActionCreators(yandexApiActions);
  }

  $onDestroy() {
    this.$scope = null;
  }

  getInitialState() {
    return this.getNewState();
  }

  select(state) {
    return {supportedLanguages: this.selectorsService.resultSupportedLanguagesSelector(state)};
  }

  translate() {
    this.yandexApiActions.translate({text: this.string, lang: `${this.sourceLang}-${this.targetLang}`})
      .then(result => {
        const [, {payload}] = result;
        this.$scope.$apply(() => {
          this.translation = payload.translation;
        });
      })
    ;
  }
}

export const ocTranslate = {
  require: {
    ocApp: '^^'
  },
  template: `
    <form name="ocTranslate.form" layout-align="center" layout-wrap layout="row" layout-margin style="margin-top: 20px;">
      <section flex="48">
        <md-input-container class="md-block">
          <label>Source language</label>
          <md-select ng-model="ocTranslate.sourceLang" required>
            <md-option ng-repeat="code in ocTranslate.state.supportedLanguages" value="{{ code }}">
              {{ ::code }}
            </md-option>
          </md-select>
        </md-input-container>
        <md-input-container class="md-block">
          <label>Translate this</label>
          <textarea rows="5" cols="50" ng-model="ocTranslate.string" required></textarea>
        </md-input-container>
      </section>
      <section flex="48">
        <md-input-container class="md-block">
          <label>Target language</label>
          <md-select ng-model="ocTranslate.targetLang" required>
            <md-option ng-repeat="code in ocTranslate.state.supportedLanguages" value="{{ code }}">
              {{ ::code }}
            </md-option>
          </md-select>
        </md-input-container>
        <md-input-container class="md-block">
          <label>Translation</label>
          <textarea rows="5" cols="50" ng-model="ocTranslate.translation" readonly></textarea>
        </md-input-container>
      </section>
      <section flex="100" layout="row" layout-align="center">
        <md-input-container class="md-block">
          <md-button class="md-raised md-primary" ng-disabled="ocTranslate.form.$invalid" ng-click="ocTranslate.translate()">Translate</md-button>
        </md-input-container>
      </section>
    </form>
  `,
  controller: OcTranslateController,
  controllerAs: 'ocTranslate'
};
