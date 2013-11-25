define(function(require, exports, module){

  'use strict';
  var _ = require('lodash');
  var Backbone = require('backbone');
  var pouchSync = require('mixins/pouchdb_sync');

  var listItemRegex = /- \[.\]/;

  var StickyModel = Backbone.Model.extend({

    THROTTLE: 30e3,

    DEBOUNCE: 1e3,

    db: pouchSync.db,

    idAttribute: '_id',

    initialize: function(){
      this.throttledSave = _.throttle(this.set.bind(this), this.THROTTLE);
      this.debouncedSave = _.debounce(this.throttledSave.bind(this), this.DEBOUNCE);
      this.on('change:_id', this.setSlug, this);
      this.on('change:content', function(){
        this.set('updated_at', Date.now());
      }, this);
      this.setSlug();
    },

    setSlug: function(){
      if( !this.id ){
        return;
      }
      var slug = this.id.substr(0, 8).toLowerCase();
      this.set({ slug: slug });
    },

    defaults: {
      bg_color: 'light-bg',
      text_color: 'dark-text',
      content: '#Hello World!'
    },

    replicate: function(target){
      if( !this.db || !navigator.onLine ){
        return;
      }

      var options = {
        // continuous: true,
        onChange: function(change){
          console.log(change);
        },
        // complete: function(){
        //   console.log('replication successful');
        // }
      };

      this.db.replicate.from(target, options);
      this.db.replicate.to(target, options);
    },

    push: function(target){
      if( !this.db || !navigator.onLine ){
        return;
      }

      var dfd = $.Deferred();

      this.save().done(_.bind(function(){
        this.save(null, { target: 'sync', targetDB: target })
          .done(_.bind(this.save, this))
          .then(dfd.resolve, dfd.reject);
      }, this));

      return dfd.promise();
    },

    pull: function(target){
      if( !this.db || !navigator.onLine ){
        return;
      }

      return this.fetch({ target: 'sync', targetDB: target }).done(_.bind(function(data){
        this.save(data);
      }, this));
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
    },

    toEmail: function(){
      var content = [
        'mailto:?subject=',
        encodeURIComponent('Sticky Note: '+ this.getTitle()),
        '&body=',
        encodeURIComponent(this.get('content'))
      ];

      return content.join('');
    }

  });

  module.exports = StickyModel;
});
