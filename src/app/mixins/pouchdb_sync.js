define(function(require, exports, module){
  'use strict';
  var PouchDB = require('pouchdb');
  var BackbonePouch = require('backbone-pouch');

  var pouch = exports.db = new PouchDB('sticky');

  exports.sync = function(method, model, options){

    var db = options.target === 'sync' && options.targetDB ?
      options.targetDB : pouch;

    var sync = BackbonePouch.sync({
      db: db,
      options: {
        allDocs: {
          include_docs: true
        }
      }
    });

    // if( options.target === 'sync' && options.targetDB ){
    //   PouchDB.replicate('sticky', options.targetDB, {
    //     complete: function(err, resp){
    //       console.log(err, resp);
    //     }
    //   });
    // }
    return sync.apply(this, arguments);
  };

});
