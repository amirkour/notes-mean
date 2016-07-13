angular.
module('notesApp').
config(['$locationProvider', '$routeProvider', function config($locationProvider, $routeProvider) {
  // $locationProvider.hashPrefix('!');

  $routeProvider.
    when('/tags', {
      template: '<tag-list></tag-list>'
    }).
    // when('/phones/:phoneId', {
    //   template: '<phone-detail></phone-detail>'
    // }).
    otherwise('/');
  }
]);