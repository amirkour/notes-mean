// Register `phoneList` component, along with its associated controller and template
angular.
  module('tagList').
  component('tagList', {
    template: "<div>hi world - tag list</div>", // todo - templateUrl?  template? where to get this?
    controller: ['$http',
      function TagListController($http) {
        var self = this;
        // self.orderProp = 'age';

        // $http.get('phones/phones.json').then(function(response) {
        //   self.phones = response.data;
        // });
      }
    ]
  });
  