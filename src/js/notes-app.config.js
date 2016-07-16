angular.
module('notesApp').
config(['$locationProvider', '$routeProvider', function config($locationProvider, $routeProvider) {
  // $locationProvider.hashPrefix('!');

  $routeProvider.
    when('/tags', {
      template: '<tag-list></tag-list>'
    }).when('/',  {
      template: '<note-list></note-list>'
    }).otherwise('/');
  }
]);