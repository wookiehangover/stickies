define(function(require, exports, module){
  'use strict';

  var _ = require('lodash');
  var Backbone = require('backbone');

  module.exports = Backbone.Router.extend({
    initialize: function(options){
      if( !options.controller ){
        throw new Error('Requires an controller instance');
      }
      this.controller = options.controller;
    },

    routes: {
      ':slug/preview' : 'showPreview',
      ':slug/settings': 'showSettings',
      ':slug'     : 'showEditor',
    },

    navigate: function(fragment, options){
      if( _.isArray(fragment) ){
        fragment.unshift(this.controller.model.get('slug'));
        fragment = fragment.join('/');
      }
      return Backbone.Router.prototype.navigate.call(this, fragment, options);
    },

    showEditor: function(slug){
      if( this.controller.activeView ){
        this.controller.hideActiveView();
      } else {
        this.controller.render();
      }
    },

    showPreview: function(){
      this.controller.showView(this.controller.preview);
    },

    showSettings: function(){
      this.controller.showView(this.controller.settings);
    }
  });
});
