(function($, angular){
  var http, alerts, errorHandler;

  function TagListController($newHttp, newAlerts, fnErrorHandler){
    $http = $newHttp;
    alerts = newAlerts;
    errorHandler = fnErrorHandler;
    this.url = '/api/tags';

    this.fetch();
  }

  angular.extend(TagListController.prototype, {
    
    fetch: function(){
      var self = this;
      alerts.clear();
      $http.get(this.url).then(function(response){
        self.tags = response.data;
      }).catch(function(err){
        console.log("error fetching tags from " + self.url + ": " + err);
        errorHandler(err);
      });
    },
    create:function(){
      var self = this;

      if(!this.newName){
        alerts.warning("name field required");
        return;
      }

      alerts.clear();
      $http.post(this.url, {name: this.newName}).then(function(response){
        console.log("Got response: " + JSON.stringify(response.data));
        self.tags.push(response.data);
        self.newName = "";
      }).catch(function(response){
        console.log("Got err: " + response.data);
        errorHandler(response.data);
      });
    },
    onNewTagClick:function(e){
      this.create();
    },
    onNewTagKeypress:function(e){
      alerts.clear();
      if(e.which === 13){
        this.create();
      }
    },
    onTagDelete:function(e){
      var id = $(e.target).find("input[name='id']")[0].value,
          self = this;

      alerts.clear();
      $http.delete(this.url + "/" + id).then(function(response){
        var newTags = [];
        self.tags.forEach(function(tag){
          if(tag.id != id) newTags.push(tag);
        });

        self.tags = newTags;
      }).catch(function(response){
        errorHandler(response.data);
      });
    },
    onTagUpdate:function(e){
      
      var name = $(e.target).find("input[name='name']")[0].value,
          id = $(e.target).find("input[name='id']")[0].value,
          self = this;

      $http.put(this.url + "/" + id, {name: name, id: id}).then(function(response){
        alerts.info("successfully updated tag " + response.data.id);
      }).catch(function(response){
        errorHandler(response.data);
      });
    }
  });

  angular.module('tagList').component('tagList', {
    templateUrl: "/compiled/templates/tags/tag-list.template.html",
    controller: ['$http', 'alerts', 'errorHandlerFactory', TagListController]
  });
})($, angular);
