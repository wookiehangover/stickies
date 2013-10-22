require.config({
  deps: ['main'],

  paths: {
    jquery: '../bower_components/jquery/jquery',
    backbone: '../bower_components/backbone/backbone',
    lodash: '../bower_components/lodash/dist/lodash',
    marked: '../bower_components/marked/lib/marked',
    tpl: '../bower_components/lodash-template-loader/loader'
  },

  shim: {
    backbone: {
      deps: ['jquery', 'lodash'],
      exports: 'Backbone'
    }
  }
});
