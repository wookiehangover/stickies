/*globals chrome: true*/
define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');
  var keytar = require('../lib/keytar');
  var Backbone = require('backbone');

  var savedMessage = (window.chrome && chrome.i18n) ?
    chrome.i18n.getMessage('saved') : 'Saved';

  var MainViewModel = Backbone.View.extend({

    initialize: function(){
      this.$nav = this.$('.effeckt-off-screen-nav');
      this.$loader = this.$('#loader');

      $(window).keydown(this.handleKeydown.bind(this));

      this.updateBackgroundColor();
      this.updateTextColor();

      if( this.github.disabled ){
        this.$('.export-to-github').remove();
      }

      this.listenTo(this.model, 'change:bg_color', this.updateBackgroundColor);
      this.listenTo(this.model, 'change:text_color', this.updateTextColor);
    },

    render: function(){
      this.editor.render();
    },

    updateBackgroundColor: function(){
      var classList = this.$el.attr('class');
      if( !classList ){
        return;
      }
      this.$el
        .removeClass()
        .addClass( classList.replace(/\S+-bg/, this.model.get('bg_color')) );
    },

    updateTextColor: function(){
      var classList = this.$el.attr('class');
      if( !classList ){
        return;
      }
      this.$el
        .removeClass()
        .addClass( classList.replace(/\S+-text/, this.model.get('text_color')) );
    },

    showLoader: function(message){
      message = message || savedMessage;
      this.$loader.find('span').text(message);
      this.$loader.fadeIn();
    },

    hideLoader: function(wait){
      var self = this;
      _.delay(function(){
        self.$loader.fadeOut();
      }, wait || 800);
    },

    dismissMenu: function(){
      this.$nav.removeClass('effeckt-off-screen-nav-show');
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
      'click [data-action="export"]': 'handleExport',
      'click [data-action="email"]': 'handleEmail'
    },

    handleEmail: function(e){
      if( window.chrome && window.chrome.storage ){
        this.email();
        return false;
      } else {
        $(e.currentTarget).attr('href', this.model.toEmail());
      }
    },

    handleExport: function(e){
      this.export();
      return false;
    },

    handleDestroy: function(e){
      this.destroy();
      return false;
    },

    handleSpawn: function(e){
      this.spawn();
      return false;
    },

    handleSave: function(e){
      this.save();
      this.hideActiveView();
      return false;
    },

    close: function(e){
      if( e ){
        e.preventDefault();
        e.stopPropagation();
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
      this.showView(this.preview);
      return false;
    },

    hidePreview: function(e){
      this.hideActiveView();
      return false;
    },

    toggleSettings: function(){
      if( this.$el.hasClass('settings-active') ){
        this.hideActiveView();
      } else {
        this.showView(this.settings);
      }
      return false;
    }
  });

  _.extend(MainViewModel.prototype, keytar);

  module.exports = MainViewModel;

});
