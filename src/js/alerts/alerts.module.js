var types = ['info','danger','warning','success'],
	events = {
		clear: 'events.alerts.clear',
		msg: 'events.alerts.msg'
	}


function getTypeHandlerFor(type, $rootScope){
	return function(msg){
		$rootScope.$broadcast(events.msg, {type:type,msg:msg});
	}
}

function isAcceptable(type){
	for(var i = 0; i < types.length; i++){
		if(types[i] === type) return true;
	}

	return false;
}

angular.module('alerts', []).
factory('alerts', ['$rootScope', '$log', function($rootScope, $log){

	var factory = {
		clear: function(){
			$rootScope.$broadcast(events.clear);
		},
		show: function(msg,type){
			if(!isAcceptable(type)) type = 'info';
			if(typeof this[type] === 'function')
				this[type].call(this,msg);
			else
				$log.warn("invalid alert type: " + type);
		}
	};

	types.forEach(function(type){
		factory[type] = getTypeHandlerFor(type,$rootScope);
	});

	return factory;
}]).
component('alertsDiv', {
	template: "<div class='ng-hide alert alert-{{$ctrl.type}}' ng-show='$ctrl.msg'>{{$ctrl.msg}}</div>",
	controller: ['$scope', function($scope){
		var self = this;
		this.msg = '';
		this.type = '';

		this.clearAll = function(){ 
			self.msg = ''; 
			self.type = ''; 
		}

		$scope.$on(events.clear, function(){ 
			self.clearAll(); 
		});

		$scope.$on(events.msg, function(e, payload){
			self.clearAll();
			if(isAcceptable(payload.type)) self.type = payload.type;
			if(typeof payload.msg === 'string') self.msg = payload.msg;
		});
	}]
});
