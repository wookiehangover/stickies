// Chrome App Bootstrap
//
// Sets up chrome-specific modules and overrides

require.config({
  map: {
    // Remap the generic auth adapter to the chrome.identity
    'components/github/main': {
      'components/github/auth': 'components/github/chrome_identity'
    }
  }
});

require(['require_config'], function(){

  'use strict';
  require([
    'backbone',
    'mixins/google_storage_sync',
    'main'
  ], function(Backbone, googleStorage, init) {
    // All modules will persist to chrome.storage[local|sync]
    Backbone.originalSync = Backbone.sync;
    Backbone.sync = googleStorage.sync;
    // Start the app
    init();
  });
});
