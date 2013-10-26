define (require, exports, module)->

  _ = require('lodash')

  exports.stubDependencies = (deps) ->
    throw new TypeError('I need an Array!') unless _.isArray(deps)

    stubbedDeps = {}

    _.each deps, (dep) ->
      stub = sinon.stub()
      StubConstructor = -> stub
      StubConstructor.stub = stub
      stubbedDeps[dep]= StubConstructor

    return stubbedDeps

  return
