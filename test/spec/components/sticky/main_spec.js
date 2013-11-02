(function() {
  define(function(require, exports, module) {
    var Backbone, GithubModel, Squire, Sticky, ViewModel, assert, deps, helper, injector, _;
    _ = require('lodash');
    Backbone = require('backbone');
    helper = require('spec/helper');
    assert = require('chai').assert;
    Squire = require('squire');
    injector = new Squire();
    Sticky = null;
    ViewModel = require('components/sticky/views/main_view_model');
    GithubModel = require('components/github/main');
    deps = {
      'components/github/main': function() {
        return GithubModel;
      },
      'components/sticky/views/main_view_model': function() {
        return ViewModel;
      }
    };
    return describe('Sticky Component', function() {
      before(function(done) {
        this.syncStub = sinon.stub(Backbone, 'sync');
        return injector.mock(deps).require(['components/sticky/main'], function(mockedSticky) {
          Sticky = mockedSticky;
          return done();
        });
      });
      after(function() {
        return this.syncStub.restore();
      });
      describe('initialize', function() {
        before(function() {
          this.stubs = {
            viewModel: sinon.spy(ViewModel.prototype, 'initialize'),
            githubModel: sinon.stub(GithubModel.prototype, 'fetch'),
            createSubViews: sinon.spy(Sticky.prototype, 'createSubViews')
          };
          return this.sticky = new Sticky();
        });
        after(function() {
          return _.invoke(this.stubs, 'restore');
        });
        _.each(['model', 'github'], function(child) {
          return it("attaches " + child, function() {
            return assert.ok(this.sticky[child]);
          });
        });
        it("calls createSubViews", function() {
          return assert.ok(this.stubs.createSubViews.calledOnce);
        });
        it("stores a reference to the nav and loader", function() {
          assert.ok(this.sticky.$nav);
          return assert.ok(this.sticky.$loader);
        });
        return it("calls ViewModel.initialize", function() {
          return assert.ok(this.stubs.viewModel.called);
        });
      });
      describe('createSubViews', function() {
        before(function() {
          return this.sticky = new Sticky();
        });
        return _.each(['editor', 'preview', 'settings'], function(view) {
          return it("creates the " + view + " view", function() {
            assert.ok(this.sticky[view]);
            return assert.equal(this.sticky.model, this.sticky[view].model);
          });
        });
      });
      describe('showView', function() {
        return it('should have tests :(');
      });
      describe('hideActiveView', function() {
        return it('should have tests :(');
      });
      describe('email', function() {
        return it('should have tests :(');
      });
      describe('export', function() {
        return it('should have tests :(');
      });
      describe('destroy', function() {
        return it('should have tests :(');
      });
      describe('spawn', function() {
        return it('should have tests :(');
      });
      describe('save', function() {
        return it('should have tests :(');
      });
      return describe('close', function() {
        return it('should have tests :(');
      });
    });
  });

}).call(this);

/*
//@ sourceMappingURL=main_spec.js.map
*/