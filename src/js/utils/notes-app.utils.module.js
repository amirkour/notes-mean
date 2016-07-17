
(function(angular){

	// the handlers all try to do one simple thing: take an 'error' and turn it
	// into a string that can be displayed on the UI.
	//
	// different parts of the app report errors differently - sequelize reports them
	// one way, the server/api reports them another, and still angular reports them
	// another.  the handlers just try to weed-out an actual error string to return.
	var handlers = [

		// this handler assumes the given error is a string, and simply
		// returns it
		function StringNormalize(err){
			return (typeof err === 'string') ? err : null;
		},

		// this handler assumes the given error is of the form
		// { error: 'message' }
		function ServerNormalize(err){
			return (err && typeof err.error === 'string') ? err.error : null;
		},

		// this handler assumes the given error is an instance of
		// a Sequelize ValidationError
		// http://docs.sequelizejs.com/en/stable/api/errors/#new-validationerrormessage-errors
		function SequelizeValidationErrorNormalize(err){
			if(err.errors && err.errors.length > 0){
				var firstError = err.errors[0];
				if(typeof firstError.message === 'string'){
					return firstError.message;
				}else{
					return "Failed to retrieve first error message - an unknown error has occurred";
				}
			}

			return null;
		},

		// this handler assumes the error looks like this:
		// { message: 'message' }
		function MessageHandler(err){
			return (err && typeof err.message === 'string') ? err.message : null;
		},

		// this handler assumes the error came from angular, and looks like this:
		// {data: 'message', ... }
		function AngularErrorHandler(err){
			if(err && typeof err.data === 'string'){
				var msg = err.data;

				if(typeof err.status === 'number') msg = "(" + err.status + ") " + msg;
				return msg;
			}
			return null;
		}
	];

	angular.module('notesAppUtils', ['alerts']).
	factory('errorHandlerFactory', ['alerts', function(alerts){
		return function(err){
			var msg = null;
			for(var i = 0; i < handlers.length; i++){
				msg = handlers[i].call(null, err);
				if(msg != null) break;
			}

			msg = (msg || "An unrecognizable error occurred (failed to parse details)");
			alerts.danger(msg);
		}
	}]);
})(angular);