define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');
  var Backbone = require('backbone');
  var dependencyNeedle = require('mixins/dependencyNeedle');

  var EditorView = Backbone.View.extend({
    el: $('.content'),

    dependencies: function(){
      return ['model'];
    },

    initialize: function(options){
      this.injectDependencies(options, this.dependencies());
    },

    render: function(){
      this.$el.text( this.model.get('content') );
    },

    events: {
      'keydown': 'keydown',
      'blur': 'storeContent'
    },

    storeContent: function(){
      this.model.throttledSave({ content: this.getContent() });
    },

    keydown: function(e){
      // console.log(e.which)
      if( e.which === 9 ){ // Tab Key
        // TODO pull the tab chat from user settings
        document.execCommand('insertText', false, '\t');
        return false;
      }
      this.model.debouncedSave({ content: this.getContent() });
    },

    getContent: function(){
      var content = this.$el.html();

      content = content.replace(/<br>/gi, '\n')
        .replace(/<div>/gm, '\n')
        .replace(/<(?:.|\n)*?>/gm, '')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>');

      return content;
    }
  });

  _.extend(EditorView.prototype, dependencyNeedle);

  module.exports = EditorView;
});
