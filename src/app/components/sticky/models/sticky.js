define(function(require, exports, module){

  'use strict';
  var _ = require('lodash');
  var Backbone = require('backbone');

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

    defaults: {
      bg_color: 'light-bg',
      text_color: 'dark-text'
    },

    set: function(key, val){
      var attrs;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
      } else {
        (attrs = {})[key] = val;
      }

      attrs.updated_at = Date.now();
      return Backbone.Model.prototype.set.apply(this, arguments);
    },

    getTitle: function(){
      var lines = this.get('content').split('\n');
      var title = lines[0];

      title = title.replace(/#+/,'');

      return title.trim();
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
      return this.save('content', lines.join('\n'));
    },

    toGIST: function(){
      return {
        public: true,
        files: {
          'sticky.md': {
            content: this.get('content')
          }
        }
      };
    }

  });

  module.exports = StickyModel;
});
