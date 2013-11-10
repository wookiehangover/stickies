define(function(require, exports, module){

  'use strict';
  var _ = require('lodash');
  var Backbone = require('backbone');
  var pouchSync = require('mixins/pouchdb_sync');
  var StickyModel = require('components/sticky/models/sticky');
  var Sticky = require('components/sticky/main');

  Backbone.originalSync = Backbone.sync;
  Backbone.sync = pouchSync.sync;

  var Stickies = Backbone.Collection.extend({
    model: StickyModel,
    idAttribute: '_id',
    parse: function(resp){
      return _.pluck(resp.rows, 'doc');
    }
  });

  module.exports = function(options){

    options = _.defaults(options || {}, {
      db: pouchSync.db
    });

    if( window.stickyModel ){
      window.sticky = new Sticky(options);
    } else {
      var stickies = window.stickies = new Stickies();
      stickies.fetch().done(function(){
        options = options || {};
        if( stickies.length ){
          options.model = stickies.last();
        } else {
          var model = options.model = new stickies.model({
            content: '#Hello World!'
          });
          options.model = stickies.add(model);
          model.save();
        }
        window.sticky = new Sticky(options);
      });
    }
  };

});

