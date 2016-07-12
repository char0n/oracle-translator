import {ComponentController} from '~/shared/components/component.controller';

export class OcToolbarController extends ComponentController {
  /*@ngInject*/
  constructor($window, $rootRouter) {
    super();
    this.$window = $window;
    this.$rootRouter = $rootRouter;
    this.title = 'Oracle translate';
  }

  $onDestroy() {
    this.$window = null;
  }

  changeTitle(newTitle) {
    this.title = newTitle;
  }
}

export const ocToolbar = {
  require: {
    ocApp: '^^'
  },
  template: require('./oc-toolbar.component.html'),
  controller: OcToolbarController,
  controllerAs: 'ocToolbar'
};
