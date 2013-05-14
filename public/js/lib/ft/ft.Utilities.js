/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var ft = ft || {};


define(["jquery", "Mustache", "bootstrap"], function($, Mustache) {
	var s;

	/**
	 * Holds all of our dungeon generation code & returns the exposed public API
	 * 
	 * @return {Object}
	 *
	 * @author  Chris & John Rittelmeyer
	 */
	ft.Utilities = (function() {
		/**
	   * Performs an AJAX GET request of the specified URL and executes the given callback function once a response is received.
	   * 
	   * @param  {string} url     The URL to make the AJAX call to.
	   * @param  {Function} success The callback function to execute after receiving a response from the server.
	   *
	   * @author  Chris Rittelmeyer
	   */
	  function _ajaxGet(url, success, error) {
	    if (error == null) {
	      error = function(a, b, c) {
	        console.log('error: ');
	        console.log(a);
	      };
	    }
	    
	    $.ajax({
	      type: "GET",
	      url: url,
	      dataType: "text",
	      success: success,
	      error: error
	    });
	  }

	  /**
	   * Shows the loading spinner.
	   *
	   * @author  Chris Rittelmeyer
	   */
	  function _showLoader($container) {
	    if ($container == null) $container = $('body');

	    this.ajaxGet('templates/spinner.mustache', function(template) {
	      var htmlString = Mustache.to_html(template, {});

	      $container.append(htmlString);
	      $container.find('.spinner').show();
	      $container.css({
	        opacity: "0.5",
	        position: "relative"
	      });
	    });
	  }

	  /**
	   * Hides the loading spinner.
	   *
	   * @author  Chris Rittelmeyer
	   */
	  function _hideLoader($container) {
	    if ($container == null) $container = $('body');

	    $container.find('.spinner').hide();
	    $container.css({
	      opacity: "",
	      position: ""
	    });
	    $container.removeAttr('style');
	  }

	  /**
	   * Adds standard behavior to a specified Twitter Bootstrap style drop-down.<br>
	   * --Changes display text & value of drop-down when selection is made, then:<br>
	   * --Executes callback, if provided.
	   * 
	   * @param  {jQuery_object}   $parent       Parent of the drop-down.
	   * @param  {string}   list_item     CSS selector string of all of the drop-down's list items.
	   * @param  {string}   action_button CSS selector string of the drop-down's action button.
	   * @param  {boolean}   addCaret      If true, caret is appended after newly selected text.
	   * @param  {Function} callback A function to execute each time a new selection is made.
	   *
	   * @author  Chris Rittelmeyer
	   */
	  function _handleDropDown($parent, list_item, action_button, addCaret, callback) {
	    if (typeof addCaret == "undefined") addCaret = true;
	    var $list_item = $parent.find(list_item), $action_button = $parent.find(action_button);

	    $list_item.on('click', function() {
	      //set text & value of new selection
	      var newText = $(this).text().trim();
	      $action_button.text(newText);
	      if (addCaret) $action_button.append(' <span class="caret"></span>');
	      $action_button.val(newText);

	      if (callback) callback.call(this, newText);
	    });
	  }

	  function _getRandomNum(max) {
	  	return Math.floor(Math.random() * max);
	  }

		return {
			ajaxGet: _ajaxGet,
			showLoader: _showLoader,
			hideLoader: _hideLoader,
			handleDropDown: _handleDropDown,
			getRandomNum: _getRandomNum
		};
	})();
});