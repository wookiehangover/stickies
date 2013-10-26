(function() {
  require.config({
    baseUrl: 'app'
  });

  require(['require-config'], function() {
    return require(['spec/components/sticky/main-spec'], function() {
      return mocha.run();
    });
  });

}).call(this);

/*
//@ sourceMappingURL=main.js.map
*/