define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');
  var Backbone = require('backbone');

  module.exports = Backbone.View.extend({

    initialize: function(){
      this.render();
      $(window).keydown(this.keydown.bind(this));

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

    keydown: function(e){
      // console.log(e.which);

      if( e.which === 27 ){ // esc
        this.hideActiveView();
        return false;
      }

      if( e.metaKey === false ){
        return;
      }

      if( e.which === 87 ){ // command-w
        this.close();
        return false;
      }

      if( e.which === 68 && e.shiftKey ){ // Command-d
        this.destroy();
        return false;
      }

      if( e.which === 80 ){ // Command-p
        if( this.$el.hasClass('preview-active') ){
          this.hideActiveView();
        } else {
          this.showView(this.preview);
        }
        return false;
      }

      if( e.which === 188 ){ // Command-,
        this.toggleSettings();
        return false;
      }

      if( e.which === 78 ){ // Command-n
        var data = {};
        if( e.shiftKey ){
          data = _.omit(this.model.toJSON(), 'id');
        }
        this.spawn(data);
        return false;
      }

      if( e.which === 83 ){ // Command-s
        this.save();
        return false;
      }

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

});
