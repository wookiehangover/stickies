define(function(require, exports, module){

  'use strict';
  var _ = require('lodash');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var dependencyNeedle = require('mixins/dependency_needle');

  var SettingsView = Backbone.View.extend({

    dependencies: function(){
      return ['model', 'user'];
    },

    name: 'settings',

    initialize: function(options){
      this.injectDependencies(options, this.dependencies());
    },

    events: {
      'click .background-color li': 'changeBackground',
      'click input[name="text-color"]': 'changeText',
      'click [data-action="save"]': 'handleSave',
      'change input[name="sync-active"]': 'toggleSync'
    },

    changeBackground: function(e){
      var $elem = $(e.currentTarget);
      if( $elem.hasClass('active') ){
        return;
      }

      var color = $elem.attr('class');
      this.$('.background-color .active').removeClass('active');
      $elem.addClass('active');

      this.model.set('bg_color', color);
      this.updatePreview(color, 'background');
    },

    render: function(){
      this.updatePreview(this.model.get('bg_color'), 'bg');
      this.updatePreview(this.model.get('text_color'), 'text');
      this.renderSync();
    },

    renderSync: function(){
      if( _.size(this.user.cookie.attributes) ){
        this.$('.sync-settings input[name="username"]')
          .val(this.user.get('email'))
          .attr('disabled', true);

        this.$('.sync-settings input[name="password"]').attr('disabled', true);

        this.$('.sync-settings :checkbox').attr('checked', true);

        this.$('.sync-settings .topcoat-notification').addClass('ui-active').text('Sync Enabled');
      }
    },

    toggleSync: function(e){
      var checked = $(e.currentTarget).is(':checked');

      if( checked ){
        this.validateSyncSettings();
      } else {
        this.user.logout();
        this.$('.sync-settings :disabled').each(function(){
          $(this).attr('disabled', false);
        });

        this.$('.sync-settings .topcoat-notification').removeClass('ui-active').text('Sync Disabled');
      }
    },

    updatePreview: function(color, type){
      var classRegex = type === 'text' ? /\S+-text/ : /\S+-bg/;
      var previewClass = this.$('.color-preview').attr('class');
      this.$('.color-preview')
        .removeClass()
        .addClass( previewClass.replace(classRegex, color) );
    },

    changeText: function(e){
      var color = $(e.currentTarget).val();
      this.model.set('text_color', color);
      this.updatePreview(color, 'text');
    },

    validateSyncSettings: function(){
      var auth = {};
      this.$('.sync-settings input:not([disabled], :checkbox)').each(function(){
        auth[$(this).attr('name')] = this.value;
      });

      if( _.size(auth) !== 0 && this.$('.sync-settings :checkbox').is(':checked') ){
        this.user.authenticate(auth.username, auth.password).then(_.bind(function(){
          this.renderSync();
          this.user.save();
          console.log('success');
        },this), function(){
          console.log('error');
        });
      }
    },

    handleSave: function(){
      this.validateSyncSettings();
    }

  });

  _.extend(SettingsView.prototype, dependencyNeedle);

  module.exports = SettingsView;

});

