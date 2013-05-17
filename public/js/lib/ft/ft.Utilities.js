/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var ft = ft || {};


define(["jquery", "Mustache", "Modernizr", "bootstrap"], function($, Mustache, Modernizr) {
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

	  function _sumObjectValues(obj) {
	  	var count = 0;

	  	if (Object.prototype.toString.call(obj) === '[object Array]') {
	  		$.each(obj, function(i, item) {
	  			$.each(item, function(key, value) {
		  			if (typeof value === 'number') count += value;
		  		});
	  		});
	  	} else {
		  	$.each(obj, function(key, value) {
		  		if (typeof value === 'number') count += value;
		  	});
	  	}

	  	return count;
	  }

	  /**
     * Pub/sub storage object
     * @type {object}
     *
     * @author  "Cowboy" Ben Alman
     *
     * {@link https://gist.github.com/cowboy/661855}
     */
    var _o = $({});

    /**
     * Pub/sub subscribe.
     * 
     * @param {string} topic The topic to subscribe to.
     * @param {Function} handle The function to execute when topic is published to.
     *
     * @author  "Cowboy" Ben Alman
     *
     * {@link https://gist.github.com/cowboy/661855}
     */
    function _subscribe() {
      _o.on.apply(_o, arguments);
    }

    /**
     * Pub/sub unsubscribe.
     * 
     * @param {string} topic The topic to unsubscribe from.
     * @param {Function} handle Optional. The function to unsubscribe. If undefined, all handlers for the specified topic are unsubscribed.
     *
     * @author  "Cowboy" Ben Alman
     *
     * {@link https://gist.github.com/cowboy/661855}
     */
    function _unsubscribe() {
      _o.off.apply(_o, arguments);
    }

    /**
     * Pub/sub publish
     * 
     * @param {string} topic The topic to publish to.
     * @param {Array} data The data to publish. Can be array of values or single value.
     *
     * @author  "Cowboy" Ben Alman
     *
     * {@link https://gist.github.com/cowboy/661855}
     */
    function _publish() {
      _o.trigger.apply(_o, arguments);
    }

		return {
			ajaxGet: _ajaxGet,
			showLoader: _showLoader,
			hideLoader: _hideLoader,
			handleDropDown: _handleDropDown,
			getRandomNum: _getRandomNum,
			sumObjectValues: _sumObjectValues,
			subscribe: _subscribe,
			unsubscribe: _unsubscribe,
			publish: _publish
		};
	})();
});

Array.prototype.random = function() {
	return this[ft.Utilities.getRandomNum(this.length)];
}