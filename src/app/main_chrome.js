// Chrome App Bootstrap
//
// Sets up chrome-specific modules and overrides

require.config({
  map: {
    // Remap the generic auth adapter to the chrome.identity
    'components/github/main': {
      'components/github/auth': 'components/github/chrome_identity'
    },
    'components/user/main': {
      'mixins/localstorage_sync': 'mixins/google_storage_sync'
    },
    'backbone-pouch': {
      'underscore': 'lodash'
    }
  }
});

require(['require_config'], function(){
  'use strict';
  require([
    'jquery',
    'mixins/google_storage_sync',
    'components/sticky/models/sticky',
    './main'
  ], function($, googleSync, StickyModel, init) {

    var Model = StickyModel.extend({
      sync: function(method, model, options){
        if( method !== 'read' ){
          googleSync.sync.apply(this, arguments);
        }
        return StickyModel.prototype.sync.apply(this, arguments);
      }
    });

    $(function(){
      init({
        model: new Model(window.stickyModel),
        StickyModel: Model
      });
    });
  });
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

  });
});
