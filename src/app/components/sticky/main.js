/*globals chrome: true*/
define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');
  var Backbone = require('backbone');

  var GithubAuth = require('components/github/main');
  var UserModel = require('components/user/main');
  var StickyModel = require('./models/sticky');
  var Router = require('./router');

  var ViewModel = require('./views/main_view_model');
  var EditorView = require('./views/editor');
  var PreviewView = require('./views/preview');
  var SettingsView = require('./views/settings');
  var dependencyNeedle = require('mixins/dependency_needle');

  var StickyController = ViewModel.extend({
    el: $('.sticky'),

    dependencies: function(){
      return ['db'];
    },

    initialize: function(options){
      this.injectDependencies(options, this.dependencies());
      this.attachDependencies(options);

      this.createSubViews();
      ViewModel.prototype.initialize.apply(this, arguments);
      this.editor.render();
      Backbone.history.start();

      if( location.hash === "" ){
        this.router.navigate(this.model.get('slug'), { replace: true });
      }
    },

    render: function(options){
      options = options || {};
      if( options.navigate ){
        this.router.navigate(this.model.get('slug'));
      }
      return ViewModel.prototype.render.apply(this, arguments);
    },

    attachDependencies: function(options){
      if( !this.model ){
        this.model = new StickyModel( window.stickyModel || {} );
      }
      this.github = new GithubAuth();
      this.user = new UserModel(null, options);

      // TODO move this into the user model, injecting the db
      this.listenTo(this.user, 'replicate', function(){
        if( this.db && this.user.db ){
          this.db.replicate.from(this.user.db, {
            complete: function(){
              console.log('upstream replication complete');
            }
          });
        }
      }, this);

      this.router = new Router({ controller: this });
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
        model: this.model,
        user: this.user
      });
    },

    showView: function(view){
      this.hideActiveView({ navigate: false });
      this.dismissMenu();
      this.activeView = view;
      this.$el.addClass(view.name + '-active');
      view.render();
      this.router.navigate([view.name]);
      view.$el.fadeIn();
    },

    hideActiveView: function(options){
      if( this.activeView ){
        this.render(options);
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
        .done(function(){
          window.close();
        });
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

  _.extend(StickyController.prototype, dependencyNeedle);

  module.exports = StickyController;

});
