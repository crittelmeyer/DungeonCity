/**
 * Ash-js Node
 */
define([
  'class'
], function (Class) {
  // 'use strict';

  var Node = Class.extend({
      entity: null,
      previous: null,
      next: null,
      
      constructor: function () { }
  });

  return Node;
});