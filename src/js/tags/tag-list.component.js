(function($,angular){
  var http;

  function TagListController($http){
    http = $http;
    this.url = '/api/tags';
    this.error = null;
    this.info = null;

    this.fetch();
  }

  $.extend(TagListController.prototype, {
    onInfo:function(info){
      if(typeof info === 'string')
        this.info = info;
    },
    onError:function(err){
      if(!err){
        this.error = "an unknown error occurred";
        return;
      }

      console.log("showing error: " + JSON.stringify(err));
      if(typeof err === 'string')
        this.error = err;
      else if(typeof err.error === 'string')
        this.error = err.error
      else if(err.errors && err.errors.length > 0){
        var firstError = err.errors[0];
        if(typeof firstError.message === 'string')
          this.error = firstError.message;
        else
          this.error = "Failed to retrieve first error message - an unknown error has occurred";
      }else if(typeof err.message === 'string')
        this.error = err.message;
      else
        this.error = 'failed to parse error';
    },
    clearFeedback:function(){
      this.error = null;
      this.info = null;
    },
    fetch: function(){
      var self = this;
      this.clearFeedback();
      http.get(this.url).then(function(response){
        self.tags = response.data;
      }).catch(function(err){
        console.log("error fetching tags from " + self.url + ": " + err);
        self.onError(err);
      });
    },
    create:function(){
      var self = this;

      if(!this.newName){
        this.onError("name field required");
        return;
      }

      this.clearFeedback();
      http.post(this.url, {name: this.newName}).then(function(response){
        console.log("Got response: " + JSON.stringify(response.data));
        self.tags.push(response.data);
        self.newName = "";
      }).catch(function(response){
        console.log("Got err: " + response.data);
        self.onError(response.data);
      });
    },
    onNewTagClick:function(e){
      this.create();
    },
    onNewTagKeypress:function(e){
      this.clearFeedback();
      if(e.which === 13){
        this.create();
      }
    },
    onTagDelete:function(e){
      var id = $(e.target).find("input[name='id']")[0].value,
          self = this;

      this.clearFeedback();
      http.delete(this.url + "/" + id).then(function(response){
        var newTags = [];
        self.tags.forEach(function(tag){
          if(tag.id != id) newTags.push(tag);
        });

        self.tags = newTags;
      }).catch(function(response){
        self.onError(response.data);
      });
    },
    onTagUpdate:function(e){
      
      var name = $(e.target).find("input[name='name']")[0].value,
          id = $(e.target).find("input[name='id']")[0].value,
          self = this;

      http.put(this.url + "/" + id, {name: name, id: id}).then(function(response){
        self.onInfo("successfully updated tag " + id);
      }).catch(function(response){
        self.onError(response.data);
      });
    }
  });

  angular.module('tagList').component('tagList', {
    templateUrl: "/compiled/templates/tags/tag-list.template.html",
    controller: ['$http', TagListController]
  });
})($,angular);
