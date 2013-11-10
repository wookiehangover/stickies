define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');

  exports.sync = function(method, model, options){
    options = options || {};
    var dfd = $.Deferred();
    var action = 'getItem';
    var data = model.id;
    var result;

    if( method === 'update' || method === 'create' || method === 'patch' ){
      action = 'setItem';
      data = {};
      data.key = model.id;
      console.log(model.toJSON())
      data.value = JSON.stringify(model.toJSON(options));
    }

    if( method === 'delete'){
      action = 'removeItem';
      data = model.id;
    }

    model.trigger('sync', model, result, options);

    try {
      if( data.key && data.value ){
        window.localStorage[action](data.key, data.value);
      } else {
        result = JSON.parse(window.localStorage[action](data));
      }
    } catch(error){
      dfd.reject(error);
      return;
    }

    if( action === 'getItem' && result ){
      model.set( model.parse(result) );
    }

    dfd.resolve(model.toJSON());
    var xhr = dfd.promise();
    model.trigger('request', model, xhr, options);
    return xhr;
  };
})

