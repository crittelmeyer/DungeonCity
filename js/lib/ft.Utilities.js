/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var ft = ft || {};


define(["jquery", "Mustache"], function($, Mustache) {
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

		return {
			ajaxGet: _ajaxGet,
			showLoader: _showLoader,
			hideLoader: _hideLoader
		}
	})();
});