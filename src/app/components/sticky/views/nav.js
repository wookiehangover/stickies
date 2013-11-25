define(function(require, exports, module){
  'use strict';

  var $ = require('jquery');
  var _ = require('lodash');
  var Backbone = require('backbone');
  var itemTemplate = require('../templates/nav_item');
  var dependencyNeedle = require('mixins/dependency_needle');

  var NavView = Backbone.View.extend({

    dependencies: function(){
      return ['collection', 'controller'];
    },

    initialize: function(options){
      this.injectDependencies(options, this.dependencies());
      this.listenTo(this.collection, 'add', this.addItem);
      this.listenTo(this.collection, 'remove', this.render);
    },

    events: {
      'click a': 'spawn'
    },

    spawn: function(e){
      var id = $(e.currentTarget).data('id');
      var model = this.collection.get(id);

      if( model ){
        this.controller.spawn(model.toJSON());
        return false;
      }
    },

    render: function(){
      var items = this.collection.map(this.renderItem, this);
      this.$el.html(items);
    },

    renderItem: function(item){
      return itemTemplate(item);
    },

    addItem: function(item){
      this.$el.append(this.renderItem(item));
    }
  });

  _.extend(NavView.prototype, dependencyNeedle);

  module.exports = NavView;
});
