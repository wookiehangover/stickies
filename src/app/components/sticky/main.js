/*globals chrome: true*/
define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');

  var StickyModel = require('./models/sticky');
  var GithubAuth = require('components/github/main');

  var ViewModel = require('./views/main_view_model');
  var EditorView = require('./views/editor');
  var PreviewView = require('./views/preview');
  var SettingsView = require('./views/settings');

  module.exports = ViewModel.extend({
    el: $('.sticky'),

    initialize: function(){
      this.model = new StickyModel( window.stickyModel || {} );
      this.github = new GithubAuth();

      this.createSubViews();

      this.$nav = this.$('.effeckt-off-screen-nav');
      this.$loader = this.$('#loader');

      ViewModel.prototype.initialize.apply(this, arguments);
    },

    createSubViews: function(){
      this.editor = new EditorView({
        el: this.$('.content'),
        model: this.model
      });

      this.preview = new PreviewView({
        el: this.$('.preview'),
        model: this.model
      });

      this.settings = new SettingsView({
        el: this.$('.settings'),
        model: this.model
      });
    },

    showView: function(view){
      this.save({ loader: false }).done(function(){
        this.hideActiveView();
        this.dismissMenu();
        this.activeView = view;
        this.$el.addClass(view.name + '-active');
        view.render();
        view.$el.fadeIn();
      }.bind(this));
    },

    hideActiveView: function(){
      if( this.activeView ){
        this.$el.removeClass(this.activeView.name + '-active');
        this.activeView.$el.fadeOut();
        this.editor.render();
      }
    },

    export: function(){
      var self = this;
      this.showLoader('Saving Gist');

      this.github.fetchToken().then(function(){
        self.github.syncGist(self.model.toGIST())
          .then(function(data){
            console.log(data);
            self.hideLoader(200);
            window.open(data.html_url);
          });
      });
    },

    destroy: function(){
      // TODO
      // trigger a modal to confirm
      this.model.destroy({ target: 'sync' }).done(function(){
        window.close();
      });
    },

    spawn: function(data, options){
      var model = new StickyModel(data || {});

      options = _.defaults(options || {}, {
        id: model.id,
        width: 460,
        height: 400,
        minHeight: 12,
        minWidth: 216,
        frame: 'none'
      });

      chrome.app.window.create('sticky.html', options, function(child){
        child.contentWindow.stickyModel = model.toJSON();
      });
    },

    save: function(options){
      options = _.defaults(options || {}, {
        target: 'sync',
        loader: true
      });

      if( options.loader ){
        this.showLoader();
      }

      var data = {
        content: this.editor.getContent()
      };

      return this.model.save(data, options).then(function(){
        this.dismissMenu();
        this.hideLoader();
      }.bind(this));
    },

    close: function(){
      this.save().then(function(){
        window.close();
      });
    },

    showLoader: function(message){
      message = message || chrome.i18n.getMessage('savedMessage');
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
    }

  });


});
