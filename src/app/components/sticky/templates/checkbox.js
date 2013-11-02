/*jshint laxcomma: true*/
define(function(require, exports, module){
  'use strict';
  // See comment in views/preview for why this stupidness needs to exist
  module.exports = function(context){
    var tpl = [
      '<label class="topcoat-checkbox'
      , (context.checked ? ' checked">': '">')
      , '<input type="checkbox" name="'+ context.name +'"'
      , (context.checked ? 'checked="checked" />': '/>')
      , '<div class="topcoat-checkbox__checkmark"></div>'
      , context.content
      , '</label>'
    ].join('');

    return tpl;
  };
});
