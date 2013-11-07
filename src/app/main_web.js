require.config({
  map: {
    'backbone-pouch': {
      'underscore': 'lodash'
    }
  }
});

require(['require_config'], function(){
  'use strict';
  require([
    'lodash',
    'backbone',
    'mixins/pouchdb_sync',
    'components/sticky/models/sticky',
    './main'
  ], function(_, Backbone, pouchSync, StickyModel, init) {

    Backbone.originalSync = Backbone.sync;
    Backbone.sync = pouchSync.sync;

    var Stickies = Backbone.Collection.extend({
      model: StickyModel,
      idAttribute: '_id',
      parse: function(resp){
        return _.pluck(resp.rows, 'doc');
      }
    });

    var stickies = window.stickies = new Stickies();

    stickies.fetch().done(function(){
      var options = {};
      if( stickies.length ){
        options.model = stickies.last();
      } else {
        var model = options.model = new stickies.model({
          content: '#Hello World!'
        });
        options.model = stickies.add(model);
        model.save();
      }

      init(options);
      window.sticky.db = pouchSync.db;
    });

  });
});
