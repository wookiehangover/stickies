define(function(require, exports, module){

  'use strict';
  var $ = require('jquery');
  var _ = require('lodash');
  var Backbone = require('backbone');
  var marked = require('marked');
  var dependencyNeedle = require('mixins/dependencyNeedle');

  // blah, this is for dev mode and is silly
  // var checkboxTemplate = require('tpl!../templates/checkbox');
  var checkboxTemplate = function(context){
    return [
      '<label class="topcoat-checkbox',
      (context.checked ? ' checked">': '">'),
      '<input type="checkbox" name="'+ context.name +'"',
      (context.checked ? 'checked="checked" />': '/>'),
      '<div class="topcoat-checkbox__checkmark"></div>',
      context.content,
      '</label>'
    ].join('');
  };

  var checkListRegex = /^\[(.)\]\s(.+)/;

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
      var $markdown = $(marked(this.model.get('content')));
      this.renderChecklist($markdown);
      this.$el.html($markdown);
    },

    renderChecklist: function($markdown){
      var self = this;
      $markdown.find('li').each(function(index){
        var $li = $(this);
        var parts = checkListRegex.exec($li.text());
        if( parts && parts.length > 1 ){

          $li.html(checkboxTemplate({
            checked: parts[1] === 'x',
            content: parts[2],
            name: 'todo_'+index
          }));

          $li.on('change', 'input', function(e){
            var text = self.checklist[index].content;
            var checked = $(e.currentTarget).is(':checked') === 'on' ? 'x': ' ';
            if( checked === ' ' ){
              $li.find('.checked').removeClass('checked');
            }
            text = text.replace(/\[.\]/, '['+ checked +']');
            self.model.replaceLine(self.checklist[index].line, text);
          });

          $li.parent().addClass('checklist');
        }
      });
    }
  });

  _.extend(PreviewView.prototype, dependencyNeedle);

  module.exports = PreviewView;

});
