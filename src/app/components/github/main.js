/*globals chrome: true */
define(function(require, exports, module){
  'use strict';

  var _ = require('lodash');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var auth = require('./auth');
  var googleStorageSync = require('mixins/google-storage-sync');

  var API_ROOT = 'https://api.github.com';

  var GithubAuth = Backbone.Model.extend({

    constructor: function(){
      this.gist = new Backbone.Model();
      Backbone.Model.apply(this, arguments);
    },

    initialize: function(){
      if( !this.id ){
        this.set('id', 'github');
      }

      this.on('change:token', function(model){
        $.ajaxSetup({
          beforeSend: function(req) {
            req.setRequestHeader('Authorization', 'Bearer '+ model.get('token'));
          }
        });
        model.save();
      });

      this.listenTo(this.gist, 'change', function(){
        this.save( this.toJSON() );
      }, this);

      this.loaded = this.fetch();
    },

    toJSON: function(){
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
      json.gist = this.gist.toJSON();
      return json;
    },

    parse: function(resp){
      console.log(resp);
      if( resp.gist ){
        this.gist.set(resp.gist);
      }
      return _.omit(resp, 'gist');
    },

    fetchToken: function(force){
      var dfd = $.Deferred();
      var token = this.get('token');
      var self = this;
      if( !!force && token ){
        dfd.resolve(token);
      } else {
        auth.getToken(true, function(err, accessToken){
          if( err ){
            return dfd.reject(err);
          }

          self.set({ token: accessToken });
          dfd.resolve(accessToken);
        });
      }
      return dfd.promise();
    },

    destroyToken: function(){
      auth.removeCachedToken(this.get('token'));
    },

    syncGist: function(gistData, options){
      if( _.size(this.gist.attributes) === 0 ){
        return this.createGist(gistData, options);
      } else {
        return this.updateGist(gistData, options);
      }
    },

    updateGist: function(data, options){
      options = options || {};

      var id = this.gist.get('id');

      if( !id ){
        return new $.Deferred().reject('No id');
      }

      var self = this;
      var params = {
        type: 'post',
        url: API_ROOT + '/gists/'+ this.gist.get('id'),
        data: JSON.stringify( _.omit(data, 'public') ),
        dataType: 'json',
        contentType: 'application/json',
        success: function(data){
          self.gist.set(data);
        }
      };

      return $.ajax(_.extend(params, options));
    },

    createGist: function(data, options){
      options = options || {};
      var self = this;
      var params = {
        type: 'post',
        url: API_ROOT + '/gists',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function(data){
          self.gist.set(data);
        }
      };

      return $.ajax(_.extend(params, options));
    }
  });

  _.extend(GithubAuth.prototype, googleStorageSync);

  module.exports = GithubAuth;

});
