angular.
module('notesApp').
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

    $routeProvider.
    when('/tags', {
        template: '<tag-list></tag-list>'
    }).when('/',  {
        template: '<note-list></note-list>'
    }).when('/notes', {
        template: '<note-list></note-list>'
    }).when('/notes/new', {
    	template: '<note-new></note-new>'
    }).otherwise('/');
}]);
