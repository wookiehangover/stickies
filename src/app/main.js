define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var Sticky = require('components/sticky/main');

  module.exports = function(options){
    $(function(){
      window.sticky = new Sticky(options);
    });
  };

});

