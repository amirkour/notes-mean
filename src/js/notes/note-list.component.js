(function(angular){
	var $http,$location,redirector,alerts;

	function NoteListController($newHttp,$newLocation, newRedirector, newAlerts){
		$http = $newHttp;
		$location = $newLocation;
		redirector = newRedirector;
		alerts = newAlerts;

		this.url = '/api/notes';
	}

	angular.extend(NoteListController.prototype, {
		onNewNoteClick: function(e){
			redirector.to('/notes/new');
		}
	});

	angular.module('noteList').component('noteList', {
		templateUrl: "/compiled/templates/notes/note-list.template.html",
		controller: ['$http', '$location', 'redirector', 'alerts', NoteListController]
	});
})(angular);
