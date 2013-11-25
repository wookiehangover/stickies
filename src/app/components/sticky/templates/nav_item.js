/*jshint laxcomma: true*/
define(function(require, exports, module){
  'use strict';
  module.exports = function(ctx){
    var tpl = [
      '<li>'
      , '<a href="#' + (ctx.get('slug')) + '" target="_blank" data-id="'+ (ctx.id) +'">'
      , ctx.getTitle()
      , ' <small>' + (new Date(ctx.get('updated_at'))) + '</small></a>'
      , '</li>'
    ].join('');

    return tpl;
  };
});
