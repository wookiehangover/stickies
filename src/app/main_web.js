require.config({
  map: {
    'backbone-pouch': {
      'underscore': 'lodash'
    }
  }
});

require(['require_config'], function(){
  'use strict';
  require(['jquery', './main'], function($, init) {
    $(function(){
      init();
    });
  });
});
