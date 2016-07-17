(function(angular){
	var $http,redirect,alerts,errorHandler;

	function NewNoteController(newHttp, newRedirect,newAlerts, fnErrorHandler){
		$http = newHttp;
		redirect = newRedirect;
		alerts = newAlerts;
		errorHandler = fnErrorHandler;
		this.url = '/api/notes';
	}

	angular.extend(NewNoteController.prototype, {
		onSaveClick:function(e){
			alerts.clear();
			if(!this.title || !this.body){
				alerts.info("title and body required");
				return;
			}

			$http.post(this.url, {title: this.title, body: this.body}).then(function(response){
				redirect.to("/notes", "successfully created note " + response.data.id);
			}).catch(function(response){
				errorHandler(response);
			});
		}
	});

	angular.module('noteNew').component('noteNew', {
		templateUrl: "/compiled/templates/notes/note-new.template.html",
		controller: ['$http', 'redirector', 'alerts', 'errorHandlerFactory', NewNoteController]
	});
})(angular);
