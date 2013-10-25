define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');

  exports.sync = function(method, model, options){
    options = options || {};
    var dfd = $.Deferred();
    var target = options.target || 'local';
    var action = 'get';
    var data = model.id;

    if( method === 'update' || method === 'create' || method === 'patch' ){
      action = 'set';
      data = {};
      data[model.id] = model.toJSON();
    }

    if( method === 'delete'){
      action = 'remove';
      data = model.id;
    }

    chrome.storage[target][action](data, function(resp){
      var error = chrome.runtime.lastError;
      if( error ){
        return dfd.reject(error);
      }
      if( action === 'get' ){
        model.set( model.parse(resp[data]) );
      }
      console.log(target +' sync successful');
      dfd.resolve(model.toJSON());
    });

    return dfd.promise();
  };
})
