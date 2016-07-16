var events = {
	globalFeedback: "events.redirector.globalFeedback",
	clear:'events.redirector.clear'
};

angular.
module('redirector', ['ngRoute']).
factory('redirectorFactory', ['$location', '$rootScope', '$route',  function($location, $rootScope, $route){
	var flash = [];

	// after all routing events end, check to see if there's feedback in the 'flash'
	// that needs to get thrown-up and do so.
	// otherwise: make sure no stale flash/feedback messages are visible on screen
	// after routing to a new page has succeeded.
	$rootScope.$on('$routeChangeSuccess', function(){
		if(flash.length > 0){
			$rootScope.$broadcast(events.globalFeedback, flash.pop());
		}else{
			$rootScope.$broadcast(events.clear);
		}
	});

	return {
		to: function(url,msg,type){

			// if there's a message to 'flash' on screen after the redirect, queue it up.
			// you have to wait until all the routing-related events have completed before
			// consuming/showing the flash message (otherwise, you want to clear any flash
			// message currently displayed.)
			if(typeof msg === 'string'){
				type = (typeof type === 'string') ? type : 'info';
				flash.push({msg:msg,type:type});
			}

			// now 'redirect'
			if(typeof url === 'string') $location.url(url);
		},
		clear:function(){
			$rootScope.$broadcast(events.clear);
		}
	}
}]).
component('redirectorComponent', {
	templateUrl: '/compiled/templates/redirector/redirector.template.html',
	controller: ['$scope', function RedirectorController($scope){
		var self = this;
		this.msg = '';
		this.type = '';

		this.isAcceptableType = function(type){
			return typeof type === 'string' && (type === 'info' || type === 'danger' || type === 'warning' || type === 'success');
		}

		this.clearAll = function(){
			self.msg = '';
			self.type = '';
		}

		$scope.$on(events.globalFeedback, function(e, payload){
			self.clearAll();
			if(self.isAcceptableType(payload.type)) self.type = payload.type;
			if(typeof payload.msg === 'string') self.msg = payload.msg;
		});

		$scope.$on(events.clear, function(){
			self.clearAll();
		});
	}]
});