var events = {
	globalFeedback: "events.redirector.globalFeedback",
	clear:'events.redirector.clear'
};

angular.
module('redirector', ['ngRoute', 'alerts']).
factory('redirector', ['$location', '$rootScope', '$route', 'alerts',  function($location, $rootScope, $route, alerts){
	var flash = [];

	// after all routing events end, check to see if there's feedback in the 'flash'
	// that needs to get thrown-up and do so.
	// otherwise: make sure no stale flash/feedback messages are visible on screen
	// after routing to a new page has succeeded.
	$rootScope.$on('$routeChangeSuccess', function(){
		if(flash.length > 0){
			var payload = flash.pop();
			alerts.show(payload.msg, payload.type);
		}else{
			alerts.clear();
		}
	});

	return {
		to: function(url,msg,type){

			// if there's a message to 'flash' on screen after the redirect, queue it up.
			// you have to wait until all the routing-related events have completed before
			// consuming/showing the flash message (otherwise, you want to clear any flash
			// message currently displayed.)
			if(typeof msg === 'string') flash.push({msg:msg,type:type});

			// now 'redirect'
			if(typeof url === 'string') $location.url(url);
		}
	}
}]);