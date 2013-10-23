'use strict';
function launchSticky(model){
  chrome.app.window.create('sticky.html', {
    id: model.id,
    width: 474,
    height: 600,
    minHeight: 12,
    minWidth: 216,
    frame: 'none'
  }, function(child){
    child.contentWindow.stickyModel = model;
  });
}

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.storage.sync.get(null, function(data){
    var keys = Object.keys(data);

    if( keys.length === 0 ){
      return launchSticky({
        content: chrome.i18n.getMessage('welcomeMessage')
      });
    }

    keys.forEach(function(key){
      launchSticky(data[key]);
    });
  });
});

