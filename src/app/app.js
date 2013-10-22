define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');
  var Backbone = require('backbone');

  var StickyModel = require('./models/sticky');
  var EditorView = require('./views/editor');

  module.exports = Backbone.View.extend({
    el: $('body'),

    initialize: function(){
      this.model = new StickyModel( window.stickyModel || {} );
      this.editor = new EditorView({ model: this.model });
      this.$nav = this.$('.effeckt-off-screen-nav');
      this.$loader = this.$('#loader');
      this.render();

      $(window).keydown(this.keydown.bind(this));
    },

    render: function(){
      this.editor.render();
    },

    events: {
      'click .close': 'close',
      'click [data-action="toggle-menu"]': 'toggleMenu',
      'click [data-action="save"]': 'save',
      'click [data-action="new"]': 'spawn',
      'click [data-action="destroy"]': 'destroy'
    },

    keydown: function(e){
      // console.log(e)
      // if( e.which === 87 && e.metakey ){ // command-w
      //   this.close();
      //   return false;
      // }

      if( e.which === 78 && e.metakey ){ // command-n
        this.spawn();
        return false;
      }

      if( e.which === 83 && e.metaKey ){ // Command-s
        this.save();
        return false;
      }
    },

    destroy: function(e){
      e.preventDefault();

      // TODO
      // trigger a modal to confirm

      this.model.destroy({ target: 'sync' }).done(function(){
        window.close();
      });
    },

    spawn: function(e){
      if( e ){
        e.preventDefault();
      }

      var model = new StickyModel();

      chrome.app.window.create('index.html', {
        id: model.id,
        width: 460,
        height: 400,
        minHeight: 12,
        minWidth: 216,
        frame: 'none'
      }, function(child){
        child.contentWindow.stickModel = model.toJSON();
      });
    },

    save: function(e){
      if( e ){
        e.preventDefault();
      }

      this.showLoader();
      var data = {
        content: this.editor.getContent()
      };

      this.model.save(data, { target: 'sync' }).then(function(){
        this.dismissMenu();
        this.hideLoader();
      }.bind(this));
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

    showLoader: function(message){
      if( message ){
        this.$loader.text(message);
      }
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

    toggleMenu: function(e){
      e.preventDefault();
      this.$nav.toggleClass('effeckt-off-screen-nav-show');
    }
  });


});
