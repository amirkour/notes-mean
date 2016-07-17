(function(angular){
	var $http,$routeParams,redirect,alerts,errorHandler;

	function NewNoteController(newHttp, newRouteParams, newRedirect,newAlerts, fnErrorHandler){
		$http = newHttp;
		$routeParams = newRouteParams;
		redirect = newRedirect;
		alerts = newAlerts;
		errorHandler = fnErrorHandler;
		this.url = '/api/notes';
		this.id = $routeParams.id;
		if(this.id) this.fetch(this.id);
	}

	angular.extend(NewNoteController.prototype, {
		fetch:function(id){
			var self = this;
			$http.get(this.url + "/" + id).then(function(response){
				self.title = response.data.title;
				self.body = response.data.body;
			}).catch(errorHandler);
		},
		onSaveClick:function(e){
			alerts.clear();
			if(!this.title || !this.body){
				alerts.info("title and body required");
				return;
			}

			var method = this.id ? 'put' : 'post',
				url = this.id ? this.url + "/" + this.id : this.url,
				body = {title: this.title, body: this.body};

			if(this.id) body.id = this.id;

			var self = this;
			$http[method](url, body).then(function(response){
				var msg = self.id ? 'updated' : 'created';
				redirect.to("/notes", "successfully " + msg + " note " + response.data.id);
			}).catch(function(response){
				errorHandler(response);
			});
		}
	});

	angular.module('noteNew').component('noteNew', {
		templateUrl: "/compiled/templates/notes/note-new.template.html",
		controller: ['$http', '$routeParams', 'redirector', 'alerts', 'errorHandlerFactory', NewNoteController]
	});
})(angular);
