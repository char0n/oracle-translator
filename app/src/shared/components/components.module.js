import {ocLaunchScreen} from './oc-launch-screen.component';
import {ocToolbar} from './oc-toolbar.component';
import {ocMain} from './oc-main.component';
import {ocTranslate} from './oc-translate.component';
import {ocTranslationList} from './oc-translation-list.component';
import {ComponentController} from './component.controller';

const Components = angular
  .module('components', [])
  .component('ocLaunchScreen', ocLaunchScreen)
  .component('ocToolbar', ocToolbar)
  .component('ocMain', ocMain)
  .component('ocTranslate', ocTranslate)
  .component('ocTranslationList', ocTranslationList)
  .controller('ComponentController', ComponentController)
  .name
  ;

export default Components;
