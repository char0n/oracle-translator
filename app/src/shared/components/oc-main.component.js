import {ComponentController} from '~/shared/components/component.controller';

export class OcMainController extends ComponentController {
  /*@ngInject*/
  constructor($element) {
    super();
    this.$element = $element;
  }

  $postLink() {
    this.flexComponent();
  }

  $onDestroy() {
    this.$element = null;
  }

  flexComponent() {
    this.$element.addClass('flex layout-column');
  }
}

export const ocMain = {
  template: `
    <oc-translate></oc-translate>
    <oc-translation-list></oc-translation-list>
  `,
  controller: OcMainController,
  controllerAs: 'ocMain'
};
