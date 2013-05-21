/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var ft = ft || {};


define(["jquery", "Mustache", "bootstrap"], function($, Mustache) {
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
	  	var dataType = "test";
	  	if (url.indexOf('.js') > -1) dataType = "script";

	    if (error == null) {
	      error = function(a, b, c) {
	        console.log('error: ');
	        console.log(a);
	      };
	    }
	    
	    $.ajax({
	      type: "GET",
	      url: url,
	      dataType: dataType,
	      success: success,
	      error: error
	    });
	  }

     /**
     * Retrieves the value of a specified parameter from the current page's URL.
     * 
     * @param  {string} name Parameter name to retrieve a value for.
     * 
     * @return {string}      Value of the requested parameter.
     *
     * @author  Chris Rittelmeyer
     */
    function _getParameterByName(name) {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(window.location.search);
      if(results == null)
        return "";
      else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    /**
     * Removes the key/value pair of the specified parameter from the specified URL.
     * 
     * @param  {string} url       URL to parse.
     * @param  {string} parameter Parameter name to remove.
     * 
     * @return {string}           URL with specified parameter key/value pair removed.
     *
     * @author  Chris Rittelmeyer
     */
    function _removeParameterByName(url, parameter) {
      if (typeof parameter == "undefined" || parameter == null || parameter == "") throw new Error( "parameter is required" );

      url = url.replace(new RegExp("\\b" + parameter + "=[^&;]+[&;]?", "gi"), "");

      // remove any leftover crud & return
      return url.replace(/[&;]$/, "");
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