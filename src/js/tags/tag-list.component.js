// Register `phoneList` component, along with its associated controller and template
angular.
module('tagList').
component('tagList', {
  templateUrl: "/compiled/templates/tags/tag-list.template.html",
  controller: [
    '$http',
    function TagListController($http) {
      var self = this;

      $http.get('/api/tags').then(function(response) {
        self.tags = response.data;
      }).catch(function(err){
        console.log("err fetching tags: " + err);
      });
    }
  ]
});
  