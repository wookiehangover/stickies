define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');
  var Backbone = require('backbone');
  var marked = require('marked');
  var dependencyNeedle = require('mixins/dependencyNeedle');

  var PreviewView = Backbone.View.extend({
    el: $('.preview'),

    dependencies: function(){
      return ['model'];
    },

    initialize: function(options){
      this.injectDependencies(options, this.dependencies());

      marked.setOptions({
        gfm: true,
        tables: true,
        breaks: true,
        smartLists: true
      });
    },

    render: function(){
      this.$el.html( marked(this.model.get('content')) );
    }
  });

  _.extend(PreviewView.prototype, dependencyNeedle);

  module.exports = PreviewView;

});
