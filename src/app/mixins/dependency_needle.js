define(function(require, exports, module) {
  'use strict';
  var _ = require('lodash');

  exports.injectDependencies = function(options, dependencies) {
    this.assignDependencies(options, dependencies);
    return this.assertDependenciesSatisfied(dependencies);
  };

  exports.assignDependencies = function(options, dependencies) {
    if (!((dependencies != null ? dependencies.length : void 0) && options)) {
      return this;
    }
    _.each(_.pick(options, dependencies), function(value, key) {
      if (!_.has(this, key)) {
        this[key] = value;
      }
    }, this);

    return this;
  };

  exports.missingDependencies = function(dependencies) {
    return _.filter(dependencies, function(dep){
      if( _.isUndefined(dep) ){
        return dep;
      }
    });
  };

  exports.assertDependenciesSatisfied = function(dependencies) {
    var errorMessage, missingDeps;
    missingDeps = this.missingDependencies(dependencies);
    if (missingDeps.length) {
      errorMessage = "Dependencies not satisfied in " + this.constructor.name + " - missing " + (missingDeps.join(', '));
      throw new Error(errorMessage);
    }
  }

});
