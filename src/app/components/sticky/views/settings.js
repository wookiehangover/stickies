define(function(require, exports, module){

  'use strict';
  var _ = require('lodash');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var dependencyNeedle = require('mixins/dependency_needle');

  var SettingsView = Backbone.View.extend({

    dependencies: function(){
      return ['model'];
    },

    name: 'settings',

    initialize: function(options){
      this.injectDependencies(options, this.dependencies());
    },

    events: {
      'click .background-color li': 'changeBackground',
      'click input[name="text-color"]': 'changeText'
    },

    changeBackground: function(e){
      var $elem = $(e.currentTarget);
      if( $elem.hasClass('active') ){
        return;
      }

      var color = $elem.attr('class');
      this.$('.background-color .active').removeClass('active');
      $elem.addClass('active');

      this.model.set('bg_color', color);
      this.updatePreview(color, 'background');
    },

    updatePreview: function(color, type){
      var classRegex = type === 'text' ? /\S+-text/ : /\S+-bg/;
      var previewClass = this.$('.color-preview').attr('class');
      this.$('.color-preview')
        .removeClass()
        .addClass( previewClass.replace(classRegex, color) );
    },

    changeText: function(e){
      var color = $(e.currentTarget).val();
      this.model.set('text_color', color);
      this.updatePreview(color, 'text');
    }

  });

  _.extend(SettingsView.prototype, dependencyNeedle);

  module.exports = SettingsView;

});

