define(function(require, exports, module){

  'use strict';
  var _ = require('lodash');

  var keyMap = {
    // Esc
    '27': function(ctx){
      ctx.hideActiveView();
    },

    // Command-w
    '87+metaKey': function(ctx){
      ctx.close();
    },

    // Command-Shift-d
    '68+metaKey+shiftKey': function(ctx){
      ctx.destroy();
    },

    // Command-p
    '80+metaKey': function(ctx){
      if( ctx.$el.hasClass('preview-active') ){
        ctx.hideActiveView();
      } else {
        ctx.showView(ctx.preview);
      }
    },

    // Command-,
    '188+metaKey': function(ctx){
      ctx.toggleSettings();
    },

    // Command-n
    '78+metaKey': function(ctx, e){
      var data = {};
      if( e.shiftKey ){
        data = _.omit(ctx.model.toJSON(), 'id');
      }
      ctx.spawn(data);
    },

    // Command-s
    '83+metaKey': function(ctx, e){
      if( e.shiftKey ){
        ctx.export();
      } else {
        ctx.save();
      }
    }
  };

  exports.keyMap = (function(){
    var map = {};

    _.each(keyMap, function(fn, combo){
      var parts = combo.split('+');
      var char = parts.shift();
      map[char] = function(ctx, e){
        if( parts.length === 0 ){
          return fn(ctx, e);
        }

        var match = _.every(parts, function(modifier){
          if( modifier === 'metaKey' && e.ctrlKey ){
            return true;
          }
          if( e[modifier] ){
            return true;
          }
        });

        if( match ){
          return fn(ctx, e);
        } else {
          return false;
        }
      };
    });

    return map;
  })();

  exports.handleKeydown = function(e){
    var ret;
    if( this.keyMap[e.which] ){
      ret = this.keyMap[e.which](this, e);
      if( ret !== false ){
        return false;
      }
    }
  };

});
