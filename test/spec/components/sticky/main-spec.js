(function() {
  define(function(require, exports, module) {
    var Squire, Sticky, assert, helper, injector, _;
    _ = require('lodash');
    helper = require('spec/helper');
    assert = require('chai').assert;
    Squire = require('squire');
    injector = new Squire();
    Sticky = null;
    return describe('Sticky Component', function() {
      return describe('initialize', function() {
        before(function(done) {
          var _this = this;
          this.deps = helper.stubDependencies(['components/github/main']);
          return injector.mock(this.deps).require(['components/sticky/main'], function(mockedSticky) {
            Sticky = mockedSticky;
            _this.stubs = {
              createSubView: sinon.spy(Sticky.prototype, 'createSubViews')
            };
            _this.sticky = new Sticky();
            return done();
          });
        });
        after(function() {
          return _.invoke(this.stubs, 'restore');
        });
        return _.each(['model', 'github', 'editor', 'preview', 'settings'], function(child) {
          return it("attaches " + child, function() {
            return assert.ok(this.sticky[child]);
          });
        });
      });
    });
  });

}).call(this);

/*
//@ sourceMappingURL=main-spec.js.map
*/