define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var Backbone = require('backbone');

  var StickyModel = require('./models/sticky');
  var EditorView = require('./views/editor');

  module.exports = Backbone.View.extend({
    el: $('body'),

    initialize: function(){
      this.model = new StickyModel( window.stickyModel || {} );
      this.editor = new EditorView({ model: this.model });
      this.render();

      $(window).resize(this.updateBounds.bind(this));
    },

    render: function(){
      this.editor.render();
    },

    events: {
      'click .close': 'close',
      'click [data-action="toggle-menu"]': 'toggleMenu',
      'click [data-action="save"]': 'save',
      'click [data-action="new"]': 'spawn'
    },

    updateBounds: function(e){
      console.log(chrome.app.window.current());
    },

    spawn: function(e){
      e.preventDefault();

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
      e.preventDefault();
      this.model.save({
        content: this.editor.getContent()
      }, { target: 'sync' }).done(function(){
        //TODO success message?
      });
    },

    close: function(e){
      e.preventDefault();
      this.model.save({
        content: this.editor.getContent()
      }, { target: 'sync' }).done(function(){
        window.close();
      });
    },

    toggleMenu: function(e){
      e.preventDefault();
      this.$('.effeckt-off-screen-nav').toggleClass('effeckt-off-screen-nav-show');
    }
  });


});
