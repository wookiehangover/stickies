define(function(require, exports, module){

  var $ = require('jquery');
  var Sticky = require('./components/sticky/main');

  $(function(){
    window.sticky = new Sticky();
  });

});
