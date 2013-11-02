(function() {
  require.config({
    baseUrl: 'app'
  });

  require(['require_config'], function() {
    return require(['spec/components/sticky/main_spec'], function() {
      return mocha.run();
    });
  });

}).call(this);

/*
//@ sourceMappingURL=main.js.map
*/