'use strict';
function launchSticky(model, collection){
  chrome.app.window.create('sticky.html', {
    id: model._id || model.id,
    width: 474,
    height: 600,
    minHeight: 12,
    minWidth: 216,
    frame: 'none'
  }, function(child){
    child.contentWindow.stickyModel = model;
    child.contentWindow.stickyCollection = collection;
  });
}

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.storage.sync.get(null, function(data){
    var keys = Object.keys(data);

    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = data[keys[i]];
    }

    if( keys.length === 0 ){
      return launchSticky({
        content: chrome.i18n.getMessage('welcomeMessage')
      });
    }

    keys.forEach(function(key){
      launchSticky(data[key], values);
    });
  });
});

