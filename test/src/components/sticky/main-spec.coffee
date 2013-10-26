define (require, exports, module)->
  _ = require('lodash')
  helper = require('spec/helper')
  assert = require('chai').assert
  Squire = require('squire')
  injector = new Squire()

  Sticky = null

  describe 'Sticky Component', ->
    describe 'initialize', ->

      before (done)->
        @deps = helper.stubDependencies [
          'components/github/main'
        ]

        injector.mock(@deps)
          .require ['components/sticky/main'], (mockedSticky)=>
            Sticky = mockedSticky

            @stubs =
              createSubView: sinon.spy(Sticky::, 'createSubViews')

            @sticky = new Sticky()
            done()

      after ->
        _.invoke(@stubs, 'restore')

      _.each ['model', 'github', 'editor', 'preview', 'settings'], (child)->
        it "attaches #{child}", ->
          assert.ok(this.sticky[child])



