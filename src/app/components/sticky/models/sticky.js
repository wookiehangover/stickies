define(function(require, exports, module){

  'use strict';
  var Backbone = require('backbone');
  var _ = require('lodash');
  var googleStorageSync = require('mixins/google-storage-sync');

  var listItemRegex = /- \[.\]/;

  var StickyModel = Backbone.Model.extend({

    THROTTLE: 5e3,

    DEBOUNCE: 1e3,

    initialize: function(){
      if( !this.id ){
        this.set('id', 'sticky_'+Date.now(), { silent: true });
      }
      this.throttledSave = _.throttle(this.save.bind(this), this.THROTTLE);
      this.debouncedSave = _.debounce(this.throttledSave.bind(this), this.DEBOUNCE);
    },

    getChecklist: function(){
      var lines = this.get('content').split('\n');
      var listItems = [];

      _.each(lines, function(text, index){
        if( listItemRegex.test(text) ){
          listItems.push({
            line: index,
            content: text
          });
        }
      });

      return listItems;
    },

    replaceLine: function(lineNumber, content){
      var lines = this.get('content').split('\n');
      lines.splice(lineNumber, 1, content);
      this.save({ content: lines.join('\n') });
    }

  });

  _.extend(StickyModel.prototype, googleStorageSync);

  module.exports = StickyModel;
});
