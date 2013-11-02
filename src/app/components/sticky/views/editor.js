define(function(require, exports, module){

  'use strict';
  var _ = require('lodash');
  var Backbone = require('backbone');
  var dependencyNeedle = require('mixins/dependency_needle');

  var EditorView = Backbone.View.extend({

    dependencies: function(){
      return ['model'];
    },

    initialize: function(options){
      this.injectDependencies(options, this.dependencies());
    },

    render: function(){
      this.$el.html('').val( this.model.get('content') );
      this.$el.focus();
    },

    events: {
      'keydown': 'keydown',
      'blur': 'storeContent',
      'change': 'storeContent'
    },

    storeContent: function(){
      this.model.throttledSave({ content: this.getContent() }, { silent: true });
    },

    keydown: function(e){
      if( e.which === 9 ){ // Tab Key
        // TODO pull the tab char from user settings
        document.execCommand('insertText', false, '\t');
        return false;
      }

      this.model.debouncedSave({ content: this.getContent() });
    },

    getContent: function(){
      return this.$el.val();
    }
  });

  _.extend(EditorView.prototype, dependencyNeedle);

  module.exports = EditorView;
});
