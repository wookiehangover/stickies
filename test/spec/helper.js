(function() {
  define(function(require, exports, module) {
    var _;
    _ = require('lodash');
    exports.stubDependencies = function(deps) {
      var stubbedDeps;
      if (!_.isArray(deps)) {
        throw new TypeError('I need an Array!');
      }
      stubbedDeps = {};
      _.each(deps, function(dep) {
        var StubConstructor, stub;
        stub = sinon.stub();
        StubConstructor = function() {
          return stub;
        };
        StubConstructor.stub = stub;
        return stubbedDeps[dep] = StubConstructor;
      });
      return stubbedDeps;
    };
  });

}).call(this);

/*
//@ sourceMappingURL=helper.js.map
*/