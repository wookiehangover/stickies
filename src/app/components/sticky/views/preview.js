define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');
  var Backbone = require('backbone');
  var marked = require('marked');
  var dependencyNeedle = require('mixins/dependency_needle');

  // blah, this is for dev mode and is silly, lodash templates are problematic
  // in chrome apps. Use a PWT template instead.
  // var checkboxTemplate = require('tpl!../templates/checkbox');
  var checkboxTemplate = require('../templates/checkbox');

  var checkListRegex = /\[(.)\]\s(.+)/;

  var PreviewView = Backbone.View.extend({

    dependencies: function(){
      return ['model'];
    },

    name: 'preview',

    initialize: function(options){
      this.injectDependencies(options, this.dependencies());

      marked.setOptions({
        gfm: true,
        tables: true,
        breaks: true,
        smartLists: true
      });
    },

    render: function(){
      this.checklist = this.model.getChecklist();
      var $markdown = $(this.renderMarkdown());
      this.renderChecklist($markdown);
      this.$('article').html($markdown);
    },

    renderMarkdown: function(){
      return marked(this.model.get('content'));
    },

    renderChecklist: function($markdown){
      var self = this;
      var index = 0;

      $markdown.find('li').each(function(){
        var $li = $(this);
        var parts = checkListRegex.exec($li.text());

        if( !parts || parts.length < 3 ){
          return;
        }

        var line = self.checklist[index];
        if( !line ){
          return;
        }

        $li.html(checkboxTemplate({
          checked: parts[1] === 'x',
          content: parts[2],
          name: 'todo_'+index
        }));

        $li.on('change', 'input', function(e){
          var text = line.content;
          var checked = $(e.currentTarget).is(':checked') ? 'x': ' ';

          $li.find('label')[ checked === 'x' ? 'addClass':'removeClass' ]('checked');

          text = text.replace(/\[.\]/, '['+ checked +']');
          self.model.replaceLine(line.line, text);
        });

        $li.parent().addClass('checklist');

        index += 1;
      });
    }
  });

  _.extend(PreviewView.prototype, dependencyNeedle);

  module.exports = PreviewView;

});
