(function($,angular){
  var http;

  function NoteListController($http){
    http = $http;
    this.url = '/api/notes';

  }

  $.extend(NoteListController.prototype, {
  });

  angular.module('noteList').component('noteList', {
    templateUrl: "/compiled/templates/notes/note-list.template.html",
    controller: ['$http', NoteListController]
  });
})($,angular);
