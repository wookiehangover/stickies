// Chrome App Bootstrap
//
// Sets up chrome-specific modules and overrides

require.config({
  map: {
    // Remap the generic auth adapter to the chrome.identity
    'components/github/main': {
      'components/github/auth': 'components/github/chrome_identity'
    },
    'backbone-pouch': {
      'underscore': 'lodash'
    }
  }
});

require(['require_config'], function(){

  'use strict';
  require([
    'backbone',
    'mixins/pouchdb_sync',
    'mixins/google_storage_sync',
    'components/sticky/models/sticky',
    'main'
  ], function(Backbone, pouchSync, googleStorage, StickyModel, init) {
    // All modules will persist to chrome.storage[local|sync]
    Backbone.originalSync = Backbone.sync;
    Backbone.sync = googleStorage.sync;

    var PouchModel = Backbone.Model.extend({
      idAttribute: '_id',
      sync: pouchSync.sync,
      ingest: function(model, options){
        var attrs = model.omit('id');
        return Backbone.Model.prototype.set.call(this, attrs, options);
      }
    });

    var pouchModel = new PouchModel();
    var model = new StickyModel( window.stickyModel );

    pouchModel.listenTo(model, 'change', pouchModel.ingest);

    pouchModel.listenTo(model, 'sync', function(model, resp, options){
      if( options && options.target === 'sync' ){
        pouchModel.save(null, { target: 'sync' });
      }
    });

    init({
      model: model
    });
  });
});
