define(function(require, exports, module){
  'use strict';

  var $ = require('jquery');
  var _ = require('lodash');
  var Backbone = require('backbone');
  var dependencyNeedle = require('mixins/dependency_needle');

  var ModalView = Backbone.View.extend({

    className: 'modal-content',

    dependencies: function(){
      return ['template', 'model'];
    },

    initialize: function(options){
      this.injectDependencies(options, this.dependencies());
      this.render();

      this.onConfirm = options.onConfirm || function(){};
      this.onDeny = options.onDeny || function(){};
    },

    render: function(){
      this.$el.html( this.template(this.model) );
      this.$el.appendTo('#modal');
    },

    events: {
      'click [data-action]': function(e){
        var action = $(e.currentTarget).attr('data-action');
        if( action === 'confirm' ){
          this.onConfirm();
          return false;
        }

        if( action === 'deny' ){
          this.onDeny();
          return false;
        }
      }
    }
  });

  _.extend(ModalView.prototype, dependencyNeedle);

  module.exports = ModalView;
});
