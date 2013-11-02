define (require, exports, module)->
  _ = require('lodash')
  Backbone = require('backbone')
  helper = require('spec/helper')
  assert = require('chai').assert
  Squire = require('squire')
  injector = new Squire()

  Sticky = null
  ViewModel   = require('components/sticky/views/main_view_model')
  GithubModel = require('components/github/main')

  deps =
    'components/github/main': -> GithubModel
    'components/sticky/views/main_view_model': -> ViewModel

  describe 'Sticky Component', ->
    before (done)->
      @syncStub = sinon.stub(Backbone, 'sync')

      injector.mock(deps).require ['components/sticky/main'], (mockedSticky)->
        Sticky = mockedSticky
        done()

    after ->
      @syncStub.restore()

    describe 'initialize', ->
      before ->
        @stubs =
          viewModel: sinon.spy(ViewModel::, 'initialize')
          githubModel: sinon.stub(GithubModel::, 'fetch')
          createSubViews: sinon.spy(Sticky::, 'createSubViews')

        @sticky = new Sticky()

      after ->
        _.invoke(@stubs, 'restore')

      _.each ['model', 'github'], (child)->
        it "attaches #{child}", ->
          assert.ok(this.sticky[child])

      it "calls createSubViews", ->
        assert.ok @stubs.createSubViews.calledOnce

      it "stores a reference to the nav and loader", ->
        assert.ok @sticky.$nav
        assert.ok @sticky.$loader

      it "calls ViewModel.initialize", ->
        assert.ok @stubs.viewModel.called

    describe 'createSubViews', ->
      before ->
        @sticky = new Sticky()

      _.each ['editor', 'preview', 'settings'], (view)->
        it "creates the #{view} view", ->
          assert.ok @sticky[view]
          assert.equal @sticky.model, @sticky[view].model

    # womp womp
    describe 'showView', ->
      it 'should have tests :('

    describe 'hideActiveView', ->
      it 'should have tests :('

    describe 'email', ->
      it 'should have tests :('

    describe 'export', ->
      it 'should have tests :('

    describe 'destroy', ->
      it 'should have tests :('

    describe 'spawn', ->
      it 'should have tests :('

    describe 'save', ->
      it 'should have tests :('

    describe 'close', ->
      it 'should have tests :('



