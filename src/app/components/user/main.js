define(function(require, exports, module){
  'use strict';

  var $ = require('jquery');
  var _ = require('lodash');
  var config = require('config');
  var Backbone = require('backbone');
  var PouchDB = require('pouchdb');

  var localstorageSync = require('mixins/localstorage_sync');

  module.exports = Backbone.Model.extend({
    constructor: function(){
      this.cookie = new Backbone.Model();
      return Backbone.Model.apply(this, arguments);
    },

    sync: localstorageSync.sync,

    initialize: function(){
      if( !this.id ){
        this.set('id', 'user');
      }

      this.listenTo(this.cookie, 'change', this.createStore);

      this.fetch().done(_.bind(function(data){
        this.ingest(data);
        this.createStore();
      }, this));
    },

    createStore: function(){
      if( _.size(this.cookie.attributes) && this.get('database') ){
        var name = this.get('database');
        this.db = new PouchDB( config.couch.host + name + '_stickies', {
          headers: { 'x-auth': JSON.stringify(this.cookie.toJSON()) }
        });
      }
    },

    logout: function(){
      this.cookie.clear();
      this.clear();
      this.save({ id: 'user' });
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

    authenticate: function(username, password, options){
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
        url: config.API_ROOT + '/auth'
      }, options);

      var xhr = $.ajax(params);
      xhr.then(_.bind(function(data){
        this.ingest(data);
      }, this), function(jqXhr, statusText){
        console.log('Signup Error');
      });

      return xhr;
    }

  });

});
