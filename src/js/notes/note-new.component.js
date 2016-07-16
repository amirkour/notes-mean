(function($,angular){
	var http;

	function NewNoteController($http){
		http = $http;
		this.url = '/api/notes';
	}

	$.extend(NewNoteController.prototype, {
		
	});

	angular.module('noteNew').component('noteNew', {
		templateUrl: "/compiled/templates/notes/note-new.template.html",
		controller: ['$http', NewNoteController]
	});
})($,angular);
