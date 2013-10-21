define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');
  var Backbone = require('backbone');
  var dependencyNeedle = require('mixins/dependencyNeedle');

  var StickyModel = require('./models/sticky');
  var EditorView = require('./views/editor');

  var StickyController = Backbone.View.extend({

    controllerName: 'StickyController',

    initialize: function(){
      this.model = new StickyModel( window.stickyModel || {} );
      this.editor = new EditorView({ model: this.model });
      this.render();
    },

    render: function(){
      this.editor.render();
    },

    events: {
      'click .close': 'close'
    },

    close: function(e){
      e.preventDefault();
      this.model.save(null, { target: 'sync' }).done(function(){
        window.close();
      });
    }

  });

  _.extend(EditorView.prototype, dependencyNeedle);

  module.exports = StickyController;

});

