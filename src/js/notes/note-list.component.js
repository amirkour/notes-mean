(function(angular){
	var $http,$location,redirector,alerts,errorHandler;

	function NoteListController($newHttp,$newLocation, newRedirector, newAlerts, newErrorHandler){
		$http = $newHttp;
		$location = $newLocation;
		redirector = newRedirector;
		alerts = newAlerts;
		errorHandler = newErrorHandler;

		this.url = '/api/notes';
		this.fetch();
	}

	angular.extend(NoteListController.prototype, {
		fetch:function(){
			var self = this;
			$http.get(this.url).then(function(response){
				self.notes = response.data;
			}).catch(errorHandler);
		},
		onNewNoteClick: function(e){
			redirector.to('/notes/new');
		},
		delete:function(note){
			var self = this;
			alerts.clear();
			$http.delete(this.url + "/" + note.id).then(function(response){
				var notes = [];
				self.notes.forEach(function(next){
					if(next.id !== note.id) notes.push(next);
				});
				self.notes = notes;
				alerts.success("deleted note " + note.id);
			}).catch(errorHandler);
		}
	});

	angular.module('noteList').component('noteList', {
		templateUrl: "/compiled/templates/notes/note-list.template.html",
		controller: ['$http', '$location', 'redirector', 'alerts', 'errorHandlerFactory', NoteListController]
	});
})(angular);
