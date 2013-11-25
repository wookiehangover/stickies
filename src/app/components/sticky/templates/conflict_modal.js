/*jshint laxcomma: true*/
define(function(require, exports, module){
  'use strict';
  module.exports = function(ctx){
    var tpl = [
      '<h4>'+ (ctx.get('title')) +'</h4>'
      , '<div class="control-group">'
      , '<button class="topcoat-button--large" data-action="deny">'
      , (ctx.get('deny')) + '</button><br/>'
      , '<small>Use my version.</small><br/><br/>'
      , '<button class="topcoat-button--large--cta" data-action="confirm">'
      , (ctx.get('confirm')) + '</button><br/>'
      , '<small>You can always undo.</small>'
      , '</div>'
    ].join('');

    return tpl;
  };
});
