define(function(require, exports, module){

  'use strict';
  var _ = require('lodash');
  var Backbone = require('backbone');
  var pouchSync = require('mixins/pouchdb_sync');
  var StickyModel = require('components/sticky/models/sticky');
  var Sticky = require('components/sticky/main');

  Backbone.originalSync = Backbone.sync;
  Backbone.sync = pouchSync.sync;


  module.exports = function(options){

    options = _.defaults(options || {}, {
      db: pouchSync.db
    });

    var Stickies = Backbone.Collection.extend({
      model: options.StickyModel || StickyModel,
      idAttribute: '_id',
      parse: function(resp){
        console.log(resp);
        return _.pluck(resp.rows, 'doc');
      }
    });

    if( window.stickyModel ){
      var stickies = window.stickies = new Stickies(_.without(window.stickyCollection, window.stickyModel));
      stickies.fetch().done(function(){
        options.model = stickies.findWhere({
          _id: window.stickyModel._id
        }) || stickies.add(window.stickyModel);
        window.sticky = new Sticky(options);
      });

    } else {
      var stickies = window.stickies = new Stickies();
      stickies.fetch().done(function(){
        options = options || {};
        if( stickies.length ){
          var fromHash = stickies.findWhere({
            slug: location.hash.substr(1, Infinity)
          });
          options.model = fromHash || stickies.last();
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

