require.config({
  deps: ['main'],

  paths: {
    jquery: '../bower_components/jquery/jquery',
    backbone: '../bower_components/backbone/backbone',
    lodash: '../bower_components/lodash/dist/lodash',
    marked: '../bower_components/marked/lib/marked',
    tpl: '../bower_components/lodash-template-loader/loader',
    localstorage: '../bower_components/backbone.localStorage/backbone.localStorage',
    'backbone-pouch': '../bower_components/backbone-pouch.js/index',
    pouchdb: '../scripts/pouchdb-nightly',

    // Test
    spec: '../spec',
    chai: '../bower_components/chai/chai',
    squire: '../bower_components/squire/src/Squire'
  },

  shim: {
    backbone: {
      deps: ['jquery', 'lodash'],
      exports: 'Backbone'
    },
    pouchdb: {
      exports: 'PouchDB'
    }
  }
});
