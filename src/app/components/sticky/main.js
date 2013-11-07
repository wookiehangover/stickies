/*globals chrome: true*/
define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');

  var GithubAuth = require('components/github/main');
  var UserModel = require('components/user/main');
  var StickyModel = require('./models/sticky');

  var ViewModel = require('./views/main_view_model');
  var EditorView = require('./views/editor');
  var PreviewView = require('./views/preview');
  var SettingsView = require('./views/settings');

  module.exports = ViewModel.extend({
    el: $('.sticky'),

    initialize: function(options){
      this.attachDependencies(options);
      this.createSubViews();
      ViewModel.prototype.initialize.apply(this, arguments);
    },

    attachDependencies: function(){
      if( !this.model ){
        this.model = new StickyModel( window.stickyModel || {} );
      }
      this.github = new GithubAuth();
      this.user = new UserModel();

      this.listenTo(this.user, 'replicate', function(){
        if( this.db && this.user.db ){
          this.db.replicate.from(this.user.db, {
            complete: function(){
              console.log('upstream replication complete');
            }
          });
        }
      }, this);
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
      this.save({ loader: false }).done(_.bind(function(){
        this.hideActiveView();
        this.dismissMenu();
        this.activeView = view;
        this.$el.addClass(view.name + '-active');
        view.render();
        view.$el.fadeIn();
      }, this));
    },

    hideActiveView: function(){
      if( this.activeView ){
        this.editor.render();
        this.$el.removeClass(this.activeView.name + '-active');
        this.activeView.$el.fadeOut();
      }
    },

    email: function(){
      window.open( this.model.toEmail() );
    },

    export: function(){
      var self = this;
      this.showLoader('Saving Gist');

      this.github.auth()
        .then(function(){
          self.github.syncGist(self.model.toGIST())
            .then(function(data){
              console.log(data);
              self.hideLoader(200);
              window.open(data.html_url);
            });
        }, function(){
          this.hideLoader();
        });
    },

    destroy: function(){
      // TODO
      // trigger a modal to confirm
      this.model.destroy({ target: 'sync' })
      // .done(function(){
      //   window.close();
      // });
    },

    spawn: function(data, options){
      var model = new StickyModel(data || {});

      if( !chrome ){
        throw new Error('Chrome App only :(');
      }

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

    getStore: function(){
      var db = this.user.db;
      return db ? db : false;
    },

    save: function(options){
      options = _.defaults(options || {}, {
        target: 'sync',
        targetDB: this.getStore(),
        loader: true
      });

      if( options.loader ){
        this.showLoader();
      }

      var data = {
        content: this.editor.getContent()
      };

      var onComplete = _.bind(function(){
        this.dismissMenu();
        this.hideLoader();
      }, this);

      var xhr = this.model.save(data, options)
        .always(onComplete);

      return xhr;
    },

    close: function(){
      this.save().then(function(){
        window.close();
      });
    }
  });


});
