(function($,angular){
	var $http,$location,redirector;

	function NoteListController($newHttp,$newLocation, newRedirector){
		$http = $newHttp;
		$location = $newLocation;
		redirector = newRedirector;

		this.url = '/api/notes';
	}

	$.extend(NoteListController.prototype, {
		onNewNoteClick: function(e){
			redirector.to('/notes/new', 'hi world', 'danger');
		}
	});

	angular.module('noteList').component('noteList', {
		templateUrl: "/compiled/templates/notes/note-list.template.html",
		controller: ['$http', '$location', 'redirectorFactory', NoteListController]
	});
})($,angular);
