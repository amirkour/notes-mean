(function($,angular){
	var $http,$location;

	function NoteListController($newHttp,$newLocation){
		$http = $newHttp;
		$location = $newLocation;
		this.url = '/api/notes';
	}

	$.extend(NoteListController.prototype, {
		onNewNoteClick: function(e){
			$location.url('/notes/new');
		}
	});

	angular.module('noteList').component('noteList', {
		templateUrl: "/compiled/templates/notes/note-list.template.html",
		controller: ['$http', '$location', NoteListController]
	});
})($,angular);
