export class OcLaunchScreenController {
  /*@ngInject*/
  constructor($element, $window) {
    this.$element = $element;
    this.$window = $window;
  }

  $postLink() {
    this.flexElement();
  }

  $onDestroy() {
    this.$element = null;
    this.$window = null;
  }

  refresh() {
    this.$window.location.reload(true);
  }

  flexElement() {
    this.$element.addClass('flex layout-column layout-align-end-center');
  }
}

export const ocLaunchScreen = {
  template: `
    <section flex></section>
    <section>
      <img ng-src="images/launch-screen.png" alt="Team Zeus" width="580" height="224" />
    </section>
    <br />
    <section ng-if="ocLaunchScreen.status === null" style="width: 56px; height: 56px">
      <md-progress-circular md-diameter="56" md-mode="indeterminate"></md-progress-circular>
    </section>
    <section ng-if="ocLaunchScreen.status === false" layout="column" layout-align="start center">
      <h2>Load of application data failed!</h2>
      <p>
        To fix the problem, hit the refresh button in your browser or click here
        <md-button class="md-icon-button md-primary" aria-label="Refresh application" ng-click="ocLaunchScreen.refresh()">
          <md-icon>refresh</md-icon>
        </md-button>
      </p>
    </section>
    <section flex></section>
    <h1>Datasapiens test</h1>
    <section flex></section>
  `,
  controller: OcLaunchScreenController,
  controllerAs: 'ocLaunchScreen',
  bindings: {
    status: '<'
  }
};
