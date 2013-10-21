define(function(require, exports, module){

  'use strict';
  var Backbone = require('backbone');
  var _ = require('lodash');
  var $ = require('jquery');
  var googleStorageSync = require('mixins/google-storage-sync');

  var StickyModel = Backbone.Model.extend({

    THROTTLE: 5e3,

    DEBOUNCE: 1e3,

    initialize: function(){
      if( !this.id ){
        this.set('id', 'sticky_'+Date.now(), { silent: true });
      }
      this.throttledSave = _.throttle(this.save.bind(this), this.THROTTLE);
      this.debouncedSave = _.debounce(this.throttledSave.bind(this), this.DEBOUNCE);
    }

  });

  _.extend(StickyModel.prototype, googleStorageSync);

  module.exports = StickyModel;
});
