require.config({
  map: {
    'localstorage': {
      'underscore': 'lodash'
    }
  }
});


require(['require_config'], function(){

  'use strict';
  require([
    'backbone',
    'localstorage',
    'components/sticky/models/sticky',
    './main'
  ], function(Backbone, LocalStorage, StickyModel, init) {

    var Stickies = Backbone.Collection.extend({
      localStorage: new LocalStorage('sticky'),
      model: StickyModel
    });

    var stickies = new Stickies();

    stickies.fetch().done(function(){
      var options = {};
      if( stickies.length ){
        options.model = stickies.last();
      } else {
        options.model = stickies.create();
      }
      init(options);
    });

  });
});
