define(function(require, exports, module){

  'use strict';
  var _ = require('lodash');
  var Backbone = require('backbone');
  var dependencyNeedle = require('mixins/dependency_needle');
  var conflictTemplate = require('../templates/conflict_modal');
  var EditorView = Backbone.View.extend({

    dependencies: function(){
      return ['model', 'controller'];
    },

    initialize: function(options){
      this.injectDependencies(options, this.dependencies());
      this.listenTo(this.model, 'conflict', this.resolveConflict);
    },

    render: function(){
      this.$el.html('').val( this.model.get('content') );
      this.$el.focus();
    },

    resolveConflict: function(model, options){
      if( options.target === 'sync' ){

        console.log('sync');
      }

      this.controller.showModal({
        template: conflictTemplate,

        model: new Backbone.Model({
          title: 'Oh no! We\'ve encountered a conflict.',
          confirm: 'Accept Changes',
          deny: 'Ignore Changes'
        }),

        onConfirm: _.bind(function(){
          var controller = this.controller;

          controller.user.db.get(model.id, function(err, resp){
            console.log(_.omit(resp, '_rev', '_id'));
            model.save(_.omit(resp, '_rev', '_id'));
            controller.render();
            controller.dismissModal();
          });
        }, this),

        onDeny: _.bind(function(){
          var cached = this.model.omit('_rev');
          var controller = this.controller;
          var model = this.model;

          model.fetch({
            target: 'sync',
            targetDB: controller.user.db
          }).done(function(){
            controller.render();
            model.save(cached,{
              target: 'sync',
              targetDB: controller.user.db
            });
            controller.render();
            controller.dismissModal();
          });
        }, this)
      });
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
