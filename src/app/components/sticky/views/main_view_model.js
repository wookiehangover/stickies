define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');
  var keytar = require('./keytar');
  var Backbone = require('backbone');

  var MainViewModel = Backbone.View.extend({

    initialize: function(){
      this.render();
      $(window).keydown(this.handleKeydown.bind(this));

      this.updateBackgroundColor();
      this.updateTextColor();

      this.listenTo(this.model, 'change:bg_color', this.updateBackgroundColor);
      this.listenTo(this.model, 'change:text_color', this.updateTextColor);
    },

    updateBackgroundColor: function(){
      var classList = this.$el.attr('class');
      this.$el
        .removeClass()
        .addClass( classList.replace(/\S+-bg/, this.model.get('bg_color')) );
    },

    updateTextColor: function(){
      var classList = this.$el.attr('class');
      this.$el
        .removeClass()
        .addClass( classList.replace(/\S+-text/, this.model.get('text_color')) );
    },

    render: function(){
      this.editor.render();
    },

    events: {
      'click .close': 'close',
      'click [data-action="toggle-menu"]': 'toggleMenu',
      'click [data-action="save"]': 'handleSave',
      'click [data-action="new"]': 'handleSpawn',
      'click [data-action="destroy"]': 'handleDestroy',
      'click [data-action="preview"]': 'showPreview',
      'click [data-action="edit"]': 'hidePreview',
      'click [data-action="settings"]': 'toggleSettings',
      'click [data-action="export"]': 'handleExport'
    },

    handleExport: function(e){
      e.preventDefault();
      this.export();
    },

    handleDestroy: function(e){
      e.preventDefault();
      this.destroy();
    },

    handleSpawn: function(e){
      e.preventDefault();
      this.spawn();
    },

    handleSave: function(e){
      e.preventDefault();
      this.save();
    },

    close: function(e){
      if( e ){
        e.preventDefault();
      }
      this.model.save({
        content: this.editor.getContent()
      }, { target: 'sync' }).done(function(){
        window.close();
      });
    },

    toggleMenu: function(e){
      e.preventDefault();
      this.$nav.toggleClass('effeckt-off-screen-nav-show');
    },

    showPreview: function(e){
      e.preventDefault();
      this.showView(this.preview);
    },

    hidePreview: function(e){
      e.preventDefault();
      this.hideActiveView();
    },

    toggleSettings: function(){
      if( this.$el.hasClass('settings-active') ){
        this.hideActiveView();
      } else {
        this.showView(this.settings);
      }
    }
  });

  _.extend(MainViewModel.prototype, keytar);

  module.exports = MainViewModel;

});
