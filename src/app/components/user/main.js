define(function(require, exports, module){
  'use strict';

  var $ = require('jquery');
  var _ = require('lodash');
  var config = require('config');
  var Backbone = require('backbone');
  var PouchDB = require('pouchdb');

  module.exports = Backbone.Model.extend({
    constructor: function(){
      this.cookie = new Backbone.Model();
      return Backbone.Model.apply(this, arguments);
    },

    initialize: function(){
      this.on('change', function(model){
        this.createStore();
        localStorage.setItem('user', JSON.stringify(model));
      }, this);

      var cachedUser = localStorage.getItem('user');
      if( cachedUser ){
        this.ingest(JSON.parse(cachedUser));
      }
    },

    createStore: function(){
      var name = this.get('database');
      this.db = new PouchDB( config.couch.host + name + '_stickies', {
        headers: { 'x-auth': JSON.stringify(this.cookie.toJSON()) }
      });
    },

    parse: function(data){
      if( data.cookie ){
        this.cookie.set(data.cookie);
      }

      return _.omit(data, 'cookie');
    },

    toJSON: function(){
      var data = _.clone(this.attributes);
      if( this.cookie ){
        data.cookie = this.cookie.toJSON();
      }
      return data;
    },

    ingest: function(data, options){
      return this.set(this.parse(data), options);
    },

    authRequest: function(type, username, password, options){
      var data = {
        auth: {
          name: username,
          password: password
        }
      };
      var params = _.extend({
        type: 'post',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        url: config.API_ROOT + '/' + type
      }, options);

      var xhr = $.ajax(params);
      xhr.then(_.bind(function(data){
        this.ingest(data);
      }, this), function(jqXhr, statusText){
        console.log('Signup Error');
      });

      return xhr;
    },

    signup: function(username, password, options){
      this.authRequest('signup', username, password, options);
    },

    login: function(username, password, options){
      var trigger = this.trigger;
      this.authRequest('login', username, password, options).done(function(){
        trigger('replicate');
      });
    },
  });

});
