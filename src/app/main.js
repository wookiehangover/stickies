require(['config'], function(){
  require(['jquery', './components/sticky/main'], function($, Sticky){
    $(function(){
      window.sticky = new Sticky();
    });
  });
});
